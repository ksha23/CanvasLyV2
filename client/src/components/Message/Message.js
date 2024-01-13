import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';

import {
  deleteMessage,
  editMessage,
  clearMessageError,
  confirmComplete,
} from '../../store/actions/messageActions';
import { messageFormSchema } from './validation';
import lodash from 'lodash';
import Slider from '@mui/material/Slider';
import Loader from '../Loader/Loader';
import LoadingOverlay from 'react-loading-overlay';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

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
const Message = ({
  message,
  auth,
  deleteMessage,
  editMessage,
  clearMessageError,
  confirmComplete,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      difficulty: parseInt(message.difficulty),
      type: message.type,
      reminders: [...message.reminders],
    },
    validationSchema: messageFormSchema,
    onSubmit: (values, { resetForm }) => {
      editMessage(message._id, { values });
      setIsEdit(false);
      // resetForm();
    },
  });

  const [isEdit, setIsEdit] = useState(false);

  const handleDelete = (e, id) => {
    e.preventDefault();
    deleteMessage(id);
  };

  const handleFieldChange = (e) => {
    formik.handleChange(e);
    const values = formik.values;
    const valuesCopy = { ...values };
    valuesCopy[e.target.name] = e.target.value;

    // check if any of the values are different from the original
    if (valuesCopy.type !== message.type) {
      setIsEdit(true);
      return;
    }
    if (parseInt(valuesCopy.difficulty) !== message.difficulty) {
      setIsEdit(true);
      return;
    }
    for (let i = 0; i < Math.max(valuesCopy.reminders.length, message.reminders.length); i++) {
      if (valuesCopy.reminders[i] === undefined || message.reminders[i] === undefined) {
        setIsEdit(true);
        return;
      }
      if (valuesCopy.reminders[i] !== message.reminders[i]) {
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
    setIsEdit(!lodash.isEqual([...formik.values.reminders, ''], [...message.reminders]));
  };

  const deleteReminder = (indexToDelete) => {
    const updatedReminders = formik.values.reminders.filter((_, index) => index !== indexToDelete);
    formik.setFieldValue('reminders', updatedReminders);
    setIsEdit(!lodash.isEqual(updatedReminders, message.reminders));
  };

  // dont reset form if there is an error
  useEffect(() => {
    if (!message.error && !message.isLoading) formik.resetForm();
  }, [message.error, message.isLoading]);

  // keep edit open if there is an error
  useEffect(() => {
    if (message.error) setIsEdit(true);
  }, [message.error]);

  const dateObject = new Date(message.dueDate);
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
      active={message.isLoading}
      spinner={<Loader />}
      text="Updating..."
      className="rounded-md"
    >
      <div className="dark:text-white w-full">
        <div
          className={
            message.completed
              ? 'p-5 mt-5 border rounded-md border-gray-200 text-zinc-400 dark:border-gray-800 dark:text-zinc-700 dark:border'
              : isEdit
              ? 'p-5 mt-5 border-2 border-red-600 rounded-md'
              : 'p-5 mt-5 border border-gray-400 dark:border-gray-600 rounded-md'
          }
        >
          <div>
            <div className="flex justify-between items-center space-x-2 mb-2">
              <h3
                className={
                  dateObject < new Date()
                    ? 'text-red-700 text-xl font-bold'
                    : dateObject.toDateString() === new Date().toDateString()
                    ? 'text-yellow-600 text-xl font-bold'
                    : 'test-black dark:text-white text-xl font-bold'
                }
              >
                {message.name}
              </h3>
              <div className="flex">
                <button
                  className={`px-4 ${
                    message.completed ? 'bg-green-600 dark:bg-green-700' : 'bg-green-600'
                  } text-white rounded-md py-2 ml-2`}
                  onClick={(e) => handleDelete(e, message._id)}
                  type="button"
                >
                  {message.completed ? '⇧' : '✓'}
                </button>
                {message.completed && (
                  <button
                    className={`px-4 ${
                      message.completed ? 'ml-2 bg-red-600 dark:bg-red-700' : 'bg-green-600'
                    } text-white rounded-md py-2`}
                    onClick={() => confirmComplete(message._id)}
                    type="button"
                    disabled={message.confirmedCompleted || !message.completed}
                  >
                    X
                  </button>
                )}
              </div>
            </div>
            <p className="mb-2 w-full">{'Due Date: ' + dateTime}</p>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex justify-between items-center">
                <select
                  name="type"
                  className={`p-2 mb-2 w-1/2 rounded-md ${
                    message.completed
                      ? 'bg-zinc-100 dark:bg-zinc-900'
                      : 'bg-zinc-200 dark:bg-zinc-700'
                  }
                   dark:text-white"
                  name="type`}
                  onChange={handleFieldChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.type}
                  disabled={message.isLoading || message.completed}
                >
                  <option value="Assignment">Assignment</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Project">Project</option>
                  <option value="Exam">Exam</option>
                  <option value="Other">Other</option>
                </select>

                <div className="ml-8 mb-2 w-1/2">
                  <Slider
                    name="difficulty"
                    className=""
                    value={formik.values.difficulty}
                    onChange={handleFieldChange}
                    disabled={message.isLoading || message.completed}
                    step={1}
                    marks={marks}
                    min={1}
                    max={5}
                    valueLabelDisplay="off"
                  />
                </div>
              </div>
              <div>
                {formik.values.reminders && formik.values.reminders.length > 0 && (
                  <p className="text-lg mb-2 font-bold">Reminders:</p>
                )}
                {formik.values.reminders.map((reminder, index) => {
                  return (
                    <div key={index} className="flex items-center w-full space-x-2">
                      <span className="text-2xl font-bold">•</span>
                      <TextareaAutosize
                        name={`reminders.${index}`}
                        className={`p-2 mb-2 w-full rounded-md border border-zinc-200 dark:${
                          message.completed ? 'text-zinc-700' : 'text-white'
                        } dark:bg-transparent dark:border-zinc-600`}
                        onChange={(e) => {
                          const updatedReminders = [...formik.values.reminders];
                          updatedReminders[index] = e.target.value;
                          formik.setFieldValue('reminders', updatedReminders);
                          setIsEdit(!lodash.isEqual(updatedReminders, message.reminders));
                        }}
                        onBlur={formik.handleBlur}
                        value={formik.values.reminders[index] || ''} // Add a default value in case of undefined
                        disabled={message.isLoading || message.completed}
                      />

                      <button
                        type="button"
                        onClick={() => deleteReminder(index)}
                        disabled={message.isLoading || message.completed}
                      >
                        ⓧ
                      </button>
                    </div>
                  );
                })}
                <button
                  className="mb-2 underline text-zinc-500"
                  type="button"
                  onClick={addReminder}
                  disabled={message.isLoading || message.completed}
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
                      disabled={message.isLoading}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        // setIsEdit((oldIsEdit) => !oldIsEdit);
                        clearMessageError(message._id);
                        // refill fields with original values
                        fillOriginalValues();
                      }}
                      type="button"
                      className="px-4 mr-4 bg-red-600 text-white rounded-md py-2"
                      disabled={message.isLoading || message.completed}
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
  deleteMessage,
  editMessage,
  clearMessageError,
  confirmComplete,
})(Message);
