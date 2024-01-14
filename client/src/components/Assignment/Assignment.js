import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';

import {
  completeAssignment,
  editAssignment,
  clearMessageError,
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
  clearMessageError,
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
      <div className="dark:text-white w-full">
        <div
          className={
            assignment.completed
              ? 'p-5 mt-5 rounded-md bg-zinc-100 text-zinc-400 dark:bg-zinc-900 dark:text-zinc-700'
              : isEdit
              ? 'p-5 mt-5 border-2 bg-zinc-100 dark:bg-zinc-900 border-red-600 rounded-md'
              : 'p-5 mt-5 bg-zinc-100 dark:bg-zinc-900 rounded-md'
          }
        >
          <div>
            <div className="flex justify-between items-center space-x-2 mb-2">
              <h3
                className={
                  dateObject < new Date() && !assignment.completed
                    ? 'text-red-700 text-xl md:text-2xl font-bold'
                    : dateObject.toDateString() === new Date().toDateString() &&
                      !assignment.completed
                    ? 'text-yellow-600 text-xl md:text-2xl font-bold'
                    : assignment.completed
                    ? 'text-zinc-400 dark:text-zinc-700 text-xl md:text-2xl font-bold'
                    : 'text-xl md:text-2xl font-bold'
                }
              >
                {assignment.name}
              </h3>
              <div className="flex">
                <button
                  className={`px-4 ${
                    assignment.completed ? 'bg-green-600 dark:bg-green-700' : 'bg-green-600'
                  } text-white rounded-md px-3 py-1 ml-2`}
                  onClick={(e) => handleDelete(e, assignment._id)}
                  type="button"
                >
                  {assignment.completed ? '⇧' : '✓'}
                </button>
                {assignment.completed && (
                  <button
                    className={`px-4 ${
                      assignment.completed ? 'ml-2 px-4 bg-red-600 dark:bg-red-700' : 'bg-green-600'
                    } text-white rounded-md py-1`}
                    onClick={() => confirmComplete(assignment._id)}
                    type="button"
                    disabled={assignment.confirmedCompleted || !assignment.completed}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <p className="mb-2 w-full text-sm md:text-lg">{'Due: ' + dateTime}</p>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex justify-between items-center">
                <select
                  name="type"
                  className={`p-2 mb-2 w-1/2 rounded-md ${
                    assignment.completed ? 'bg-white dark:bg-zinc-900' : 'bg-white dark:bg-zinc-800'
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
                  <div className="ml-8 mb-2 w-1/2 mr-4">
                    <Slider
                      name="difficulty"
                      className={`${
                        assignment.completed
                          ? 'text-zinc-300 dark:text-zinc-700'
                          : 'text-zinc-600 dark:text-white'
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
                  <p className="text-lg mb-2 font-bold">Reminders:</p>
                )}
                {formik.values.reminders.map((reminder, index) => {
                  return (
                    <div key={index} className="flex items-center w-full space-x-2 mb-2">
                      <span className="text-2xl font-bold">•</span>
                      <TextareaAutosize
                        name={`reminders.${index}`}
                        className={`p-2 w-full rounded-md border border-zinc-200 dark:${
                          assignment.completed ? 'text-zinc-700' : 'text-white'
                        } dark:bg-transparent dark:border-zinc-600`}
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
                  className="mb-2 text-sm underline text-zinc-500"
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
                      className="px-4 mr-4 bg-green-600 text-white rounded-md py-2"
                      disabled={assignment.isLoading}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        // setIsEdit((oldIsEdit) => !oldIsEdit);
                        clearMessageError(assignment._id);
                        // refill fields with original values
                        fillOriginalValues();
                      }}
                      type="button"
                      className="px-4 mr-4 bg-red-600 text-white rounded-md py-2"
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
  clearMessageError,
  confirmComplete,
})(Assignment);
