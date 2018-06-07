import mongoose from 'mongoose';
import { checkSchema, validationResult } from 'express-validator/check';

import { catchAsyncError } from '../utils/helpers';

const User = mongoose.model('User');

const signupForm = (req, res) => {
  res.render('signup');
};

const validateNewUser = [
  checkSchema({
    username: {
      in: 'body',
      isLength: {
        errorMessage: 'must not be empty',
        options: { min: 1 },
      },
      isAlphanumeric: {
        errorMessage: 'must be letters or numbers only',
      },
      trim: true,
    },
    email: {
      in: 'body',
      isEmail: {
        errorMessage: 'must be a valid email',
      },
      trim: true,
      normalizeEmail: {
        options: {
          all_lowercase: true,
          gmail_convert_googlemaildotcom: true,
          gmail_remove_dots: true,
          gmail_remove_subaddress: true,
        },
      },
    },
    password: {
      in: 'body',
      isLength: {
        errorMessage: 'must be at least 5 characters long',
        options: { min: 5 },
      },
      trim: true,
    },
    'password-confirm': {
      in: 'body',
      custom: {
        options: (value, { req }) => {
          if (req.body.password !== value) {
            throw new Error('Password confirmation does not match password entered');
          }
          return true;
        },
      },
    },
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
    } else {
      req.flash('error', errors.mapped());
      const { username, email } = req.body;
      res.render('signup', { body: { username, email }, flashes: req.flash() });
    }
  }];

const createOne = async (req, res, next) => {
  const { email, password, username } = req.body;
  const user = new User({ email, password, username });
  try {
    await user.save();
    req.login(user, next);
    req.flash('success', 'New account created!');
    res.redirect('/');
  } catch (err) {
    if (err.errors) {
      req.flash('error', err.errors);
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
