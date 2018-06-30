import express from 'express';

import authController from '../controllers/auth.controller';
import { catchAsyncError } from '../utils/helpers';

export const authRouter = express.Router();

authRouter.get('/login', authController.loginForm);
authRouter.post('/login', authController.loginUser);
authRouter.get('/logout', authController.logoutUser);
authRouter.get('/settings', catchAsyncError(authController.settings));

((providers) => {
  providers.forEach(({ provider, config = {} }) => {
    const { requestPermission, callback } = authController.genOauthLogin(provider, config);
    authRouter.get(`/login/${provider}`, requestPermission());
    authRouter.get(`/login/${provider}/callback`, callback);
  });
})([
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
]);
