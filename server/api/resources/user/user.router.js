import express from 'express';
import mongoose from 'mongoose';
import * as userController from './user.controller';

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

userRouter.route('/')
  .get(userController.getAll)
  .post(userController.createOne);

userRouter.route('/:id')
  .get(userController.getOne)
  .put(userController.updateOne)
  .delete(userController.deleteOne);
