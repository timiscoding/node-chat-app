import passport from 'passport';
import mongoose from 'mongoose';

import { userValidatorSchema, validateUserForm } from './userValidator';

const User = mongoose.model('User');

const loginForm = (req, res) => res.render('login');

// logs in a user
const loginUser = passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: 'You have logged in',
});

const logoutUser = (req, res) => {
  req.logout();
  req.flash('info', 'You have logged out');
  res.redirect('/');
};

// checks credentials but does not log them in
const authLocal = passport.authorize('local', {
  failureRedirect: '/link/local',
  failureFlash: 'Email or password is invalid',
});

const linkLocalForm = (req, res) => res.render('link_local');

const genOauthLogin = (provider, config = {}) => ({
  auth(req, res, next) {
    const fn = req.user ? passport.authorize : passport.authenticate;
    return fn.call(passport, provider, config.scope && { scope: config.scope })(req, res, next);
  },
  authCb(req, res, next) {
    const fn = req.user ? passport.authorize : passport.authenticate;
    const routes = req.user ?
      {
        failureRedirect: '/profile',
        failureFlash: `${provider} account was not linked`,
      } :
      (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
          req.flash('error', `Permission to login via ${provider} was denied`);
          return res.redirect('/login');
        }

        return req.login(user, (error) => {
          if (error) { return next(error); }
          req.flash('success', `You have logged in, ${user[provider].displayName || user[provider].username}`);
          if (info.firstLogin) { return res.redirect('/profile'); }
          return res.redirect('/');
        });
      };
    return fn.call(passport, provider, routes)(req, res, next);
  },
});

const linkAccount = async (req, res, next) => {
  const { user, account } = req;

  // user who has already logged in has authorised another account so we need to link them
  if (user && account) {
    const accountObj = account.toObject({
      transform(doc, ret) {
        const newRet = Object.assign({}, ret);
        delete newRet.__v;
        delete newRet._id;
        return newRet;
      },
    });
    if (accountObj.local) {
      /* if req.user is a social account and they try to link to local, then we must delete the
          local account otherwise there will be a duplicate in the db when we try to add the local
          info to the social account. Since the user model doesn't allow duplicate emails, it will
          throw an error if we didn't do this */
      await User.deleteOne({ 'local.email': accountObj.local.email });
    }
    // merge accounts but preserve original username
    Object.assign(user, accountObj, { username: user.username });
    await user.save();
    await account.remove();
    req.flash('success', 'Accounts have been linked');
    return res.redirect('/profile');
  }
  return next();
};

const unlinkAccount = async (req, res, next) => {
  const type = req.params.account;
  const types = ['twitter', 'google', 'facebook', 'local'];
  const { user } = req;
  if (!types.includes(type)) {
    const err = new Error('Unknown account type');
    err.status = 400;
    return next(err);
  }

  if (user.accountsTotal === 1) {
    req.flash('error', 'Unable to unlink solo account');
    return res.redirect('/profile');
  }

  if (type === 'local') {
    const local = Object.assign({}, user.local);
    user.local = undefined;
    await user.save();
    await User.create({ local, username: await User.genUniqueUsername() });
  } else {
    user[type].token = undefined;
    await user.save();
  }
  req.flash('success', 'Account has been unlinked');
  res.redirect('/profile');
};

const profile = (req, res) => {
  const { user } = req;

  const linkedAccounts = Object.entries(user.toObject()).reduce((all, [type, acc]) => {
    if ((type === 'local' && acc.email) || acc.token) {
      all[type] = acc.email || acc.displayName;
    }
    return all;
  }, {});

  const linkable = ['local', 'twitter', 'google', 'facebook']
    .filter(type => !linkedAccounts[type]);

  res.render('profile', {
    body: { username: req.user.username, email: req.user.local.email },
    linkedAccounts,
    linkable,
  });
};

const preValidateProfile = (req, res, next) => {
  if (req.body.password) {
    return next('route');
  }
  next();
};

const validateProfile = validateUserForm(userValidatorSchema('username', 'email'), 'profile');
const validateProfilePassword = validateUserForm(userValidatorSchema('username', 'email', 'password', 'password-confirm'), 'profile');

const updateProfile = async (req, res) => {
  const { username, email, password } = req.body;
  if (username !== req.user.username) {
    req.user.username = username;
  }

  if (req.user.local && email !== req.user.local.email) {
    req.user.local.email = email;
  }

  if (password) {
    req.user.local.password = await User.hashPassword(password);
  }

  await req.user.save();
  req.flash('success', 'Account updated');
  res.redirect('/profile');
};

export default {
  loginForm,
  loginUser,
  logoutUser,
  genOauthLogin,
  profile,
  authLocal,
  linkAccount,
  unlinkAccount,
  linkLocalForm,
  validateProfile,
  updateProfile,
  preValidateProfile,
  validateProfilePassword,
};
