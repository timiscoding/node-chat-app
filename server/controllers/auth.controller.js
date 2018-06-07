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

export default { loginForm, loginUser, logoutUser };
