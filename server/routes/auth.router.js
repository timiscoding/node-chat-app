import express from 'express';

import authController from '../controllers/auth.controller';

export const authRouter = express.Router();

authRouter.get('/login', authController.loginForm);
authRouter.post('/login', authController.loginUser);
authRouter.get('/logout', authController.logoutUser);

((providers) => {
  providers.forEach((provider) => {
    const { requestPermission, callback } = authController.genOauthLogin(provider);
    authRouter.get(`/login/${provider}`, requestPermission);
    authRouter.get(`/login/${provider}/callback`, callback);
  });
})(['facebook', 'twitter']);
