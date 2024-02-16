import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';

import {
  completeAssignment,
  editAssignment,
  clearAssignmentError,
  confirmComplete,
} from '../../store/actions/assignmentActions';
import { assignmentFormSchema } from './validation';
import lodash from 'lodash';
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

// auth is not used here
const Assignment = ({
  assignment,
  completeAssignment,
  editAssignment,
  clearAssignmentError,
  confirmComplete,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      difficulty: parseInt(assignment.difficulty),
      type: assignment.type,
      reminders: [...assignment.reminders],
    },
    validationSchema: assignmentFormSchema,
    onSubmit: (values) => {
      editAssignment(assignment._id, { values });
      setIsEdit(false);
      // resetForm();
    },
  });

  const [theme, setTheme] = useState(
    assignment.completed
      ? (localStorage.getItem('theme') || 'light') === 'light'
        ? 'dark'
        : 'light'
      : localStorage.getItem('theme') || 'light',
  );
  window.addEventListener('themeChange', handleThemeChange);

  function handleThemeChange() {
    if (assignment.completed) {
      const currentTheme = localStorage.getItem('theme') || 'light';
      setTheme(currentTheme === 'light' ? 'dark' : 'light');
      return;
    }
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
  }

  const [isEdit, setIsEdit] = useState(false);

  const handleDelete = (e, id) => {
    e.preventDefault();
    completeAssignment(id);
  };

  const addReminder = () => {
    formik.setFieldValue('reminders', [...formik.values.reminders, '']); // Append an empty reminder
  };

  const deleteReminder = (indexToDelete) => {
    const updatedReminders = formik.values.reminders.filter((_, index) => index !== indexToDelete);
    formik.setFieldValue('reminders', updatedReminders);
  };

  // dont reset form if there is an error
  useEffect(() => {
    if (!assignment.error && !assignment.isLoading) formik.resetForm();
  }, [assignment.error, assignment.isLoading]);

  // keep edit open if there is an error
  useEffect(() => {
    if (assignment.error) setIsEdit(true);
  }, [assignment.error]);

  const dateObject = new Date(assignment.dueDate);
  const dateTime = dateObject.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    hour12: true,
  });

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
              ? 'p-5 mt-5 rounded-md bg-zinc-100 dark:bg-zinc-900'
              : formik.dirty
              ? 'p-5 mt-5 border-2 border-red-600 bg-gradient-to-bl from-slate-200 dark:from-slate-900 to-zinc-50 dark:to-zinc-800 rounded-md'
              : isEdit
              ? 'p-5 mt-5 border-2 border-sky-600 dark:border-sky-700 bg-gradient-to-bl from-slate-200 dark:from-slate-900 to-zinc-50 dark:to-zinc-800 rounded-md'
              : 'p-5 mt-5 bg-gradient-to-bl from-slate-200 dark:from-slate-900 to-zinc-50 dark:to-zinc-800 rounded-md'
          }
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex space-x-1">
              <button
                disabled={assignment.completed || assignment.isLoading}
                className="text-sm"
                onClick={() => setIsEdit(!isEdit)}
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
              <h3
                className={
                  dateObject < new Date() && !assignment.completed
                    ? 'text-red-600 text-xl font-bold'
                    : dateObject.toDateString() === new Date().toDateString() &&
                      !assignment.completed
                    ? 'text-yellow-600 text-xl font-bold'
                    : assignment.completed
                    ? 'text-zinc-300 dark:text-zinc-700 text-xl font-bold'
                    : 'text-xl font-bold'
                }
              >
                {assignment.name}
              </h3>
            </div>
            <div className="flex">
              <button
                className={`bg-gradient-to-bl from-emerald-500 to-lime-700 font-semibold
                 text-white rounded-md px-3 py-1`}
                onClick={(e) => handleDelete(e, assignment._id)}
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
          <div className="flex justify-start space-x-2 items-center">
            <svg
              className={`w-3 h-3`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z" />
            </svg>
            <p className="w-full text-base">{dateTime}</p>
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
                disabled={!isEdit || assignment.isLoading || assignment.completed}
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
                    disabled={!isEdit || assignment.isLoading || assignment.completed}
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
                    {isEdit ? (
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
                            setIsEdit(!lodash.isEqual(updatedReminders, assignment.reminders));
                          }}
                          onBlur={formik.handleBlur}
                          placeholder="Reminder..."
                          value={formik.values.reminders[index] || ''} // Add a default value in case of undefined
                          disabled={assignment.isLoading || assignment.completed}
                        />

                        <button
                          type="button"
                          onClick={() => deleteReminder(index)}
                          disabled={assignment.isLoading || assignment.completed}
                          className="ml-2"
                        >
                          ⓧ
                        </button>
                      </>
                    ) : (
                      <p>{formik.values.reminders[index] || ''}</p>
                    )}
                  </div>
                );
              })}
              <button
                className={
                  assignment.completed
                    ? 'text-xs text-zinc-300 dark:text-zinc-700'
                    : 'text-xs underline text-zinc-400 dark:text-zinc-500'
                }
                type="button"
                onClick={addReminder}
                disabled={!isEdit || assignment.isLoading || assignment.completed}
              >
                Add Reminder
              </button>
            </div>

            <>
              {formik.dirty && (
                <>
                  <button
                    type="submit"
                    className="mt-2 px-4 mr-2 bg-gradient-to-bl from-emerald-500 to-lime-700 text-white rounded-md py-2"
                    disabled={assignment.isLoading}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      clearAssignmentError(assignment._id);
                      formik.resetForm();
                      setIsEdit(false);
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
  completeAssignment,
  editAssignment,
  clearAssignmentError,
  confirmComplete,
})(Assignment);
