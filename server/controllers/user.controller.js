import mongoose from 'mongoose';
import crypto from 'crypto';
import rp from 'request-promise';

import { userValidatorSchema, validateUserForm } from './userValidator';
import { catchAsyncError } from '../utils/helpers';
import mailer from '../mailer';

const User = mongoose.model('User');
const EmailVerifyToken = mongoose.model('EmailVerifyToken');

const signupForm = (req, res) => {
  res.render('signup', { recaptchaKey: process.env.G_RECAPTCHA_SITE_KEY });
};

const validateNewUser = validateUserForm(userValidatorSchema(), 'signup');

const validateHuman = failureView => async (req, res, next) => {
  const options = {
    method: 'POST',
    uri: 'https://www.google.com/recaptcha/api/siteverify',
    formData: {
      secret: process.env.G_RECAPTCHA_SECRET,
      response: req.body['g-recaptcha-response'],
    },
    json: true,
  };

  try {
    const captchaRes = await rp(options);

    if (captchaRes.success) {
      return next();
    }
  } catch (err) {
    return next(err);
  }

  req.flash('error', 'reCaptcha failed. Please try again');
  return res.render(failureView, {
    body: req.body,
    flashes: req.flash(),
    recaptchaKey: process.env.G_RECAPTCHA_SITE_KEY,
  });
};

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
      res.render('signup', {
        body: { username, email },
        flashes: req.flash(),
        recaptchaKey: process.env.G_RECAPTCHA_SITE_KEY,
      });
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
  res.render('confirmEmail', { recaptchaKey: process.env.G_RECAPTCHA_SITE_KEY });
};

const validateEmail = validateUserForm(userValidatorSchema('email'), 'confirmEmail');

const resend = async (req, res, next) => {
  const user = await User.findOne({ 'local.email': req.body.email });

  if (!user || !user.local) {
    req.flash('info', 'An account with this email does not exist');
    return res.render('confirmEmail', { body: req.body, flashes: req.flash() });
  }

  if (user.local && user.local.isVerified) {
    req.flash('info', 'The email for this account is already confirmed');
    return res.redirect('/');
  }

  req.emailToken = await EmailVerifyToken.findOneOrCreate(user.id);
  req.body.username = user.username;
  return next();
};

/* Reset password */

const forgotPasswordForm = (req, res) => {
  res.render('forgotPassword', { recaptchaKey: process.env.G_RECAPTCHA_SITE_KEY });
};

const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ 'local.email': req.body.email });

  if (!user || !user.local) {
    req.flash('info', 'An account with this email does not exist');
    return res.render('forgotPassword', { body: req.body, flashes: req.flash() });
  }

  user.passwordResetToken = crypto.randomBytes(20).toString('hex');
  user.passwordResetExpires = Date.now() + 3600000;
  await user.save();
  req.emailToken = user.passwordResetToken;
  req.body.username = user.username;
  return next();
};

const sendResetEmail = (req, res) => {
  const { email, username } = req.body;

  mailer.send({
    template: 'resetPassword',
    message: {
      to: email,
    },
    locals: {
      name: username,
      resetURL: `${req.protocol}://${req.hostname}/reset/${req.emailToken}`,
    },
  });

  req.flash('info', `An email has been sent to ${email} with instructions to reset your password.`);
  res.redirect('/');
};

const validResetToken = async (req, res, next) => {
  const user = await User.findOne({
    passwordResetToken: req.params.token,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    req.flash('error', 'This password reset is invalid or expired. Please request a new one');
    return res.redirect('/forgot');
  }
  req.user = user;
  return next();
};

const resetPasswordForm = async (req, res) => {
  res.render('resetPassword');
};

const validatePassword = validateUserForm(userValidatorSchema('password', 'password-confirm'), 'resetPassword');

const resetPassword = async (req, res, next) => {
  const { user } = req;

  user.local.password = await User.hashPassword(req.body.password);
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  await req.login(user);
  next();
};

const sendPasswordUpdatedEmail = async (req, res) => {
  const { local: { email }, username } = req.user;

  mailer.send({
    template: 'updatedPassword',
    message: {
      to: email,
    },
    locals: {
      name: username,
    },
  });

  req.flash('success', 'Password has been updated');
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
  validateNewUser,
  confirmEmail: catchAsyncError(confirmEmail),
  requestResend,
  validateEmail,
  resend,
  sendConfirmEmail,
  forgotPasswordForm,
  forgotPassword: catchAsyncError(forgotPassword),
  sendResetEmail,
  resetPasswordForm,
  validatePassword,
  resetPassword: catchAsyncError(resetPassword),
  validResetToken: catchAsyncError(validResetToken),
  sendPasswordUpdatedEmail: catchAsyncError(sendPasswordUpdatedEmail),
  validateHuman,
};
