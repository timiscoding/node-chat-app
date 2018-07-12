import mongoose from 'mongoose';
import { checkSchema, validationResult } from 'express-validator/check';
import crypto from 'crypto';

import userValidatorSchema from './userValidatorSchema';
import { catchAsyncError } from '../utils/helpers';
import mailer from '../mailer';

const User = mongoose.model('User');
const EmailVerifyToken = mongoose.model('EmailVerifyToken');

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
    const user = await User.create({
      local: { email, password: await User.hashPassword(password) },
      username,
    });

    const emailToken = await EmailVerifyToken.create({
      user: user.id,
      token: crypto.randomBytes(20).toString('hex'),
    });

    await mailer.send({
      template: 'verifyEmail',
      message: {
        to: email,
      },
      locals: {
        name: username,
        confirmURL: `${req.protocol}://${req.hostname}/confirm/${emailToken.token}`,
      },
    });

    req.flash('info', `An email has been sent to ${email}. Please confirm your email to complete sign up.`);
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

const confirmEmail = async (req, res) => {
  const token = await EmailVerifyToken.findOneAndRemove({ token: req.params.token }).populate('user');
  if (!token) {
    req.flash('error', 'Email verification invalid. Please check the link.');
    return res.redirect('/');
  }

  const { user } = token;
  user.local.isVerified = true;
  await user.save();
  await req.login(user);
  req.flash('success', 'Your email has been confirmed. You are now logged in');
  return res.redirect('/');
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
  validateNewUser,
  confirmEmail: catchAsyncError(confirmEmail),
};
