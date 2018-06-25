import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';
import beautifyUnique from 'mongoose-beautiful-unique-validation';

const userSchema = new mongoose.Schema({
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
    required: 'Username is required',
    unique: 'Username already taken',
    sparse: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-]+$/, "Username must contain alphanumeric, '-', '_' characters only"],
  },
  facebookId: {
    type: String,
    unique: 'An account with this Facebook already exists',
    sparse: true,
  },
  twitterId: {
    type: String,
    unique: 'An account with this Twitter already exists',
    sparse: true,
  },
});

userSchema.methods = {
  hashPassword(plaintextPassword) {
    if (!plaintextPassword) {
      throw new Error('Password cannot be blank');
    }
    return bcrypt.hash(plaintextPassword, 12);
  },
  isValidPassword(password) {
    return bcrypt.compare(password, this.password);
  },
};

userSchema.pre('save', async function preSaveUser(next) {
  if (this.password) { // password might not be supplied if logging in via oauth
    this.password = await this.hashPassword(this.password);
  }
  next();
});

// if client tries creating a duplicate on a unique field, it will produce a low level
// mongo db error. This plugin transforms that error into a mongoose validation error
// that exists in an 'errors' object
userSchema.plugin(beautifyUnique);

export default mongoose.model('User', userSchema);
