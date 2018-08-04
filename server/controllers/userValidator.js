import _ from 'lodash';
import { validationResult, checkSchema } from 'express-validator/check';

const userSchema = {
  username: {
    in: 'body',
    isLength: {
      errorMessage: 'Username must not be empty',
      options: { min: 1 },
    },
    matches: {
      errorMessage: "Username must be letters, numbers, '_', '-' only",
      options: /^[\w-]+$/,
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
      res.render(view, { body: req.body, flashes: req.flash() });
    }
  },
];

export { userValidatorSchema, validateUserForm };