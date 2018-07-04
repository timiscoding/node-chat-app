import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';
import beautifyUnique from 'mongoose-beautiful-unique-validation';

const userSchema = new mongoose.Schema({
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
    username: {
      type: String,
      // required: 'Username is required',
      unique: 'Username already taken',
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/^[\w-]+$/, "Username must contain alphanumeric, '-', '_' characters only"],
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
});

userSchema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compare(password, this.local.password);
};

userSchema.statics.hashPassword = function hashPassword(plaintextPassword) {
  if (!plaintextPassword) {
    throw new Error('Password cannot be blank');
  }
  return bcrypt.hash(plaintextPassword, 12);
};

// if client tries creating a duplicate on a unique field, it will produce a low level
// mongo db error. This plugin transforms that error into a mongoose validation error
// that exists in an 'errors' object
userSchema.plugin(beautifyUnique);

export default mongoose.model('User', userSchema);
