const Assignment = require('../../models/Assignment');
const Calendar = require('../../models/Calendar');
const { Router } = require('express');

const router = Router();

// middleware to check if user is logged in and to refresh access token if needed
import requireJwtAuth from '../../middleware/requireJwtAuth';
import refreshTokenMiddleware from '../../middleware/refreshAccessToken';

// --------------------- Reminder Routes --------------------- //

// add a reminder to an assignment by ID (/api/assignments/reminder/:id)
router.put('reminder/:id', requireJwtAuth, async (req, res) => {
  const id = req.params.id;
  const { reminder } = req.body;
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(id, { $push: { reminders: reminder } }, { new: true });
    if (!updatedAssignment) {
      console.error('Assignment not found');
    }
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json(error);
  }
});

// route to update an assignment reminder array by assignment id (/api/assignments/reminders/:id)
router.put('/reminders/:id', requireJwtAuth, async (req, res) => {
  const id = req.params.id;
  const { reminders } = req.body;
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(id, { reminders }, { new: true });
    if (!updatedAssignment) {
      console.error('Assignment not found');
    }
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json(error);
  }
});

// route to delete a reminder from an assignment by assignment id (/api/assignments/reminders/:id)
router.delete('/reminder/:id', requireJwtAuth, async (req, res) => {
  const id = req.params.id;
  const { reminderIndex } = req.body;

  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { $unset: { [`reminders.${reminderIndex}`]: 1 } }, // Using $unset to remove element by index
      { new: true },
    );

    if (!updatedAssignment) {
      console.error('Assignment not found');
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Remove null elements after using $unset
    updatedAssignment.reminders = updatedAssignment.reminders.filter(Boolean);

    await updatedAssignment.save();

    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --------------------- COMPLETE Assignment --------------------- //

// Complete an assignment by ID (/api/assignments/complete/:id)
router.put('/complete/:id', requireJwtAuth, async (req, res) => {
  const id = req.params.id;
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(id, { completed: true }, { new: true });
    if (!updatedAssignment) {
      console.error('Assignment not found');
    }
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json(error);
  }
});

// --------------------- Change Assignment --------------------- //

// Change difficulty of an assignment by ID (/api/assignments/difficulty/:id)
router.put('/difficulty/:id', requireJwtAuth, async (req, res) => {
  const id = req.params.id;
  const { difficulty } = req.body;
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(id, { difficulty }, { new: true });
    if (!updatedAssignment) {
      console.error('Assignment not found');
    }
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Change type of an assignment by ID (/api/assignments/type/:id)
router.put('/type/:id', requireJwtAuth, async (req, res) => {
  const id = req.params.id;
  const type = req.body.type;

  // validate type
  const validTypes = ['Assignment', 'Exam', 'Quiz', 'Project', 'Other'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: 'Invalid type' });
  }
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(id, { type }, { new: true });
    if (!updatedAssignment) {
      console.error('Assignment not found');
    }
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json(error);
  }
});

// change type and difficulty of an assignment by ID (/api/assignments/typeAndDifficulty/:id)
router.put('/typeAndDifficulty/:id', requireJwtAuth, async (req, res) => {
  const id = req.params.id;
  const { type, difficulty } = req.body;

  // validate type
  const validTypes = ['Assignment', 'Exam', 'Quiz', 'Project', 'Other'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: 'Invalid type' });
  }

  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(id, { type, difficulty }, { new: true });
    if (!updatedAssignment) {
      console.error('Assignment not found');
    }
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json(error);
  }
});

// --------------------- Add Assignment --------------------- //

// add an assignment to a calendar by calendar id (/api/assignments/add/:id)
router.post('/add/:id', requireJwtAuth, async (req, res) => {
  const calendarId = req.params.id;
  const { name, dueDate, type, difficulty } = req.body;
  try {
    const newAssignment = await Assignment.create({
      name,
      dueDate,
      type,
      difficulty,
    });

    // check if it was created in the db by searcfhing for it
    const foundAssignment = await Assignment.findOne({
      _id: newAssignment._id,
    });
    if (!foundAssignment) {
      console.error('Assignment not found');
      return res.status(404).json({ error: 'Assignment not successfully added to db' });
    }

    // Add assignment to user's calendar
    const calendar = await Calendar.findOne({ googleCalendarId: calendarId });
    calendar.assignments.push(newAssignment);
    await calendar.save();

    res.status(200).json(newAssignment);
  } catch (error) {
    console.error(error);
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

export default router;
