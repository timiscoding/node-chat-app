import mongoose from 'mongoose';
import { checkSchema, validationResult } from 'express-validator/check';

import userValidatorSchema from './userValidatorSchema';
import { catchAsyncError } from '../utils/helpers';

const User = mongoose.model('User');

const signupForm = (req, res) => {
  res.render('signup');
};

const validateNewUser = [
  checkSchema(userValidatorSchema()),
  (req, res, next) => {
    const errors = validationResult(req).formatWith(({ msg }) => msg);
    if (errors.isEmpty()) {
      next();
    } else {
      req.flash('error', errors.array({ onlyFirstError: true }));
      res.render('signup', { body: req.body, flashes: req.flash() });
    }
  }];

const createOne = async (req, res, next) => {
  const { email, password, username } = req.body;
  try {
    const user = new User({
      local: { email, password: await User.hashPassword(password) },
      username,
    });
    await user.save();
    req.login(user, next);
    req.flash('success', 'New account created!');
    res.redirect('/');
  } catch (err) {
    if (err.errors) {
      const keys = Object.keys(err.errors);
      const flashes = keys.map(key => err.errors[key].message);
      req.flash('error', flashes);
      res.render('signup', { body: { username, email }, flashes: req.flash() });
    } else {
      next(err);
    }
  }
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
  createOne,
  getOne: catchAsyncError(getOne),
  updateOne: catchAsyncError(updateOne),
  deleteOne: catchAsyncError(deleteOne),
  signupForm,
  validateNewUser,
};
