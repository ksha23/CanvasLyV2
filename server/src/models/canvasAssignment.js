const mongoose = require('mongoose');

// Schema for assignments
const assignmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  googleEventId: {
    type: String,
  },
  canvasAssignmentId: {
    type: Number,
    required: true,
  },
  isQuiz: {
    type: Boolean,
    default: false,
  },
  dueDate: {
    type: String,
    required: true,
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 10,
    default: 1,
  },
  pointsPossible: {
    type: Number,
  },
  type: {
    type: String,
    enum: ['Assignment', 'Exam', 'Quiz', 'Project', 'Other'],
    default: 'Other',
  },
  priority: {
    type: String,
  },
  class: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  confirmedCompleted: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
  link: {
    type: String,
  },
  reminders: {
    type: [String],
  },
  location: {
    type: String,
  },
});

const CanvasAssignment = mongoose.model('CanvasAssignment', assignmentSchema);

module.exports = CanvasAssignment;
