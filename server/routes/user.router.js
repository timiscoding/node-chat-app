import express from 'express';
import { ensureLoggedIn } from 'connect-ensure-login';
import mongoose from 'mongoose';
import userController from '../controllers/user.controller';

export const userRouter = express.Router();
const User = mongoose.model('User');

userRouter.param('id', async (req, res, next, id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user id');
    }
    const user = await User.findById(id);
    if (!user) {
      throw new Error('No user found');
    } else {
      req.docFromId = user;
      next();
    }
  } catch (err) {
    next(err.message);
  }
});

userRouter.route('/signup')
  .get(userController.signupForm)
  .post(userController.validateNewUser, userController.createOne, userController.sendConfirmEmail);

userRouter.route('/user/:id')
  .get(ensureLoggedIn(), userController.getOne)
  .put(userController.updateOne)
  .delete(userController.deleteOne);

userRouter.route('/resend')
  .get(userController.requestResend)
  .post(userController.validateEmail, userController.resend, userController.sendConfirmEmail);
userRouter.get('/confirm/:token', userController.confirmEmail);

userRouter.route('/forgot')
  .get(userController.forgotPasswordForm)
  .post(userController.validateEmail, userController.forgotPassword, userController.sendResetEmail);

userRouter.route('/reset/:token')
  .get(userController.validResetToken, userController.resetPasswordForm)
  .post(userController.validResetToken, userController.validatePassword, userController.resetPassword, userController.sendPasswordUpdatedEmail);
