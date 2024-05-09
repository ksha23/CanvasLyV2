import React from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';

import { addAssignment } from '../../store/actions/assignmentActions';
import { assignmentFormSchema } from './validation';
import Slider from '@mui/material/Slider';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import { useState } from 'react';

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

const NewCanvasAssignment = ({ addAssignment, assignment: { assignments }, closeForm }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      dueDate: new Date(),
      description: null,
      pointsPossible: 0,
      type: 'Other',
      difficulty: 1,
      reminders: '',
    },
    validationSchema: assignmentFormSchema,
    onSubmit: (values, { resetForm }) => {
      addAssignment({ formData: values });
      resetForm();
      closeForm();
    },
  });

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  window.addEventListener('themeChange', handleThemeChange);

  function handleThemeChange() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
  }

  // const isSubmiting = assignments.some((m) => m.id === 0);
  const isSubmiting = false;

  return (
    <div className="mt-2 dark:text-white max-w-2xl w-full p-10">
      <div className="p-6 pt-3 md:pt-6 rounded-md bg-gradient-to-bl from-slate-200 dark:from-slate-900 to-slate-50 dark:to-slate-800">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl md:text-3xl font-bold">New Assignment</h1>
          <button
            className="px-3 py-1 text-2xl md:text-lg rounded-full text-slate-700 dark:text-slate-400"
            onClick={closeForm}
            disabled={isSubmiting}
          >
            ✕
          </button>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-1">
            <label htmlFor="name">Name:</label>
            <TextareaAutosize
              name="name"
              className="bg-transparent rounded-md w-full border border-slate-300 dark:border-slate-600"
              placeholder="Assignment name..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              disabled={isSubmiting}
            />
            {formik.touched.name && formik.errors.name ? (
              <p className="text-red-600">{formik.errors.name}</p>
            ) : null}
          </div>
          <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <div className="mb-2">
              <label htmlFor="dueDate">Due Date:</label>
              <div>
                <input
                  type="datetime-local"
                  name="dueDate"
                  id="dueDate"
                  className="bg-transparent w-full rounded-md dark:[color-scheme:dark] border border-slate-300 dark:border-slate-600"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.dueDate}
                  disabled={isSubmiting}
                />
              </div>
              {formik.touched.dueDate && formik.errors.dueDate ? (
                <p className="text-red-600">{formik.errors.dueDate}</p>
              ) : null}
            </div>
            <div className="mb-2">
              <label htmlFor="type">Type:</label>
              <select
                name="type"
                className="w-full rounded-md bg-transparent border border-slate-300 dark:border-slate-700"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.type}
                disabled={isSubmiting}
              >
                <option value="Assignment">Assignment</option>
                <option value="Quiz">Quiz</option>
                <option value="Project">Project</option>
                <option value="Exam">Exam</option>
                <option value="Other">Other</option>
              </select>
              {formik.touched.type && formik.errors.type ? (
                <p className="text-red-600">{formik.errors.type}</p>
              ) : null}
            </div>

            <div className="mb-2">
              <label htmlFor="difficulty">Difficulty:</label>
              <div className="mx-4">
                <Slider
                  name="difficulty"
                  className={`mt-1 text-blue-600`}
                  value={formik.values.difficulty}
                  onChange={formik.handleChange}
                  disabled={isSubmiting}
                  step={1}
                  marks={marks}
                  min={1}
                  max={5}
                  valueLabelDisplay="off"
                />
              </div>
              {formik.touched.difficulty && formik.errors.difficulty ? (
                <p className="text-red-600">{formik.errors.difficulty}</p>
              ) : null}
            </div>
          </ThemeProvider>

          <div className="mb-4">
            <label htmlFor="reminders">Reminder:</label>
            <TextareaAutosize
              name="reminders"
              className="bg-transparent rounded-md w-full border border-slate-300 dark:border-slate-700"
              type="text"
              placeholder="Reminder (optional)..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.reminders}
              disabled={isSubmiting}
            />
            {formik.touched.reminders && formik.errors.reminders ? (
              <p className="text-red-600">{formik.errors.reminders}</p>
            ) : null}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-gradient-to-bl from-sky-600 to-blue-800 px-4 py-2 rounded-md text-white w-full"
              value="Add Message"
              disabled={isSubmiting}
            >
              Add Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  assignment: state.assignment,
});

export default connect(mapStateToProps, { addAssignment })(NewCanvasAssignment);
