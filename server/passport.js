import passport from 'passport';
import LocalStrategy from 'passport-local';
import FacebookStrategy from 'passport-facebook';
import mongoose from 'mongoose';
import _ from 'lodash';

const User = mongoose.model('User');

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'User or password is invalid' });
    }

    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return done(null, false, { message: 'User or password is invalid' });
    }

    return done(null, user, { message: `You have logged in, ${user.username}` });
  } catch (err) {
    return done(err, null, { message: 'Could not authenticate. Please try again' });
  }
}));

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.DOMAIN}/login/facebook/callback`,
  },
  (async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ facebookId: profile.id });
      if (user) {
        return done(null, user, { message: `You have logged in, ${user.username}` });
      }

      // first time logging in so create a new username for them
      const name = profile.displayName.toLowerCase().replace(/ /g, '_');
      const usernameRegex = new RegExp(`^${name}\d*$`);
      const usernames = await User.find({ username: usernameRegex }, 'username');
      let newUsername = name;
      // find the first unique username with format username<incrementing number>
      for (let i = 0; _.find(usernames, { username: newUsername }); i += 1) {
        newUsername = name + (usernames.length + i);
      }

      user = await User.create({ facebookId: profile.id, username: newUsername });
      return done(null, user, { message: `You have logged in, ${user.username}` });
    } catch (err) {
      done(err, false, { message: 'Could not authenticate. Please try again' });
    }
  }),
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
