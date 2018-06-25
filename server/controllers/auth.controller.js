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
  callback: passport.authenticate(provider, {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login',
    failureFlash: `Permission to login with ${provider[0].toUpperCase() + provider.substring(1).toLowerCase()} was denied`,
    successFlash: true,
  }),
});

export default {
  loginForm, loginUser, logoutUser, genOauthLogin,
};
