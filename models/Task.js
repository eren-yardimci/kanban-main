const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  lane: { // 'status' yerine 'lane' kullanıyoruz
    type: String,
    enum: ['Backlog', 'To do', 'In Progress', 'Designed'],
    default: 'Backlog'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
