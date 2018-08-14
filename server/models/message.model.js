import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  to: {
    type: String,
    index: true,
    required: true,
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    trim: true,
    minLength: 1,
    required: true,
  },
});

export default mongoose.model('Message', messageSchema);
