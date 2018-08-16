import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';
import beautifyUnique from 'mongoose-beautiful-unique-validation';
import _ from 'lodash';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: 'Username is required',
    unique: 'Username already taken',
    sparse: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-]+$/, "Username must contain alphanumeric, '-', '_' characters only"],
  },
  local: {
    email: {
      type: String,
      unique: 'An account with email {VALUE} already exists',
      sparse: true, // allows us to add documents without unique fields
      trim: true,
      lowercase: true,
      validate: [isEmail, 'Email is not valid'],
    },
    password: {
      type: String,
      trim: true,
      minlength: 5,
    },
    isVerified: {
      type: Boolean,
    },
  },
  facebook: {
    id: String,
    token: String,
    displayName: String,
    email: String,
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String,
  },
  google: {
    id: String,
    token: String,
    displayName: String,
    email: String,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compare(password, this.local.password);
};

const types = ['twitter', 'google', 'facebook', 'local'];
userSchema.methods.accountsTotal = function accountsTotal() {
  return Object.keys(this.toObject()).reduce((total, f) => {
    if (types.includes(f)) {
      if (f === 'local' || (f !== 'local' && this[f].token)) {
        return total + 1;
      }
    }
    return total;
  }, 0);
};

userSchema.statics.hashPassword = function hashPassword(plaintextPassword) {
  if (!plaintextPassword) {
    throw new Error('Password cannot be blank');
  }
  return bcrypt.hash(plaintextPassword, 12);
};

userSchema.statics.genUniqueUsername = async function genUniqueUsername(name = 'anon') {
  const snakeCase = name.toLowerCase().replace(/ /g, '_');
  const usernameRegex = new RegExp(`^${snakeCase}\d*$`);
  const usernames = await this.find({ username: usernameRegex }, 'username');
  let newUsername = snakeCase;
  // find the first unique username with format username<incrementing number>
  for (let i = 0; _.find(usernames, { username: newUsername }); i += 1) {
    newUsername = snakeCase + (usernames.length + i);
  }
  return newUsername;
};

// if client tries creating a duplicate on a unique field, it will produce a low level
// mongo db error. This plugin transforms that error into a mongoose validation error
// that exists in an 'errors' object
userSchema.plugin(beautifyUnique);

export default mongoose.model('User', userSchema);
