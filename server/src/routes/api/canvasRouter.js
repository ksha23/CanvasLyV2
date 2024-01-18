require('dotenv').config();
const canvasApiUrl = process.env.CANVAS_API_URL;
const canvasApiToken = process.env.CANVAS_API_TOKEN;
const { Router } = require('express');
const {
  getCalendarEvents,
  getUpcomingEvents,
  getCourses,
  getAssignments,
  getQuizzes,
  getTodos,
} = require('../../services/canvasAPI.js');

const router = new Router();

router.get('/getAllCourses', async (req, res) => {
  const courses = await getCourses(canvasApiUrl, canvasApiToken);
  res.send({
    courses,
  });
});

router.get('/getTodos', async (req, res) => {
  const todos = await getTodos(canvasApiUrl, canvasApiToken);
  res.send({
    todos,
  });
});

router.get('/getUpcomingEvents', async (req, res) => {
  const upcomingEvents = await getUpcomingEvents(canvasApiUrl, canvasApiToken);
  res.send({
    upcomingEvents,
  });
});

router.get('/getAssignmentsByCourse/:courseId', async (req, res) => {
  const assignments = await getAssignments(req.params.courseId, canvasApiUrl, canvasApiToken);
  res.send({
    assignments,
  });
});

router.get('/getQuizzesByCourse/:courseId', async (req, res) => {
  const quizzes = await getQuizzes(req.params.courseId, canvasApiUrl, canvasApiToken);
  res.send({
    quizzes,
  });
});

router.get('/getCalendarEvents', async (req, res) => {
  const calendarEvents = await getCalendarEvents(canvasApiUrl, canvasApiToken);
  res.send({
    calendarEvents,
  });
});

export default router;
