import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  image: String
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', userSchema);