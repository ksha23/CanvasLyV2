import { useEffect, useState } from 'react';

import Modal from './SuccessPopup';

import { useDispatch, useSelector } from 'react-redux';
import { setWeights } from '../redux/actions/weightsActions';
import { setCalendarId } from '../redux/actions/userActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import applyTheme from '../utils/colorThemeHandler';
import Slider from '@mui/material/Slider';

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

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 1,
    label: '1',
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 4,
    label: '4',
  },
  {
    value: 5,
    label: '5',
  },
  {
    value: 6,
    label: '6',
  },
  {
    value: 7,
    label: '7',
  },
  {
    value: 8,
    label: '8',
  },
  {
    value: 9,
    label: '9',
  },
  {
    value: 10,
    label: '10',
  },
];

const SettingsForm = () => {
  // ------------------ Form State ----------------------
  const [theColorTheme, setColorTheme] = useState(localStorage.theme);
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
  let calendarData = useSelector((state) => state.calendarDataReducer);
  const [calendarId, setTheCalendarId] = useState(userData?.calendarId || '');
  const [dueDateWeight, setDueDateWeight] = useState(userData?.dueDateWeight || '');
  const [typeWeight, setTypeWeight] = useState(userData?.typeWeight || '');
  const [difficultyWeight, setDifficultyWeight] = useState(userData?.difficultyWeight || '');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  // ------------------ Color Theme ----------------------

  function handleThemeChange(theme) {
    if (theme === 'light') {
      localStorage.theme = 'light';
      setColorTheme('light');
    } else if (theme === 'dark') {
      localStorage.theme = 'dark';
      setColorTheme('dark');
    } else {
      localStorage.removeItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColorTheme(prefersDark ? 'dark' : 'light');
    }
    applyTheme(); // Apply the theme after changing it
  }

  // ------------------ Form ----------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tempDueDateWeight = parseInt(dueDateWeight);
    const tempTypeWeight = parseInt(typeWeight);
    const tempDifficultyWeight = parseInt(difficultyWeight);

    const totalWeights = tempDueDateWeight + tempTypeWeight + tempDifficultyWeight;
    if (totalWeights !== 10) {
      setError('ERROR: Weights must add up to 10');
    } else {
      setError('');
      // Process the weights, possibly send them to the server
      dispatch(setWeights(dueDateWeight, difficultyWeight, typeWeight));
      dispatch(setCalendarId(calendarId));

      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    }
  };

  // ------------------ Render ----------------------

  useEffect(() => {
    if (!localStorage.theme || localStorage.theme === '') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColorTheme(prefersDark ? 'dark' : 'light');
    }
    applyTheme();
    if (!userData) return;
    setTheCalendarId(userData.calendarId || '');
    setDueDateWeight(userData.dueDateWeight || '');
    setTypeWeight(userData.typeWeight || '');
    setDifficultyWeight(userData.difficultyWeight || '');
  }, [userData]);

  return (
    <div>
      {userData && calendarData && (
        <div className="rounded-md p-5 pt-2">
          <form onSubmit={handleSubmit}>
            <p className="mb-2 font-semibold">Choose a calendar to display events from:</p>

            <ThemeProvider theme={theColorTheme === 'dark' ? darkTheme : lightTheme}>
              {' '}
              {calendarData && (
                <Select
                  id="calendars"
                  name="calendars"
                  value={calendarId}
                  onChange={(e) => setTheCalendarId(e.target.value)}
                  className="w-full bg-white rounded-md dark:text-white dark:bg-zinc-600"
                >
                  <MenuItem value="">Choose a Calendar</MenuItem>
                  {calendarData.map((calendar) => (
                    <MenuItem key={calendar.id} value={calendar.id}>
                      {calendar.summary}
                    </MenuItem>
                  ))}
                </Select>
              )}
              <p className="mt-4 font-semibold mb-4">Choose weights for sorting:</p>
              <div>
                <label htmlFor="dueDateWeight">Due date:</label>
                <Slider
                  id="dueDateWeight"
                  value={dueDateWeight}
                  onChange={(e, value) => setDueDateWeight(value)}
                  step={1}
                  marks={marks}
                  min={0}
                  max={10}
                  className="w-full mt-2 text-violet-600"
                  valueLabelDisplay="auto"
                />
              </div>
              <div>
                <label htmlFor="typeWeight">Type:</label>
                <Slider
                  id="typeWeight"
                  value={typeWeight}
                  onChange={(e, value) => setTypeWeight(value)}
                  step={1}
                  marks={marks}
                  min={0}
                  max={10}
                  className="w-full mt-2 text-violet-600"
                  valueLabelDisplay="auto"
                />
              </div>
              <div>
                <label htmlFor="difficultyWeight">Difficulty:</label>
                <Slider
                  id="difficultyWeight"
                  value={difficultyWeight}
                  onChange={(e, value) => setDifficultyWeight(value)}
                  step={1}
                  marks={marks}
                  min={0}
                  max={10}
                  className="w-full mt-2 text-violet-600"
                  valueLabelDisplay="auto"
                  // color="#7C3AED"
                />
              </div>
            </ThemeProvider>
            <p className="mt-4 font-semibold">Choose a color theme:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-4">
              <button
                type="button"
                className="bg-violet-200 hover:bg-violet-300 text-black py-2 px-4 rounded"
                onClick={() => handleThemeChange('light')}
              >
                Light
              </button>
              <button
                type="button"
                className="bg-violet-800 hover:bg-violet-900 text-white py-2 px-4 rounded"
                onClick={() => handleThemeChange('dark')}
              >
                Dark
              </button>
              <button
                type="button"
                className="bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded"
                onClick={() => handleThemeChange('system')}
              >
                System
              </button>
            </div>

            {error && <div className="text-red-500 mt-2">{error}</div>}
            <button className="mt-6 bg-violet-600 hover:bg-violet-700 text-white py-2 px-4 rounded">
              Save Settings
            </button>
          </form>
          {showModal && <Modal show={showModal} message="Settings saved!" />}
        </div>
      )}
    </div>
  );
};

export default SettingsForm;
