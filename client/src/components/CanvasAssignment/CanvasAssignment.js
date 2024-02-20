import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import { isMobile } from 'react-device-detect';
import {
  completeCanvasAssignment,
  confirmComplete,
  updateCanvasAssignment,
} from '../../store/actions/canvasActions';
import { assignmentFormSchema } from './validation';
import Slider from '@mui/material/Slider';
import Loader from '../Loader/Loader';
import LoadingOverlay from 'react-loading-overlay-ts';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

LoadingOverlay.propTypes = undefined;

const marks = [
  {
    value: 1,
    label: 'Easy',
  },
  {
    value: 2,
    label: '',
  },
  {
    value: 3,
    label: 'Normal',
  },
  {
    value: 4,
    label: '',
  },
  {
    value: 5,
    label: 'Hard',
  },
];

const convertToUTC = (date) => {
  if (date == 'Unspecified' || date == 'Invalid Date') return date;
  return new Date(date).toISOString();
};

const CanvasAssign = ({
  assignment,
  completeCanvasAssignment,
  updateCanvasAssignment,
  confirmComplete,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: assignment.name,
      dueDate: convertToUTC(assignment.dueDate),
      type: assignment.type,
      difficulty: parseInt(assignment.difficulty),
      reminders: [...assignment.reminders],
    },
    validationSchema: assignmentFormSchema,
    onSubmit: (values) => {
      updateCanvasAssignment(assignment._id, values);
      setEditing(false);
    },
  });

  window.addEventListener('themeChange', handleThemeChange);
  const [theme, setTheme] = useState(
    assignment.completed
      ? (localStorage.getItem('theme') || 'light') === 'light'
        ? 'dark'
        : 'light'
      : localStorage.getItem('theme') || 'light',
  );
  function handleThemeChange() {
    if (assignment.completed) {
      const currentTheme = localStorage.getItem('theme') || 'light';
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
      return;
    }
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
  }

  const handleToggleDone = (e, id) => {
    e.preventDefault();
    completeCanvasAssignment(id);
  };

  const addReminder = () => {
    formik.setFieldValue('reminders', [...formik.values.reminders, '']); // Append an empty reminder
  };
  const deleteReminder = (indexToDelete) => {
    const updatedReminders = formik.values.reminders.filter((_, index) => index !== indexToDelete);
    formik.setFieldValue('reminders', updatedReminders);
  };

  const [editing, setEditing] = useState(false);

  // dont reset form if there is an error
  useEffect(() => {
    if (!assignment.error && !assignment.isLoading) formik.resetForm();
  }, [assignment.error, assignment.isLoading]);

  const dateObject = new Date(assignment.dueDate);

  const toDateTimeString = (date) => {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const toInputFriendlyTime = (date) => {
    console.log(date, 'date');
    if (date == 'Unspecified' || date == 'Invalid Date') return date;
    let dateObj = new Date(date);
    let offset = dateObj.getTimezoneOffset();
    dateObj = new Date(dateObj.getTime() - offset * 60 * 1000);
    date = dateObj.toISOString().slice(0, 16);
    return date;
  };

  return (
    <LoadingOverlay active={assignment.isLoading} spinner={<Loader />} className="rounded-md">
      <div
        className={`w-full ${
          assignment.completed
            ? 'text-zinc-300 dark:text-zinc-700'
            : 'text-zinc-700 dark:text-zinc-300'
        }`}
      >
        <div
          className={
            assignment.completed
              ? 'p-5 mb-5 rounded-md bg-zinc-100 dark:bg-zinc-900'
              : formik.dirty
              ? 'p-5 mb-5 border-2 border-red-600 bg-gradient-to-bl from-slate-200 dark:from-slate-900 to-zinc-50 dark:to-zinc-800 rounded-md'
              : editing
              ? 'p-5 mb-5 border-2 border-sky-600 dark:border-sky-700 bg-gradient-to-bl from-slate-200 dark:from-slate-900 to-zinc-50 dark:to-zinc-800 rounded-md'
              : 'p-5 mb-5 bg-gradient-to-bl from-slate-200 dark:from-slate-900 to-zinc-50 dark:to-zinc-800 rounded-md'
          }
        >
          <div className="flex justify-between items-center space-x-2 mb-2">
            <div className="flex justify-center items-center space-x-4 w-full">
              <div className="flex space-x-1 w-full">
                <button
                  disabled={assignment.completed || assignment.isLoading}
                  className="text-sm"
                  onClick={() => setEditing(!editing)}
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m14.3 4.8 2.9 2.9M7 7H4a1 1 0 0 0-1 1v10c0 .6.4 1 1 1h11c.6 0 1-.4 1-1v-4.5m2.4-10a2 2 0 0 1 0 3l-6.8 6.8L8 14l.7-3.6 6.9-6.8a2 2 0 0 1 2.8 0Z"
                    />
                  </svg>
                </button>
                {editing ? (
                  <TextareaAutosize
                    name="name"
                    className="bg-transparent text-xl font-bold p-0 w-full rounded-md border-zinc-300 dark:border-zinc-700"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    disabled={assignment.isLoading || assignment.completed}
                  />
                ) : (
                  <a
                    href={
                      isMobile
                        ? assignment.link.replace('https', 'canvas-courses')
                        : assignment.link
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <h3
                      className={
                        dateObject < new Date() && !assignment.completed
                          ? 'text-red-600 text-xl font-bold line-clamp-1'
                          : dateObject.toDateString() === new Date().toDateString() &&
                            !assignment.completed
                          ? 'text-yellow-600 text-xl font-bold line-clamp-1'
                          : assignment.completed
                          ? 'text-zinc-300 dark:text-zinc-700 text-xl font-bold line-clamp-1'
                          : 'text-xl font-bold line-clamp-1'
                      }
                    >
                      {assignment.name}
                    </h3>
                  </a>
                )}
              </div>
            </div>
            <div className="flex">
              <button
                className={`px-3 bg-gradient-to-bl from-emerald-500 to-lime-700 font-semibold text-white rounded-md py-1 ml-2`}
                onClick={(e) => handleToggleDone(e, assignment._id)}
                type="button"
              >
                {assignment.completed ? '⇧' : '✓'}
              </button>
              {assignment.completed && (
                <button
                  className={`px-3 ${
                    assignment.completed
                      ? 'ml-2 px-3 bg-gradient-to-bl from-rose-500 to-red-700'
                      : 'bg-green-600'
                  } text-white rounded-md py-1 font-bold`}
                  onClick={() => confirmComplete(assignment._id)}
                  type="button"
                  disabled={assignment.confirmedCompleted || !assignment.completed}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-start space-x-2 items-center w-full">
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z" />
            </svg>
            {editing ? (
              <input
                type="datetime-local"
                name="dueDate"
                className="w-full md:w-auto md:max-w-full bg-transparent p-0 rounded-md border-zinc-300 dark:border-zinc-700 dark:[color-scheme:dark]"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={toInputFriendlyTime(formik.values.dueDate)}
                disabled={assignment.isLoading || assignment.completed}
              />
            ) : (
              <p className="w-full text-default">{toDateTimeString(dateObject)}</p>
            )}
          </div>
          <div>
            <p>
              <strong>Points: </strong>
              {assignment.pointsPossible}
            </p>
          </div>
          <div className="pb-2">
            <p className="break-words">{assignment.description}</p>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex justify-between items-center">
              <select
                name="type"
                className={`w-1/2 rounded-md ${
                  assignment.completed
                    ? 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700'
                    : 'bg-transparent border-zinc-300 dark:border-zinc-700'
                }
                   dark:text-white"
                  name="type`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.type}
                disabled={!editing || assignment.isLoading || assignment.completed}
              >
                <option value="Assignment">Assignment</option>
                <option value="Quiz">Quiz</option>
                <option value="Project">Project</option>
                <option value="Exam">Exam</option>
                <option value="Other">Other</option>
              </select>

              <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
                <div className="ml-8 w-1/2 mr-4">
                  <Slider
                    name="difficulty"
                    className={`${
                      assignment.completed ? 'text-zinc-300 dark:text-zinc-700' : 'text-blue-600'
                    }`}
                    value={formik.values.difficulty}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!editing || assignment.isLoading || assignment.completed}
                    step={1}
                    marks={marks}
                    min={1}
                    max={5}
                    valueLabelDisplay="off"
                  />
                </div>
              </ThemeProvider>
            </div>
            <div>
              {formik.values.reminders && formik.values.reminders.length > 0 && (
                <p className="text-base font-semibold">Reminders:</p>
              )}
              {formik.values.reminders.map((reminder, index) => {
                return (
                  <div key={index} className="flex items-center">
                    <p className="text-default font-bold mr-2">•</p>
                    {editing ? (
                      <>
                        <TextareaAutosize
                          name={`reminders.${index}`}
                          className={`p-0 w-full rounded-md border bg-transparent dark:bg-transparent ${
                            assignment.completed
                              ? 'border-zinc-200 dark:border-zinc-800'
                              : 'border-zinc-300 dark:border-zinc-700'
                          } `}
                          onChange={(e) => {
                            const updatedReminders = [...formik.values.reminders];
                            updatedReminders[index] = e.target.value;
                            formik.setFieldValue('reminders', updatedReminders);
                          }}
                          onBlur={formik.handleBlur}
                          placeholder="Reminder..."
                          value={formik.values.reminders[index] || ''} // Add a default value in case of undefined
                          disabled={!editing || assignment.isLoading || assignment.completed}
                        />

                        <button
                          type="button"
                          onClick={() => deleteReminder(index)}
                          disabled={!editing || assignment.isLoading || assignment.completed}
                          className="ml-2"
                        >
                          ⓧ
                        </button>
                      </>
                    ) : (
                      <p className="break-all">{formik.values.reminders[index] || ''}</p>
                    )}
                  </div>
                );
              })}

              {editing && (
                <button
                  className={
                    assignment.completed
                      ? 'text-xs text-zinc-300 dark:text-zinc-700'
                      : 'text-xs underline text-zinc-400 dark:text-zinc-500'
                  }
                  type="button"
                  onClick={addReminder}
                  disabled={!editing || assignment.isLoading || assignment.completed}
                >
                  Add Reminder
                </button>
              )}
            </div>

            {/* Update and Undo Buttons */}
            <>
              {formik.dirty && (
                <>
                  <button
                    type="submit"
                    className="mt-2 px-4 mr-2 bg-gradient-to-bl from-emerald-500 to-lime-700 text-white rounded-md py-2"
                    disabled={assignment.isLoading || assignment.completed}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      formik.resetForm();
                      setEditing(false);
                    }}
                    type="button"
                    className="mt-2 px-4 mr-4 bg-gradient-to-bl from-rose-500 to-red-700 text-white rounded-md py-2"
                    disabled={assignment.isLoading || assignment.completed}
                  >
                    Undo
                  </button>
                </>
              )}
            </>
          </form>
        </div>
      </div>
    </LoadingOverlay>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  completeCanvasAssignment,
  updateCanvasAssignment,
  confirmComplete,
})(CanvasAssign);
