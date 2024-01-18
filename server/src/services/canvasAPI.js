const Canvas = require("@kth/canvas-api").default;

// USEFUL
async function getCourses(canvasURL, canvasToken) {
  try {
    const canvas = new Canvas(canvasURL, canvasToken);
    const courses = canvas.listItems("courses");
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
      console.error("Canvas API Error");
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
    const todos = canvas.listItems("users/self/todo");
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
      console.error("Canvas API Error");
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
    const upcomingEvents = canvas.listItems("users/self/upcoming_events");
    let upcomingEventsArray = [];
    for await (const upcomingEvent of upcomingEvents) {
      console.log(upcomingEvent);
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
      console.error("Canvas API Error");
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
    const assignments = canvas.listItems(
      `courses/${courseId}/assignments?order_by=due_at`
    );
    let assignmentsArray = [];
    for await (const assignment of assignments) {
      assignmentsArray.push({
        name: assignment.name,
        description: assignment.description,
        id: assignment.id,
        dueDate: assignment.due_at,
        pointsPossible: assignment.points_possible,
        courseId: assignment.course_id,
      });
    }
    return assignmentsArray;
  } catch (err) {
    if (err instanceof CanvasApiError) {
      console.error("Canvas API Error");
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
      console.error("Canvas API Error");
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
      console.error("Canvas API Error");
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
  getTodos,
  getUpcomingEvents,
  getAssignments,
  getQuizzes,
  getCalendarEvents,
};
