import express from 'express';

import authController from '../controllers/auth.controller';

export const authRouter = express.Router();

authRouter.get('/login', authController.loginForm);
authRouter.post('/login', authController.loginUser);
authRouter.get('/logout', authController.logoutUser);
