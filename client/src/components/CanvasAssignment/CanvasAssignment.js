import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
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
      dueDate: assignment.dueDate,
      type: assignment.type,
      difficulty: parseInt(assignment.difficulty),
      reminders: [...assignment.reminders],
    },
    validationSchema: assignmentFormSchema,
    onSubmit: (values) => {
      updateCanvasAssignment(assignment._id, values);
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

  // dont reset form if there is an error
  useEffect(() => {
    if (!assignment.error && !assignment.isLoading) formik.resetForm();
  }, [assignment.error, assignment.isLoading]);

  const dateObject = new Date(assignment.dueDate);
  const dateTime = dateObject.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
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
              ? 'p-5 mb-5 rounded-md bg-zinc-100 dark:bg-zinc-900'
              : formik.dirty
              ? 'p-5 mb-5 border-2 border-sky-600 dark:border-sky-700 bg-gradient-to-bl from-slate-200 dark:from-slate-900 to-zinc-50 dark:to-zinc-800 rounded-md'
              : 'p-5 mb-5 bg-gradient-to-bl from-slate-200 dark:from-slate-900 to-zinc-50 dark:to-zinc-800 rounded-md'
          }
        >
          <div className="flex justify-between items-center space-x-2 mb-2">
            <a href={assignment.link} target="_blank" rel="noreferrer">
              <h3
                className={
                  dateObject < new Date() && !assignment.completed
                    ? 'text-red-600 text-xl md:text-2xl font-bold underline'
                    : dateObject.toDateString() === new Date().toDateString() &&
                      !assignment.completed
                    ? 'text-yellow-600 text-xl md:text-2xl font-bold underline'
                    : assignment.completed
                    ? 'text-zinc-300 dark:text-zinc-700 text-xl md:text-2xl font-bold'
                    : 'text-xl md:text-2xl font-bold underline'
                }
              >
                {assignment.name}
              </h3>
            </a>
            <div className="flex">
              <button
                className={`px-4 bg-gradient-to-bl from-emerald-500 to-lime-700 font-semibold text-white rounded-md py-1 ml-2`}
                onClick={(e) => handleToggleDone(e, assignment._id)}
                type="button"
              >
                {assignment.completed ? '⇧' : '✓'}
              </button>
              {assignment.completed && (
                <button
                  className={`px-4 ${
                    assignment.completed
                      ? 'ml-2 px-4 bg-gradient-to-bl from-rose-500 to-red-700'
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
              className={`w-4 h-4`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z" />
            </svg>
            <p className="w-full text-default">{dateTime}</p>
          </div>
          <div>
            <p>
              <strong>Points: </strong>
              {assignment.pointsPossible}
            </p>
          </div>
          <div className="pb-2">
            <p>{assignment.description}</p>
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
                disabled={assignment.isLoading || assignment.completed}
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
                    disabled={assignment.isLoading || assignment.completed}
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
                <p className="text-lg font-semibold">Reminders:</p>
              )}
              {formik.values.reminders.map((reminder, index) => {
                return (
                  <div key={index} className={`flex items-center w-full space-x-2 mb-1 `}>
                    <p className="text-2xl font-bold">•</p>
                    <TextareaAutosize
                      name={`reminders.${index}`}
                      className={`py-1 w-full rounded-md border bg-transparent dark:bg-transparent ${
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
                      disabled={assignment.isLoading || assignment.completed}
                    />

                    <button
                      type="button"
                      onClick={() => deleteReminder(index)}
                      disabled={assignment.isLoading || assignment.completed}
                    >
                      ⓧ
                    </button>
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
                disabled={assignment.isLoading || assignment.completed}
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
                    disabled={assignment.isLoading || assignment.completed}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      formik.resetForm();
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
