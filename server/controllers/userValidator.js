import _ from 'lodash';
import { validationResult, checkSchema } from 'express-validator/check';

const userSchema = {
  username: {
    in: 'body',
    isLength: {
      errorMessage: 'Username must not be empty',
      options: { min: 1 },
    },
    custom: {
      options: (value) => {
        const guestRe = /^guest\d+$/i;
        const validUserRe = /^[\w-]+$/;
        if (!validUserRe.test(value)) {
          throw new Error("Username must be letters, numbers, '_', ' -' only");
        } else if (guestRe.test(value)) {
          throw new Error("Usernames beginning with 'guest' followed by a number are reserved for unregistered users");
        }
        return true;
      },
    },
    trim: true,
  },
  email: {
    in: 'body',
    isEmail: {
      errorMessage: 'Email address is not valid',
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
      errorMessage: 'Password must be at least 5 characters long',
      options: { min: 5 },
    },
    trim: true,
  },
  'password-confirm': {
    in: 'body',
    custom: {
      options: (value, { req }) => {
        if (req.body.password !== value) {
          throw new Error('Password confirmation does not match password field');
        }
        return true;
      },
    },
  },
};

const userValidatorSchema = (...fields) =>
  (fields.length ? _.pick(userSchema, fields) : userSchema);

const validateUserForm = (schema, view) => [
  checkSchema(schema),
  (req, res, next) => {
    const errors = validationResult(req).formatWith(({ msg }) => msg);
    if (errors.isEmpty()) {
      next();
    } else {
      req.flash('error', errors.array({ onlyFirstError: true }));
      res.render(view, {
        body: req.body,
        flashes: req.flash(),
        recaptchaKey: process.env.G_RECAPTCHA_SITE_KEY });
    }
  },
];

export { userValidatorSchema, validateUserForm };
