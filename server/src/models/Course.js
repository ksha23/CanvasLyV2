const mongoose = require('mongoose');

// Schema for assignments
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  canvasCourseId: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 10,
    default: 1,
  },
  subject: {
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
  location: {
    type: String,
  },
  assignments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'CanvasAssignment',
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
