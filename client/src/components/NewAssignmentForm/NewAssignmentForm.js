import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_ASSIGNMENT } from '../redux/constant';
import TextAreaAutosize from 'react-textarea-autosize';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import applyTheme from '../utils/colorThemeHandler';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

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

const NewAssignmentForm = ({ onFormSubmit }) => {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setColorTheme('dark');
    } else {
      setColorTheme('light');
    }
    applyTheme();
  });

  let userData = useSelector((state) => state.userDataReducer);
  const [utcDateTime, setUtcDateTime] = useState('');
  const [theColorTheme, setColorTheme] = useState(localStorage.theme);
  const [assignment, setAssignment] = useState({
    name: '',
    dueDate: null,
    type: 'Other',
    difficulty: '1',
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setAssignment({ ...assignment, [name]: value });
  };

  const handleDateChange = (data) => {
    if (!data) return;
    const date = data.$d;
    setUtcDateTime(date.toISOString());
    setAssignment({ ...assignment, ['dueDate']: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      assignment: {
        name: assignment.name,
        dueDate: utcDateTime,
        type: assignment.type,
        difficulty: assignment.difficulty,
      },
      calendarId: userData.calendarId,
    };

    dispatch({ type: ADD_ASSIGNMENT, payload: { data } });

    setAssignment({
      name: '',
      dueDate: null,
      type: 'Other',
      difficulty: '1',
    });

    setUtcDateTime('');
    onFormSubmit();
  };

  useEffect(() => {
    if (!localStorage.theme || localStorage.theme === '') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColorTheme(prefersDark ? 'dark' : 'light');
    }
    setAssignment({
      name: '',
      dueDate: null,
      type: 'Other',
      difficulty: '1',
    });
    setUtcDateTime('');
  }, []);

  return (
    <div className="flex justify-center items-center flex-grow p-10">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg p-5 bg-gray-100 rounded-lg dark:bg-zinc-800 md:p-8"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold md:text-2xl">Add New Assignment</h2>
            <button onClick={onFormSubmit} className="text-zinc-500 w-10 h-10 text-xl">
              X
            </button>
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="block mb-2">
              Name:
            </label>
            <TextAreaAutosize
              type="text"
              id="name"
              name="name"
              value={assignment.name}
              onChange={handleChange}
              placeholder="Assignment Name"
              className="w-full rounded-md py-4 px-4 focus:outline-none focus:border-blue-500 dark:text-white dark:bg-zinc-600"
            />
          </div>
          <ThemeProvider theme={theColorTheme === 'dark' ? darkTheme : lightTheme}>
            <div className="mb-4">
              <label htmlFor="dueDate" className="block mb-2">
                Due Date:
              </label>

              <DateTimePicker
                className="w-full bg-white dark:bg-zinc-600 border-none"
                value={assignment.dueDate}
                onChange={(value) => handleDateChange(value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="type" className="block mb-2">
                Type:
              </label>
              <Select
                id="type"
                name="type"
                value={assignment.type}
                onChange={(value) => handleChange(value)}
                className="w-full bg-white rounded-md dark:text-white dark:bg-zinc-600"
              >
                <MenuItem value="Other">Other</MenuItem>
                <MenuItem value="Assignment">Assignment</MenuItem>
                <MenuItem value="Quiz">Quiz</MenuItem>
                <MenuItem value="Project">Project</MenuItem>
                <MenuItem value="Exam">Exam</MenuItem>
              </Select>
            </div>
            <div className="mb-4">
              <label htmlFor="difficulty" className="block mb-2">
                Difficulty:
              </label>
              <Select
                id="difficulty"
                name="difficulty"
                value={assignment.difficulty}
                onChange={handleChange}
                className="w-full bg-white rounded-md focus:outline-none focus:border-blue-500 dark:text-white dark:bg-zinc-600"
              >
                <MenuItem value="1">Difficulty 1</MenuItem>
                <MenuItem value="2">Difficulty 2</MenuItem>
                <MenuItem value="3">Difficulty 3</MenuItem>
                <MenuItem value="4">Difficulty 4</MenuItem>
                <MenuItem value="5">Difficulty 5</MenuItem>
              </Select>
            </div>
          </ThemeProvider>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700 mt-4 items-center"
            >
              Add Assignment
            </button>
          </div>
        </form>
      </LocalizationProvider>
    </div>
  );
};

export default NewAssignmentForm;
