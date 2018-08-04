import express from 'express';

import authController from '../controllers/auth.controller';
import { catchAsyncError } from '../utils/helpers';

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

export const authRouter = express.Router();

authRouter.get('/login', authController.loginForm);
authRouter.post('/login', authController.loginUser);
authRouter.get('/logout', isLoggedIn, authController.logoutUser);
authRouter.get('/profile', isLoggedIn, authController.profile);
authRouter.post('/profile', isLoggedIn, authController.validateProfile, catchAsyncError(authController.updateProfile));
authRouter.get('/link/local', isLoggedIn, authController.linkLocalForm);
authRouter.post('/link/local', isLoggedIn, authController.authLocal, catchAsyncError(authController.linkAccount));
authRouter.post('/unlink/:account', isLoggedIn, catchAsyncError(authController.unlinkAccount));

[
  {
    provider: 'facebook',
    config: {
      scope: 'email',
    },
  },
  { provider: 'twitter' },
  {
    provider: 'google',
    config: {
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
    },
  },
].forEach(({ provider, config }) => {
  const { auth, authCb } = authController.genOauthLogin(provider, config);
  authRouter.get(`/auth/${provider}`, auth);
  authRouter.get(`/auth/${provider}/callback`, authCb, catchAsyncError(authController.linkAccount));
  authRouter.get(`/link/${provider}`, isLoggedIn, auth);
});
