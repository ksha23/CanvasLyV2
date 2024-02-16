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

// --------------------- Preferences  --------------------- //
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

// --------------------- Courses --------------------- //

router.get('/courses', requireJwtAuth, async (req, res) => {
  const canvasApiUrl = req.user.canvasAPIUrl;
  const canvasApiToken = req.user.canvasAPIToken;

  const courses = await getFilteredCourses(canvasApiUrl, canvasApiToken);
  // only return courses whose start date is after today and end date is before today
  res.send({
    courses,
  });
});

// --------------------- Update --------------------- //

// mark assignment as completed
router.put('/complete/:id', requireJwtAuth, async (req, res) => {
  const id = req.params.id;
  try {
    const assignment = await CanvasAssignment.findById(id);
    if (!assignment) {
      console.error('Assignment not found');
      return res.status(404).json({ error: 'Assignment not found' });
    } else {
      assignment.completed = !assignment.completed; // Reverse the completed boolean
      const updatedAssignment = await assignment.save();
      res.status(200).json(updatedAssignment);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

// confirm assignment completion by ID (/api/assignments/confirm/:id)
router.put('/confirm/:id', requireJwtAuth, async (req, res) => {
  const id = req.params.id;
  try {
    const assignment = await CanvasAssignment.findById(id);
    if (!assignment) {
      console.error('Assignment not found');
      return res.status(404).json({ error: 'Assignment not found' });
    } else {
      assignment.confirmedCompleted = true;
      const updatedAssignment = await assignment.save();
      res.status(200).json(updatedAssignment);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put('/update/:id', requireJwtAuth, async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    const assignment = await CanvasAssignment.findById(id);
    if (!assignment) {
      console.error('Assignment not found');
      return res.status(404).json({ error: 'Assignment not found' });
    } else {
      assignment.name = newData.name;
      assignment.dueDate = newData.dueDate;
      assignment.type = newData.type;
      assignment.difficulty = newData.difficulty;
      assignment.reminders = newData.reminders;
      assignment.save();
      res.status(200).json(assignment);
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

// --------------------- Add Assignment --------------------- //

// not really useful
// router.get('/getTodos', requireJwtAuth, async (req, res) => {
//   const canvasApiUrl = req.user.canvasAPIUrl;
//   const canvasApiToken = req.user.canvasAPIToken;
//   const todos = await getTodos(canvasApiUrl, canvasApiToken);
//   res.send({
//     todos,
//   });
// });

// not really useful
// router.get('/getUpcomingEvents', async (req, res) => {
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

  // get user object first
  const user = await User.findOne({ _id: req.user._id });

  // get courses in db under user
  const existingCourses = await user.populate('courses').execPopulate();

  const courses = await getFilteredCourses(canvasApiUrl, canvasApiToken);
  const assignments = [];
  // check invalid request
  if (!courses) return res.send({ assignments: [] });

  for (let i = 0; i < courses.length; i++) {
    // first look for course in existingCourses
    let existingCourse = existingCourses.courses.find((course) => course.canvasCourseId === courses[i].id);
    // console.log('Getting assingments for course', courses[i].name);
    const courseAssignments = await getAssignmentsLimited(courses[i].id, canvasApiUrl, canvasApiToken);
    if (!existingCourse) {
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
      user.courses.push(newCourse._id);
      await user.save();
      // update existingCourse
      existingCourse = newCourse;

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
          description:
            courseAssignments[j].description != '' && courseAssignments[j].description != null
              ? courseAssignments[j].description.substring(0, 250) +
                (courseAssignments[j].description.length > 250 ? '...' : '')
              : '',
          link: courseAssignments[j].url,
          reminders: [],
          location: '',
        });
        await newAssignment.save();
        newCourse.assignments.push(newAssignment._id);
        await newCourse.save();
      }
    } else {
      for (let j = 0; j < courseAssignments.length; j++) {
        // get all assignments in existing course
        const existingAssignments = await existingCourse.populate('assignments').execPopulate();
        // check if assignment exists in existing course
        const assignment = existingAssignments.assignments.find(
          (assignment) => assignment.canvasAssignmentId === courseAssignments[j].id,
        );
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
            description:
              courseAssignments[j].description != '' && courseAssignments[j].description != null
                ? courseAssignments[j].description.substring(0, 250) +
                  (courseAssignments[j].description.length > 250 ? '...' : '')
                : '',
            link: courseAssignments[j].url,
            reminders: [],
            location: '',
          });
          await newAssignment.save();
          existingCourse.assignments.push(newAssignment._id);
          await existingCourse.save();
        } else {
          // check every field and update if necessary
          // assignment.name = courseAssignments[j].name;
          if (assignment.isQuiz != courseAssignments[j].isQuiz) assignment.isQuiz = courseAssignments[j].isQuiz;

          if (
            courseAssignments[j].dueDate != null &&
            courseAssignments[j].dueDate != '' &&
            courseAssignments[j].dueDate != 'Unspecified' &&
            assignment.dueDate != courseAssignments[j].dueDate
          )
            assignment.dueDate = courseAssignments[j].dueDate;

          if (assignment.pointsPossible != courseAssignments[j].pointsPossible)
            assignment.pointsPossible = courseAssignments[j].pointsPossible;

          if (assignment.description != courseAssignments[j].description)
            assignment.description =
              courseAssignments[j].description != '' && courseAssignments[j].description != null
                ? courseAssignments[j].description.substring(0, 250) +
                  (courseAssignments[j].description.length > 250 ? '...' : '')
                : '';
          await assignment.save();
        }
      }
    }
    // 5. get assignments from course now
    let courseAssignmentsFromDatabase = await existingCourse.populate('assignments').execPopulate();

    //only populate assignments for existing course
    // 6. add assignments to assignments array
    assignments.push({
      course: courses[i].name,
      courseId: courses[i].id,
      assignments: courseAssignmentsFromDatabase.assignments || [],
    });
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
