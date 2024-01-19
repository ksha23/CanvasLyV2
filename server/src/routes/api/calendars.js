// const fetch = require('node-fetch');
const User = require('../../models/User');
const Calendar = require('../../models/Calendar');
const Assignment = require('../../models/Assignment');
const { DateTime } = require('luxon');
const { Router } = require('express');

// middleware
import requireJwtAuth from '../../middleware/requireJwtAuth';
import refreshTokenMiddleware from '../../middleware/refreshAccessToken';

const router = Router();

// ----------------- HELPERS --------------------

// create calendar if one with the same calendarId doesn't exist
const createCalendar = async (data) => {
  try {
    const calendar = await Calendar.findOne({
      googleCalendarId: data.googleCalendarId,
    });
    if (!calendar) {
      const newCalendar = await Calendar.create(data);
      return newCalendar;
    } else {
      return calendar;
    }
  } catch (error) {
    console.error(error);
  }
};

const createAssignments = async (calendarId, data) => {
  try {
    // Extract googleEventIds from incoming data for comparison
    const assignmentIds = data.map((assignment) => assignment.googleEventId);

    // Find existing assignments by googleEventId
    const existingAssignments = await Assignment.find({
      googleEventId: { $in: assignmentIds },
    });

    // Filter out existing assignments
    const existingAssignmentIds = existingAssignments.map((assignment) => assignment.googleEventId);
    const newAssignmentsData = data.filter((assignment) => !existingAssignmentIds.includes(assignment.googleEventId));

    // Insert new assignments (if any)
    const newAssignments = await Assignment.insertMany(newAssignmentsData);

    if (calendarId) {
      const calendar = await Calendar.findOne({ googleCalendarId: calendarId });
      if (!calendar) {
        return { message: 'Calendar not found' };
      }

      // Extract IDs of newly created assignments
      const assignmentIds = newAssignments.map((assignment) => assignment._id);

      // Add valid assignmentIds to the calendar's assignments field
      calendar.assignments.push(...assignmentIds);

      await calendar.save();
    }

    return newAssignments;
  } catch (error) {
    console.error(error);
  }
};

// Get assignments belonging to a specific calendar
const getAssignmentsByCalendarId = async (calendarId) => {
  try {
    const calendar = await Calendar.findOne({
      googleCalendarId: calendarId,
    }).populate('assignments');
    if (!calendar) {
      console.error('Calendar not found');
    }
    return calendar.assignments;
  } catch (error) {
    console.error(error);
  }
};

// handles post-processing of data from Google Calendar API
/*
1. Create calendar in database if it doesn't exist
2. get assignments belonging to the calendar (basically refresh the calendar with new assignments)
3. Save events to database if they don't already exist (also associate them with the calendar)
4. Filter out completed assignments
5. Add any other filters here!!!!!
6. Sort assignments
7. Send back _id, name, dueDate, completed, and reminders array
*/
const postProcess = async (data, googleId, timeZone, calendarId) => {
  // create calendar in database if it doesn't exist
  const calendarData = {
    googleId: googleId,
    googleCalendarId: calendarId,
    assignments: [],
  };

  await createCalendar(calendarData);

  const newData = data.map((event) => ({
    googleEventId: event.id,
    name: event.summary,
    dueDate: event.start.dateTime || event.start.date,
  }));

  // for each assignment, if its dueDate does not have a time, set the time to 11:59 PM and set to UTC time
  newData.forEach((assignment) => {
    if (!assignment.dueDate.includes('T')) {
      assignment.dueDate = DateTime.fromISO(assignment.dueDate, {
        zone: timeZone,
      })
        .set({ hour: 23, minute: 59 })
        .toUTC()
        .toISO();
    }
  });

  // save events to database if they don't already exist (also associate them with the calendar)
  await createAssignments(calendarId, newData);

  // ----------------- FILTERS --------------------
  const assignments = await getAssignmentsByCalendarId(calendarId);

  // filter out completed assignments
  // const filteredAssignments = assignments.filter((assignment) => !assignment.completed);

  // add any other filters here!!!!!

  // sends back _id, name, dueDate, completed, and reminders array
  return assignments;
};

//------------------------- CALENDAR ROUTES --------------------------

// Gets all calendars from Google Calendar API (/api/calendars/data)
// use requireJWT and refreshAccessToken middlewares to ensure user is authenticated

// router.get('/calendarData', requireJwtAuth, refreshTokenMiddleware, async (req, res) => {
//   const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
//     headers: {
//       Authorization: `Bearer ${req.user.accessToken}`,
//     },
//   });
//   if (!response) return res.status(200).json([]);
//   const data = await response.json();
//   return res.status(200).json(data.items);
// });

// THIS IS A HELPER FUNCTION FOR GETTING EVENTS
// Get events from Google Calendar API
const getEventsFromGoogle = async (req, res) => {
  const calendarId = encodeURIComponent(req.user.calendarId);
  const today = new Date(); // Get today's date
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${today.toISOString()}&maxResults=30`,
    {
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
      },
    },
  );
  return response;
};

// returns events from our database refreshed from Google Calendar API (/api/calendars/events)
router.get('/events', requireJwtAuth, refreshTokenMiddleware, async (req, res) => {
  let timeZone = '';
  try {
    if (!req.user.calendarId) {
      const user = await User.findOne({ _id: req.user._id }).exec();
      if (!user || !user.calendarId) {
        return res.status(404).json({ message: 'Calendar ID not found' });
      } else {
        req.user.calendarId = user.calendarId;
      }
    }
    const response = await getEventsFromGoogle(req, res);
    if (response.status === 200) {
      const data = await response.json();
      timeZone = data.timeZone;
      const postProcessedData = await postProcess(data.items, req.user.googleId, timeZone, req.user.calendarId);

      return res.status(200).json(postProcessedData);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json([]);
  }
});

// Get a specific calendar by ID (/api/calendars/calendarById/:id)
router.get('/calendarById/:id', requireJwtAuth, refreshTokenMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const calendar = await Calendar.findById(id);
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }
    res.status(200).json(calendar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
