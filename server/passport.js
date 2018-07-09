import passport from 'passport';
import LocalStrategy from 'passport-local';
import FacebookStrategy from 'passport-facebook';
import TwitterStrategy from 'passport-twitter';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import mongoose from 'mongoose';
import _ from 'lodash';

const User = mongoose.model('User');

passport.use(new LocalStrategy(
  { usernameField: 'email', passReqToCallback: true },
  async (req, email, password, done) => {
    try {
      const user = await User.findOne({ 'local.email': email });
      if (!user) {
        return done(null, false, { message: 'Email or password is invalid' });
      }

      const isValidPassword = await user.isValidPassword(password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Email or password is invalid' });
      }

      if (!user.local.isVerified) {
        return done(null, false, { message: 'Your account needs to be verified via email before you can log in' });
      }

      /* user is either
         a) already logged in via oauth and trying to link this local account so the user will be
         injected into req.account
         b) logging into their local account so the user will be injected into req.user */
      return done(null, user);
    } catch (err) {
      return done(err, null, { message: 'Could not authenticate. Please try again' });
    }
  },
));

const getEmail = profile => profile.emails && profile.emails.length && profile.emails[0].value;
const createAccount = async (provider, token, profile) => User.create({
  [provider]: {
    id: profile.id,
    displayName: profile.displayName,
    token,
    email: getEmail(profile),
  },
  username: await User.genUniqueUsername(profile.username || profile.displayName),
});

const genOauthCb = provider => async (req, accessToken, refreshTokenOrSecret, profile, done) => {
  try {
    let user = await User.findOne({ [`${provider}.id`]: profile.id });
    if (!req.user) { // not already logged in
      if (user) {
        if (!user[provider].token) { // user unlinked this account but has logged in later
          user[provider] = {
            id: profile.id,
            displayName: profile.displayName,
            token: accessToken,
            email: getEmail(profile),
          };
          user = await user.save();
        }
        return done(null, user);
      }

      user = await createAccount(provider, accessToken, profile);

      /* when a user logs in for the first time, we need a way to inform the authController so that
         they can send them to a profile page to let them change their username if they want.
         firstLogin is my own custom prop that will be sent to the custom callback whenever
         passport.auth(enticate|orize)() is called
         */
      return done(null, user, { firstLogin: true });
    }
    /* user already logged in and trying to link another account  */

    /* if user tries to link an already linked account, just return the original user */
    if (user) {
      /* user previously unlinked account and now wants to relink it.
        we must update the token and other profile info */
      if (!user[provider].token) {
        user = await createAccount(provider, accessToken, profile);
      }
      return done(null, user);
    }

    /* user linking an account they have never authorised before so lets create it first */
    user = await createAccount(provider, accessToken, profile);

    return done(null, user);
  } catch (err) {
    return done(err, false, { message: 'Could not authenticate. Please try again' });
  }
};

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.DOMAIN}/auth/facebook/callback`,
    profileFields: ['email', 'displayName'],
    passReqToCallback: true,
  },
  genOauthCb('facebook'),
));

passport.use(new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: `${process.env.DOMAIN}/auth/twitter/callback`,
    passReqToCallback: true,
  },
  genOauthCb('twitter'),
));

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: `${process.env.DOMAIN}/auth/google/callback`,
    passReqToCallback: true,
  },
  genOauthCb('google'),
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});
