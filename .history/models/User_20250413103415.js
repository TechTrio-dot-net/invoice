import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  // 🔐 Token for password reset
  resetPasswordToken: {
    type: String,
  },

  resetPasswordExpires: {
    type: Date,
  }

}, { timestamps: true });

export default mongoose.model('User', userSchema);
