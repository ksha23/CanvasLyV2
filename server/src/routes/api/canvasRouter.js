require('dotenv').config();
const { Router } = require('express');
const {
  getCalendarEvents,
  getUpcomingEvents,
  getCourses,
  getFilteredCourses,
  getAssignments,
  getAssignmentsLimited,
  getQuizzes,
  getQuizzesLimited,
  getTodos,
} = require('../../services/canvasAPI.js');
const CanvasAssignment = require('../../models/canvasAssignment.js');
const Course = require('../../models/Course.js');
import User from '../../models/User';
import requireJwtAuth from '../../middleware/requireJwtAuth';

const router = new Router();

// router.get('/getAllCourses', async (req, res) => {
//   const courses = await getCourses(canvasApiUrl, canvasApiToken);
//   res.send({
//     courses,
//   });
// });

router.post('/apiToken', requireJwtAuth, async (req, res) => {
  const apiToken = req.body.apiKey;
  const user = await User.findOne({ _id: req.user._id });
  user.canvasAPIToken = apiToken;
  await user.save();
  res.send({
    message: 'Successfully updated API token',
  });
});

router.post('/apiUrl', requireJwtAuth, async (req, res) => {
  const apiUrl = req.body.apiUrl;
  const user = await User.findOne({ _id: req.user._id });
  user.canvasAPIUrl = apiUrl;
  await user.save();
  res.send({
    message: 'Successfully updated API URL',
  });
});

router.get('/courses', async (req, res) => {
  const canvasApiUrl = req.user.canvasAPIUrl;
  const canvasApiToken = req.user.canvasAPIToken;

  const courses = await getFilteredCourses(canvasApiUrl, canvasApiToken);
  // only return courses whose start date is after today and end date is before today
  res.send({
    courses,
  });
});

// not really useful
// router.get('/getTodos', async (req, res) => {
//   const todos = await getTodos(canvasApiUrl, canvasApiToken);
//   res.send({
//     todos,
//   });
// });

// not really useful
// router.get('/getUpcomingEvents', async (req, res) => {
//   console.log('here!');
//   const upcomingEvents = await getUpcomingEvents(canvasApiUrl, canvasApiToken);
//   res.send({
//     upcomingEvents,
//   });
// });

// router.get('/getAssignmentsByCourse/:courseId', async (req, res) => {
//   const assignments = await getAssignments(req.params.courseId, canvasApiUrl, canvasApiToken);
//   res.send({
//     assignments,
//   });
// });

// router.get('/getAssignmentsByCourseLimited/:courseId', async (req, res) => {
//   const assignments = await getAssignmentsLimited(req.params.courseId, canvasApiUrl, canvasApiToken);
//   res.send({
//     assignments,
//   });
// });

// router.get('/allAssignments', async (req, res) => {
//   // loop through all courses and get assignments
//   const courses = await getCourses(canvasApiUrl, canvasApiToken);
//   const assignments = [];
//   for (let i = 0; i < courses.length; i++) {
//     const courseAssignments = await getAssignments(courses[i].id, canvasApiUrl, canvasApiToken);
//     assignments.push(...courseAssignments);
//   }
//   res.send({
//     assignments,
//   });
// });

router.get('/assignments', requireJwtAuth, async (req, res) => {
  const canvasApiUrl = req.user.canvasAPIUrl;
  const canvasApiToken = req.user.canvasAPIToken;
  // get courses from body
  const courses = await getFilteredCourses(canvasApiUrl, canvasApiToken);
  const assignments = [];
  for (let i = 0; i < courses.length; i++) {
    // PIPELINE
    // 1. get assignments for each course
    const courseAssignments = await getAssignmentsLimited(courses[i].id, canvasApiUrl, canvasApiToken);
    // 2. get course from database
    const course = await Course.findOne({ name: courses[i].name }).exec();
    // 3a. if course doesn't exist in database, create it
    if (!course) {
      const newCourse = new Course({
        name: courses[i].name,
        canvasCourseId: courses[i].id,
        difficulty: 1,
        subject: 'Other',
        completed: false,
        confirmedCompleted: false,
        description: '',
        link: '',
        location: '',
        assignments: [],
      });
      await newCourse.save();

      // 4a. add assignments to course
      for (let j = 0; j < courseAssignments.length; j++) {
        const newAssignment = new CanvasAssignment({
          name: courseAssignments[j].name,
          googleEventId: '',
          isQuiz: courseAssignments[j].isQuiz,
          canvasAssignmentId: courseAssignments[j].id,
          dueDate: courseAssignments[j].dueDate || 'Unspecified',
          difficulty: 1,
          pointsPossible: courseAssignments[j].pointsPossible,
          type: 'Other',
          priority: '',
          class: '',
          completed: false,
          confirmedCompleted: false,
          description: courseAssignments[j].description,
          link: courseAssignments[j].url,
          reminders: [],
          location: '',
        });
        await newAssignment.save();
        newCourse.assignments.push(newAssignment._id);
        await newCourse.save();
      }
    } else {
      // 3b and 4b. update assignments paramter of course, upserting if canvasAssignmentId doesn't exist in database
      for (let j = 0; j < courseAssignments.length; j++) {
        const assignment = await CanvasAssignment.findOne({ canvasAssignmentId: courseAssignments[j].id }).exec();
        if (!assignment) {
          const newAssignment = new CanvasAssignment({
            name: courseAssignments[j].name,
            googleEventId: '',
            isQuiz: courseAssignments[j].isQuiz,
            canvasAssignmentId: courseAssignments[j].id,
            dueDate: courseAssignments[j].dueDate || 'Unspecified',
            difficulty: 1,
            pointsPossible: courseAssignments[j].pointsPossible,
            type: 'Other',
            priority: '',
            class: '',
            completed: false,
            confirmedCompleted: false,
            description: courseAssignments[j].description,
            link: courseAssignments[j].url,
            reminders: [],
            location: '',
          });
          await newAssignment.save();
          course.assignments.push(newAssignment._id);
          await course.save();
        }
      }
    }
    // 5. get assignments from database
    const courseAssignmentsFromDatabase = await Course.findOne({ name: courses[i].name })
      .populate('assignments')
      .exec();
    // 6. add assignments to assignments array
    assignments.push({ course: courses[i].name, assignments: courseAssignmentsFromDatabase || [] });
  }
  res.send({
    assignments,
  });
});

// router.get('/getQuizzesByCourse/:courseId', async (req, res) => {
//   const quizzes = await getQuizzes(req.params.courseId, canvasApiUrl, canvasApiToken);
//   res.send({
//     quizzes,
//   });
// });

router.get('/quizzes', requireJwtAuth, async (req, res) => {
  const canvasApiUrl = req.user.canvasAPIUrl;
  const canvasApiToken = req.user.canvasAPIToken;
  const courses = await getFilteredCourses(canvasApiUrl, canvasApiToken);
  const quizzes = [];
  for (let i = 0; i < courses.length; i++) {
    const courseQuizzes = await getQuizzesLimited(courses[i].id, canvasApiUrl, canvasApiToken);
    quizzes.push({ course: courses[i].name, quizzes: courseQuizzes || [] });
  }
  res.send({
    quizzes,
  });
});

// not really useful
router.get('/calendarEvents', requireJwtAuth, async (req, res) => {
  const canvasApiUrl = req.user.canvasAPIUrl;
  const canvasApiToken = req.user.canvasAPIToken;
  const calendarEvents = await getCalendarEvents(canvasApiUrl, canvasApiToken);
  res.send({
    calendarEvents,
  });
});

export default router;
