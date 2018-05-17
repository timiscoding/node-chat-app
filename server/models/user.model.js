import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'You must supply a email',
    unique: 'Email already exists',
    trim: true,
    lowercase: true,
    validate: [isEmail, 'Email is not valid'],
  },
  password: {
    type: String,
    required: 'You must supply a password',
    trim: true,
    minlength: 5,
  },
});

userSchema.methods = {
  hashPassword(plaintextPassword) {
    if (!plaintextPassword) {
      throw new Error('Password cannot be blank');
    }
    return bcrypt.hash(plaintextPassword, 12);
  },
  checkPassword(password) {
    return bcrypt.compare(password, this.password);
  },
};

userSchema.pre('save', async function preSaveUser(next) {
  this.password = await this.hashPassword(this.password);
  next();
});

export default mongoose.model('User', userSchema);
