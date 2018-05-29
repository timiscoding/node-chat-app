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
  .post(userController.createOne);

userRouter.route('/user/:id')
  .get(ensureLoggedIn(), userController.getOne)
  .put(userController.updateOne)
  .delete(userController.deleteOne);
