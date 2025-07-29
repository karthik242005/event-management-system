// models/Student.js
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  section: { type: String, required: true },
  regNo: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  role: {
    type: String,
    enum: ['student'],
    default: 'student'
  },
  imageUrl: { type: String, default: '' }

});

export default mongoose.model('Student', studentSchema);
