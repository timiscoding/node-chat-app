import passport from 'passport';

const loginForm = (req, res) => {
  res.render('login');
};

const loginUser = passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
});

export default { loginForm, loginUser };
