import passport from 'passport';
import LocalStrategy from 'passport-local';
import FacebookStrategy from 'passport-facebook';
import TwitterStrategy from 'passport-twitter';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import mongoose from 'mongoose';
import _ from 'lodash';

const User = mongoose.model('User');

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ 'local.email': email });
    if (!user) {
      return done(null, false, { message: 'User or password is invalid' });
    }

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return done(null, false, { message: 'User or password is invalid' });
    }

    return done(null, user, { message: `You have logged in, ${user.local.username}` });
  } catch (err) {
    return done(err, null, { message: 'Could not authenticate. Please try again' });
  }
}));

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

const genOauth2VerifyCallback = provider => async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ [`${provider}.id`]: profile.id });
    if (user) {
      return done(null, user);
    }

    let email;
    if (profile.emails && profile.emails.length) {
      email = profile.emails[0].value;
    }
    user = await User.create({
      [provider]: {
        id: profile.id,
        username: await genUniqueUsername(profile.username),
        displayName: profile.displayName,
        token: accessToken,
        email,
      },
    });
    user.firstLogin = true;
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
  },
  genOauth2VerifyCallback('facebook'),
));

passport.use(new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: `${process.env.DOMAIN}/login/twitter/callback`,
  },
  async (token, tokenSecret, profile, done) => {
    try {
      let user = await User.findOne({ 'twitter.id': profile.id });

      if (user) {
        return done(null, user, { message: `You have logged in, ${user.twitter.username}` });
      }

      user = await User.create({
        twitter: {
          id: profile.id,
          token,
          username: await genUniqueUsername(profile.username),
          displayName: profile.displayName,
        },
      });

      return done(null, user, { message: `You have logged in, ${user.twitter.username}` });
    } catch (err) {
      return done(err, false, { message: 'Could not authenticate. Please try again' });
    }
  },
));

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: `${process.env.DOMAIN}/login/google/callback`,
  },
  genOauth2VerifyCallback('google'),
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
