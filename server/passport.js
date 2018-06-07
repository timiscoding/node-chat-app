import passport from 'passport';
import LocalStrategy from 'passport-local';
import mongoose from 'mongoose';

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

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});
