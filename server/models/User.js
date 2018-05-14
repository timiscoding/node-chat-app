import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'You must supply a email',
    unique: 'Email already exists',
    trim: true,
    lowercase: true,
    validate: [isEmail, 'Email is not valid'],
  },
});

export default mongoose.model('User', UserSchema);
