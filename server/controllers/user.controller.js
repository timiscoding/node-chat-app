import mongoose from 'mongoose';
import { catchAsyncError } from '../utils/helpers';

const User = mongoose.model('User');

const signupForm = (req, res) => {
  res.render('signup');
};

const createOne = async (req, res) => {
  const { email, password, username } = req.body;
  const user = new User({ email, password, username });
  await user.save();
  req.flash('success', 'New account created!');
  res.redirect('/');
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
  signupForm,
};
