import express from 'express';

import authController from '../controllers/auth.controller';

export const authRouter = express.Router();

authRouter.get('/login', authController.loginForm);
authRouter.get('/login/facebook', authController.loginFacebook);
authRouter.get('/login/facebook/callback', authController.loginFacebookCallback);
authRouter.post('/login', authController.loginUser);
authRouter.get('/logout', authController.logoutUser);
