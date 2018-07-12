import mongoose from 'mongoose';
import crypto from 'crypto';

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

const token = () => crypto.randomBytes(20).toString('hex');

emailVerifyTokenSchema.statics.findOneOrCreate = async function findOneOrCreate(userId) {
  const Token = this;
  if (userId) {
    const foundToken = await Token.findOne({ user: userId });

    return foundToken || Token.create({
      user: userId,
      token: token(),
    });
  }

  return new Error('User id not given');
};

emailVerifyTokenSchema.statics.createToken = async function createToken(userId) {
  const Token = this;
  return Token.create({
    user: userId,
    token: token(),
  });
};

export default mongoose.model('EmailVerifyToken', emailVerifyTokenSchema);
