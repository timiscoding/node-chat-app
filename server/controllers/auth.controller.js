import passport from 'passport';

const loginForm = (req, res) => {
  res.render('login');
};

const loginUser = passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: true,
});

const logoutUser = (req, res) => {
  req.logout();
  req.flash('info', 'You have logged out');
  res.redirect('/');
};

const genOauthLogin = (provider, config) => ({
  requestPermission() {
    if (config.scope) {
      return passport.authenticate(provider, { scope: config.scope });
    }
    return passport.authenticate(provider);
  },
  callback(req, res, next) {
    passport.authenticate(provider, (err, user, info, status) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('error', `You did not give permission to login with ${provider[0].toUpperCase() + provider.substring(1)}`);
        return res.redirect('/login');
      }

      return req.login(user, (error) => {
        if (error) { return next(error); }
        req.flash('success', `You have logged in, ${user[provider].displayName || user[provider].username}`);
        if (user.firstLogin) { return res.redirect('/settings'); }
        return res.redirect('/');
      });
    })(req, res, next);
  },
});

const settings = async (req, res) => {
  // if logging in for first time, show settings page. else, just redirect to home page.
  const connectedAccounts = [];
  if (req.user.email) {
    const localAccount = await User.findOne({ email: profile.emails[0].value });
    if (localAccount) {
      connectedAccounts.push({ type: 'local', email });
    }
  }
  // if (req.user.facebookId && profile.provider) {

  // }
  res.send('this be settings');
};

export default {
  loginForm, loginUser, logoutUser, genOauthLogin, settings,
};
