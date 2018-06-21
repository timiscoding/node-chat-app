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

const loginFacebook = passport.authenticate('facebook');

const loginFacebookCallback = passport.authenticate('facebook', {
  failureRedirect: '/login',
  failureFlash: 'You did not authorize this app to login via Facebook',
  successFlash: true,
  successReturnToOrRedirect: '/',
});

export default {
  loginForm, loginUser, logoutUser, loginFacebook, loginFacebookCallback,
};
