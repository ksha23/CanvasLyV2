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
    onSubmit: (values, { resetForm }) => {
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

  const handleFieldChange = (e) => {
    formik.handleChange(e);
    const values = formik.values;
    const valuesCopy = { ...values };
    valuesCopy[e.target.name] = e.target.value;

    // check if any of the values are different from the original
    if (valuesCopy.type !== assignment.type) {
      setIsEdit(true);
      return;
    }
    if (parseInt(valuesCopy.difficulty) !== assignment.difficulty) {
      setIsEdit(true);
      return;
    }
    for (let i = 0; i < Math.max(valuesCopy.reminders.length, assignment.reminders.length); i++) {
      if (valuesCopy.reminders[i] === undefined || assignment.reminders[i] === undefined) {
        setIsEdit(true);
        return;
      }
      if (valuesCopy.reminders[i] !== assignment.reminders[i]) {
        setIsEdit(true);
        return;
      }
    }
    setIsEdit(false);
  };

  const fillOriginalValues = () => {
    formik.resetForm();
    setIsEdit(false);
  };

  const addReminder = () => {
    formik.setFieldValue('reminders', [...formik.values.reminders, '']); // Append an empty reminder
    setIsEdit(!lodash.isEqual([...formik.values.reminders, ''], [...assignment.reminders]));
  };

  const deleteReminder = (indexToDelete) => {
    const updatedReminders = formik.values.reminders.filter((_, index) => index !== indexToDelete);
    formik.setFieldValue('reminders', updatedReminders);
    setIsEdit(!lodash.isEqual(updatedReminders, assignment.reminders));
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
    <LoadingOverlay
      active={assignment.isLoading}
      spinner={<Loader />}
      text="Updating..."
      className="rounded-md"
    >
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
              : isEdit
              ? 'p-5 mt-5 border-2 border-sky-600 dark:border-sky-700 bg-gradient-to-bl from-slate-200 dark:from-slate-900 to-zinc-100 dark:to-zinc-900 rounded-md'
              : 'p-5 mt-5 bg-gradient-to-bl from-slate-200 dark:from-slate-900 to-zinc-100 dark:to-zinc-900 rounded-md'
          }
        >
          <div className="flex justify-between items-center space-x-2 mb-2">
            <h3
              className={
                dateObject < new Date() && !assignment.completed
                  ? 'text-red-600 dark:text-red-700 text-xl md:text-2xl font-bold'
                  : dateObject.toDateString() === new Date().toDateString() && !assignment.completed
                  ? 'text-yellow-600 text-xl md:text-2xl font-bold'
                  : assignment.completed
                  ? 'text-zinc-300 dark:text-zinc-700 text-xl md:text-2xl font-bold'
                  : 'text-xl md:text-2xl font-bold'
              }
            >
              {assignment.name}
            </h3>
            <div className="flex">
              <button
                className={`px-4 ${
                  assignment.completed
                    ? 'bg-gradient-to-bl from-emerald-500 to-lime-700 font-semibold'
                    : 'bg-gradient-to-bl from-emerald-500 to-lime-700 font-semibold'
                } text-white rounded-md px-3 py-1 ml-2`}
                onClick={(e) => handleDelete(e, assignment._id)}
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
            <p className="w-full text-sm md:text-lg">{dateTime}</p>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex justify-between items-center">
              <select
                name="type"
                className={`p-2 mb-0 w-1/2 rounded-md ${
                  assignment.completed ? 'bg-white dark:bg-zinc-900' : 'bg-white dark:bg-gray-800'
                }
                   dark:text-white"
                  name="type`}
                onChange={handleFieldChange}
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
                <div className="ml-8 mb-0 w-1/2 mr-4">
                  <Slider
                    name="difficulty"
                    className={`${
                      assignment.completed ? 'text-zinc-300 dark:text-zinc-700' : 'text-blue-600'
                    }`}
                    value={formik.values.difficulty}
                    onChange={handleFieldChange}
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
                <p className="text-md mb-1 font-semibold">Reminders:</p>
              )}
              {formik.values.reminders.map((reminder, index) => {
                return (
                  <div key={index} className={`flex items-center w-full space-x-2 mb-1 `}>
                    <p className="text-2xl font-bold">•</p>
                    <TextareaAutosize
                      name={`reminders.${index}`}
                      className={`px-2 py-1 text-sm w-full rounded-md border bg-transparent dark:bg-transparent ${
                        assignment.completed
                          ? 'border-zinc-200 dark:border-zinc-800'
                          : 'border-slate-400 dark:border-slate-600'
                      } `}
                      onChange={(e) => {
                        const updatedReminders = [...formik.values.reminders];
                        updatedReminders[index] = e.target.value;
                        formik.setFieldValue('reminders', updatedReminders);
                        setIsEdit(!lodash.isEqual(updatedReminders, assignment.reminders));
                      }}
                      onBlur={formik.handleBlur}
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
                className="mb-2 text-xs underline text-zinc-400 dark:text-zinc-500"
                type="button"
                onClick={addReminder}
                disabled={assignment.isLoading || assignment.completed}
              >
                Add Reminder
              </button>
            </div>

            <>
              {isEdit && (
                <>
                  <button
                    type="submit"
                    className="px-4 mr-2 bg-gradient-to-bl from-emerald-500 to-lime-700 text-white rounded-md py-2"
                    disabled={assignment.isLoading}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      // setIsEdit((oldIsEdit) => !oldIsEdit);
                      clearAssignmentError(assignment._id);
                      // refill fields with original values
                      fillOriginalValues();
                    }}
                    type="button"
                    className="px-4 mr-4 bg-gradient-to-bl from-rose-500 to-red-700 text-white rounded-md py-2"
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
