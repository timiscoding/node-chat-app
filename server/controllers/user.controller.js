import mongoose from 'mongoose';
import { catchAsyncError } from '../utils/helpers';

const User = mongoose.model('User');

const createOne = async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  const newUser = await user.save();
  res.send(`create user ${newUser}`);
};

const getOne = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.send(`get user\n ${user}`);
};

const updateOne = (req, res) => {
  res.send(`update user\n ${req.docFromId}`);
};

const deleteOne = (req, res) => {
  res.send(`delete user\n ${req.docFromId}`);
};

export default {
  createOne: catchAsyncError(createOne),
  getOne: catchAsyncError(getOne),
  updateOne: catchAsyncError(updateOne),
  deleteOne: catchAsyncError(deleteOne),
};
