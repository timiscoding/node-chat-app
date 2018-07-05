import _ from 'lodash';

const userValidatorSchema = (...fields) => {
  const schema = {
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

  return fields ? _.pick(schema, fields) : schema;
};

export default userValidatorSchema;
