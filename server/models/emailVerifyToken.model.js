import mongoose from 'mongoose';

const emailVerifyTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    expires: '5 min',
    default: Date.now,
  },
  token: {
    type: String,
    required: true,
  },
});

export default mongoose.model('EmailVerifyToken', emailVerifyTokenSchema);
