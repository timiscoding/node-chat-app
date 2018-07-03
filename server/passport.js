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
        return done(null, false);
      }

      const isValidPassword = await user.isValidPassword(password);
      if (!isValidPassword) {
        return done(null, false);
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

const genUniqueUsername = async (name) => {
  if (!name) { return undefined; }
  const snakeCase = name.toLowerCase().replace(/ /g, '_');
  const usernameRegex = new RegExp(`^${snakeCase}\d*$`);
  const usernames = await User.find({ username: usernameRegex }, 'username');
  let newUsername = snakeCase;
  // find the first unique username with format username<incrementing number>
  for (let i = 0; _.find(usernames, { username: newUsername }); i += 1) {
    newUsername = snakeCase + (usernames.length + i);
  }
  return newUsername;
};

const getEmail = profile => profile.emails && profile.emails.length && profile.emails[0].value;

const genOauthCb = provider => async (req, accessToken, refreshTokenOrSecret, profile, done) => {
  try {
    let user = await User.findOne({ [`${provider}.id`]: profile.id });
    if (user) {
      return done(null, user);
    }

    user = await User.create({
      [provider]: {
        id: profile.id,
        username: await genUniqueUsername(profile.username),
        displayName: profile.displayName,
        token: accessToken,
        email: getEmail(profile),
      },
    });
    if (!req.user) { // not already logged in
      /* when a user logs in for the first time, we need a way to inform the authController so that
         they can send them to a profile page to let them change their username if they want.
         firstLogin is my own custom prop that will be sent to the custom callback whenever
         passport.auth(enticate|orize)() is called
         */
      return done(null, user, { firstLogin: true });
    }

    /* user already logged in and trying to link another account. Because this callback deals with
       authentication only, we should supply them with the account they are trying to connect.
       Linking should be done in another middleware */
    return done(null, user);
  } catch (err) {
    return done(err, false, { message: 'Could not authenticate. Please try again' });
  }
};

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.DOMAIN}/login/facebook/callback`,
    profileFields: ['email', 'displayName'],
    passReqToCallback: true,
  },
  genOauthCb('facebook'),
));

passport.use(new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: `${process.env.DOMAIN}/login/twitter/callback`,
    passReqToCallback: true,
  },
  genOauthCb('twitter'),
));

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: `${process.env.DOMAIN}/login/google/callback`,
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
