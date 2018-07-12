import mongoose from 'mongoose';
import crypto from 'crypto';

import { userValidatorSchema, validateUserForm } from './userValidator';
import { catchAsyncError } from '../utils/helpers';
import mailer from '../mailer';

const User = mongoose.model('User');
const EmailVerifyToken = mongoose.model('EmailVerifyToken');

const signupForm = (req, res) => {
  res.render('signup');
};

const validateNewUser = validateUserForm(userValidatorSchema(), 'signup');

const createOne = async (req, res, next) => {
  const { email, password, username } = req.body;
  try {
    const user = await User.create({
      local: { email, password: await User.hashPassword(password) },
      username,
    });

    req.emailToken = await EmailVerifyToken.createToken(user.id);
    next();
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

const sendConfirmEmail = (req, res) => {
  const { email, username } = req.body;

  mailer.send({
    template: 'verifyEmail',
    message: {
      to: email,
    },
    locals: {
      name: username,
      confirmURL: `${req.protocol}://${req.hostname}/confirm/${req.emailToken.token}`,
    },
  });

  req.flash('info', `An email has been sent to ${email}. Please confirm your email to complete sign up.`);
  res.redirect('/');
};

const confirmEmail = async (req, res) => {
  const token = await EmailVerifyToken.findOneAndRemove({ token: req.params.token }).populate('user');
  if (!token) {
    req.flash('error', `Email verification invalid. Either the link does not match the one provided
      in the email or the link may have expired. <a href="/resend">Resend email confirmation</a>`);
    return res.redirect('/');
  }

  const { user } = token;
  user.local.isVerified = true;
  await user.save();
  await req.login(user);
  req.flash('success', 'Your email has been confirmed. You are now logged in');
  return res.redirect('/');
};

/* Resend confirmation email */

const requestResend = (req, res) => {
  res.render('requestConfirmEmail');
};

const validateResend = validateUserForm(userValidatorSchema('email'), 'requestConfirmEmail');

const resend = async (req, res, next) => {
  const user = await User.findOne({ 'local.email': req.body.email });

  if (!user || !user.local) {
    req.flash('info', 'An account with this email does not exist');
    return res.render('requestConfirmEmail', { body: req.body, flashes: req.flash() });
  }

  if (user.local && user.local.isVerified) {
    req.flash('info', 'The email for this account is already confirmed');
    return res.redirect('/');
  }

  req.emailToken = await EmailVerifyToken.findOneOrCreate(user.id);
  req.body.username = user.username;
  return next();
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
  requestResend,
  validateResend,
  resend,
  sendConfirmEmail,
};
