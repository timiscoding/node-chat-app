import passport from 'passport';
import mongoose from 'mongoose';

const User = mongoose.model('User');

const loginForm = (req, res) => res.render('login');

// logs in a user
const loginUser = passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'Email or password is invalid',
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
    Object.assign(user, accountObj);
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
    await User.create({ local });
  } else {
    user[type].token = undefined;
    await user.save();
  }
  req.flash('success', 'Account has been unlinked');
  res.redirect('/profile');
};

const profile = async (req, res) => {
  res.render('profile');
};

export default {
  loginForm, loginUser, logoutUser, genOauthLogin, profile, authLocal, linkAccount, unlinkAccount, linkLocalForm,
};
