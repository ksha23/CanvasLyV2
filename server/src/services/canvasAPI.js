const Canvas = require('@kth/canvas-api').default;
const CanvasApiError = require('@kth/canvas-api').CanvasApiError;
const cheerio = require('cheerio');

// USEFUL
async function getCourses(canvasURL, canvasToken) {
  try {
    const canvas = new Canvas(canvasURL, canvasToken);
    const courses = canvas.listItems('courses');
    let coursesArray = [];

    for await (const course of courses) {
      coursesArray.push({
        name: course.name,
        id: course.id,
        timeZone: course.timeZone,
        start: course.start_at,
        end: course.end_at,
      });
    }
    return coursesArray;
  } catch (err) {
    if (err instanceof CanvasApiError) {
      console.error('Canvas API Error');
      console.error(err.options.url);
      console.error(err.response.statusCode);
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
}

async function getFilteredCourses(canvasURL, canvasToken) {
  try {
    const canvas = new Canvas(canvasURL, canvasToken);
    const courses = canvas.listItems('courses');
    // get active courses
    // const courses = canvas.listItems('courses?enrollment_state=active');

    let coursesArray = [];

    for await (const course of courses) {
      coursesArray.push({
        name: course.name,
        id: course.id,
        timeZone: course.timeZone,
        start: course.start_at,
        end: course.end_at,
      });
    }

    const filteredCourses = [];
    const today = new Date();

    // filter out courses that don't have a start or end date
    for (let i = 0; i < coursesArray.length; i++) {
      if (coursesArray[i].start == null || coursesArray[i].end == null) {
        continue;
      }
      // const courseStartDate = new Date(courses[i].start);
      const courseEndDate = new Date(coursesArray[i].end);
      if (courseEndDate >= today) {
        filteredCourses.push(coursesArray[i]);
      }
    }
    return filteredCourses;
  } catch (err) {
    if (err instanceof CanvasApiError) {
      console.error('Canvas API Error');
      console.error(err.options.url);
      console.error(err.response.statusCode);
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
}

// async function getDashboardStuff(canvasURL, canvasToken) {
//   const canvas = new Canvas(canvasURL, canvasToken);
//   const dashboardStuff = canvas.listItems("dashboard/dashboard_cards");
//   let dashboardStuffArray = [];
//   for await (const dashboardStuffItem of dashboardStuff) {
//     // dashboardStuffArray.push({
//     //   name: dashboardStuffItem.name,
//     //   id: dashboardStuffItem.id,
//     //   url: dashboardStuffItem.url,
//     // });
//     console.log(dashboardStuffItem);
//   }
//   return dashboardStuffArray;
// }

// MAYBE?
async function getTodos(canvasURL, canvasToken) {
  try {
    const canvas = new Canvas(canvasURL, canvasToken);
    const todos = canvas.listItems('users/self/todo');
    let todosArray = [];
    for await (const todo of todos) {
      todosArray.push({
        name: todo.name,
        id: todo.id,
        url: todo.url,
      });
    }
    return todosArray;
  } catch (err) {
    if (err instanceof CanvasApiError) {
      console.error('Canvas API Error');
      console.error(err.options.url);
      console.error(err.response.statusCode);
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
}

// USEFUL
async function getUpcomingEvents(canvasURL, canvasToken) {
  try {
    const canvas = new Canvas(canvasURL, canvasToken);
    const upcomingEvents = canvas.listItems('users/self/upcoming_events');
    let upcomingEventsArray = [];
    for await (const upcomingEvent of upcomingEvents) {
      if (upcomingEvent.assignment != null) {
        upcomingEventsArray.push({
          title: upcomingEvent.title,
          description: upcomingEvent.description,
          id: upcomingEvent.id,
          url: upcomingEvent.url,
          startAt: upcomingEvent.start_at,
          endAt: upcomingEvent.end_at,
          assignment: {
            name: upcomingEvent.assignment.name,
            description: upcomingEvent.assignment.description,
            dueDate: upcomingEvent.assignment.due_at,
            id: upcomingEvent.assignment.id,
            pointsPossible: upcomingEvent.assignment.points_possible,
            courseId: upcomingEvent.assignment.course_id,
          },
        });
      }
      upcomingEventsArray.push({
        title: upcomingEvent.title,
        description: upcomingEvent.description,
        id: upcomingEvent.id,
        url: upcomingEvent.url,
        startAt: upcomingEvent.start_at,
        endAt: upcomingEvent.end_at,
      });
    }
    return upcomingEventsArray;
  } catch (err) {
    if (err instanceof CanvasApiError) {
      console.error('Canvas API Error');
      console.error(err.options.url);
      console.error(err.response.statusCode);
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
}

// MAYBE?
async function getAssignments(courseId, canvasURL, canvasToken) {
  try {
    const canvas = new Canvas(canvasURL, canvasToken);
    const assignments = canvas.listItems(`courses/${courseId}/assignments?order_by=due_at&bucket=future`);
    let assignmentsArray = [];
    for await (const assignment of assignments) {
      let descriptionText = '';
      if (assignment.description !== null && assignment.description !== '') {
        const $ = cheerio.load(assignment.description);
        descriptionText = $.text();
      }
      assignmentsArray.push({
        name: assignment.name,
        description: descriptionText,
        id: assignment.id,
        dueDate: assignment.due_at,
        pointsPossible: assignment.points_possible,
        courseId: assignment.course_id,
      });
    }
    return assignmentsArray;
  } catch (err) {
    if (err instanceof CanvasApiError) {
      console.error('Canvas API Error');
      console.error(err.options.url);
      console.error(err.response.statusCode);
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
}

async function getAssignmentsLimited(courseId, canvasURL, canvasToken) {
  try {
    const canvas = new Canvas(canvasURL, canvasToken);
    let pages = canvas.listPages(`courses/${courseId}/assignments?order_by=due_at&bucket=future`);
    let assignmentsArray = [];
    let finalAssignmentsArray = [];
    // only use first page
    let page = await pages.next();
    let assignments = page.value.body;
    // add assignments to array
    for (const assignment of assignments) {
      assignmentsArray.push(assignment);
    }
    // keep getting next page until the date of the last assignment is in the future + 2weeks or so
    while (
      assignments.length > 0 &&
      assignments[assignments.length - 1].due_at < new Date(Date.now() + 12096e5).toISOString()
    ) {
      let tempPage = await pages.next();
      if (tempPage.done) break;
      page = tempPage;
      assignments = page.value.body;
      for (const assignment of assignments) {
        assignmentsArray.push(assignment);
      }
    }

    for (const assignment of assignmentsArray) {
      let descriptionText = '';
      if (assignment.description !== null && assignment.description !== '') {
        const $ = cheerio.load(assignment.description);
        descriptionText = $.text();
      }
      finalAssignmentsArray.push({
        name: assignment.name,
        description: descriptionText,
        id: assignment.id,
        dueDate: assignment.due_at,
        pointsPossible: assignment.points_possible,
        courseId: assignment.course_id,
        url: assignment.html_url,
        isQuiz: assignment.is_quiz_assignment,
      });
    }
    return finalAssignmentsArray;
  } catch (err) {
    if (err instanceof CanvasApiError) {
      console.error('Canvas API Error');
      console.error(err.options.url);
      console.error(err.response.statusCode);
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
}

// PROBABLY NOT USEFUL
async function getQuizzes(courseId, canvasURL, canvasToken) {
  try {
    const canvas = new Canvas(canvasURL, canvasToken);
    const quizzes = canvas.listItems(`courses/${courseId}/quizzes`);
    let quizzesArray = [];
    for await (const quiz of quizzes) {
      quizzesArray.push({
        name: quiz.title,
        description: quiz.description,
        id: quiz.id,
        dueDate: quiz.due_at,
        pointsPossible: quiz.points_possible,
        courseId: quiz.course_id,
      });
    }
    return quizzesArray;
  } catch (err) {
    if (err instanceof CanvasApiError) {
      console.error('Canvas API Error');
      console.error(err.options.url);
      console.error(err.response.statusCode);
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
}

async function getQuizzesLimited(courseId, canvasURL, canvasToken) {
  try {
    const canvas = new Canvas(canvasURL, canvasToken);
    const pages = canvas.listPages(`courses/${courseId}/quizzes`);
    // pages is a async generator
    let quizzesArray = [];
    // only use first page
    const page = await pages.next();
    const quizzes = page.value.body;
    for (const quiz of quizzes) {
      quizzesArray.push({
        name: quiz.title,
        description: quiz.description,
        id: quiz.id,
        dueDate: quiz.due_at,
        pointsPossible: quiz.points_possible,
        courseId: quiz.course_id,
      });
    }
    return quizzesArray;
  } catch (err) {
    if (err instanceof CanvasApiError) {
      console.error('Canvas API Error');
      console.error(err.options.url);
      console.error(err.response.statusCode);
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
}

// MAYBE?
async function getCalendarEvents(canvasURL, canvasToken) {
  try {
    const canvas = new Canvas(canvasURL, canvasToken); // calendar_events?type=event&start_date=2023-09-05&end_date=2024-01-30
    const calendarEvents = canvas.listItems(`calendar_events?type=event`); // or assignment &start_date=2023-08-20&undated=true&all_events=true
    let calendarEventsArray = [];
    for await (const calendarEvent of calendarEvents) {
      calendarEventsArray.push({
        title: calendarEvent.title,
        description: calendarEvent.description,
        id: calendarEvent.id,
        startAt: calendarEvent.start_at,
        endAt: calendarEvent.end_at,
        type: calendarEvent.type,
        contextCode: calendarEvent.context_code,
      });
    }
    return calendarEventsArray;
  } catch (err) {
    if (err instanceof CanvasApiError) {
      console.error('Canvas API Error');
      console.error(err.options.url);
      console.error(err.response.statusCode);
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
}

module.exports = {
  getCourses,
  getFilteredCourses,
  getTodos,
  getUpcomingEvents,
  getAssignments,
  getAssignmentsLimited,
  getQuizzes,
  getQuizzesLimited,
  getCalendarEvents,
};
