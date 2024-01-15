"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _requireJwtAuth = _interopRequireDefault(require("../../middleware/requireJwtAuth"));
var _refreshAccessToken = _interopRequireDefault(require("../../middleware/refreshAccessToken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const Assignment = require('../../models/Assignment');
const Calendar = require('../../models/Calendar');
const {
  Router
} = require('express');
const router = Router();

// middleware to check if user is logged in and to refresh access token if needed

// --------------------- COMPLETE Assignment --------------------- //

// Complete or uncomplete assignment by ID (/api/assignments/complete/:id)
router.put('/complete/:id', _requireJwtAuth.default, async (req, res) => {
  const id = req.params.id;
  try {
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      console.error('Assignment not found');
      return res.status(404).json({
        error: 'Assignment not found'
      });
    }
    assignment.completed = !assignment.completed; // Reverse the completed boolean
    const updatedAssignment = await assignment.save();
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json(error);
  }
});

// confirm assignment completion by ID (/api/assignments/confirm/:id)
router.put('/confirm/:id', _requireJwtAuth.default, async (req, res) => {
  const id = req.params.id;
  try {
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      console.error('Assignment not found');
      return res.status(404).json({
        error: 'Assignment not found'
      });
    }
    assignment.confirmedCompleted = true;
    const updatedAssignment = await assignment.save();
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json(error);
  }
});

// --------------------- Add Assignment --------------------- //

// add an assignment to a calendar by calendar id (/api/assignments/add/:id)
router.post('/add', _requireJwtAuth.default, async (req, res) => {
  const calendarId = req.user.calendarId;
  const {
    name,
    dueDate,
    type,
    difficulty,
    reminders
  } = req.body;
  let cleanedUpReminders;
  if (reminders === undefined || reminders === null || reminders === '') {
    cleanedUpReminders = [];
  } else {
    cleanedUpReminders = new Array(reminders);
  }
  try {
    const newAssignment = await Assignment.create({
      name,
      dueDate,
      type,
      difficulty,
      reminders: cleanedUpReminders
    });

    // check if it was created in the db by searcfhing for it
    const foundAssignment = await Assignment.findOne({
      _id: newAssignment._id
    });
    if (!foundAssignment) {
      console.error('Assignment not found');
      return res.status(404).json({
        error: 'Assignment not successfully added to db'
      });
    }

    // Add assignment to user's calendar
    const calendar = await Calendar.findOne({
      googleCalendarId: calendarId
    });
    calendar.assignments.push(newAssignment);
    await calendar.save();
    res.status(200).json(newAssignment);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

// update entire assignment by ID (/api/assignments/update/:id)
router.put('/update/:id', _requireJwtAuth.default, async (req, res) => {
  const id = req.params.id;
  const {
    type,
    difficulty,
    reminders
  } = req.body.values;
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(id, {
      type,
      difficulty,
      reminders
    }, {
      new: true
    });
    if (!updatedAssignment) {
      console.error('Assignment not found');
    }
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json(error);
  }
});

// const getAssignmentDueDateByGoogleEventId = async (calendarId, googleEventId, accessToken) => {
//   // get due date from google calendar api
//   // use  https://www.googleapis.com/calendar/v3/calendars/calendarId/events/eventId
//   const event = fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${googleEventId}`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${accessToken}`,
//     },
//   })
//     .then((res) => res.json())
//     .then((json) => {
//       console.log('json is ', json);
//       return json;
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// };

// const refreshDueDates = async (req, res) => {
//   const calendarId = req.user.calendarId;
//   console.log('calendarId is ', calendarId);
//   // get all assignments attached to calendar
//   const calendar = await Calendar.findOne({ googleCalendarId: calendarId });
//   const assignments = calendar.assignments;
//   console.log('assignments are ', assignments);
//   // for each assignment, get the due date from google calendar api and update the assignment in the db
//   // need to get mongodb assignment object
//   const accessToken = req.user.accessToken;
//   const updatedAssignments = await Promise.all(
//     assignments.map(async (assignment) => {
//       console.log('assignment is ', assignment);
//       console.log('google event id is ', assignment.googleEventId);
//       const dueDate = await getAssignmentDueDateByGoogleEventId(calendarId, assignment.googleEventId, accessToken);
//       const updatedAssignment = await Assignment.findByIdAndUpdate(assignment._id, { dueDate }, { new: true });
//       return updatedAssignment;
//     }),
//   );
//   res.status(200).json(updatedAssignments);
// };
var _default = exports.default = router;
//# sourceMappingURL=assignments.js.map