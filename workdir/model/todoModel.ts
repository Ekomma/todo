import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  created: {
    type: String,
  },
  text: {
    type: String,
    index: true,
    required: true,
  },
    userEmail: {
    type: String,
    index: true,
    required: true,
  },
});

export default mongoose.model('todos', todoSchema);
