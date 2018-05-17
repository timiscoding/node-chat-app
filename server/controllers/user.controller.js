import mongoose from 'mongoose';
import { catchAsyncError } from '../utils/helpers';

const User = mongoose.model('User');

const createOne = async (req, res) => {
  const { email, password } = req.body;
  const user = new User({ email, password });
  const newUser = await user.save();
  res.send(`create user ${newUser}`);
};

const getOne = (req, res) => {
  res.send(`get user\n ${req.docFromId}`);
};

const updateOne = (req, res) => {
  res.send(`update user\n ${req.docFromId}`);
};

const deleteOne = (req, res) => {
  res.send(`delete user\n ${req.docFromId}`);
};

const getAll = (req, res) => {
  res.send('get all users');
};

export default {
  createOne: catchAsyncError(createOne),
  getOne: catchAsyncError(getOne),
  updateOne: catchAsyncError(updateOne),
  deleteOne: catchAsyncError(deleteOne),
  getAll: catchAsyncError(getAll),
};
