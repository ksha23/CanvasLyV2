import { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { completeAssignment } from '../redux/actions/assignmentListActions';
import { updateAssignmentDifficulty } from '../redux/actions/assignmentListActions';
import { updateAssignmentType } from '../redux/actions/assignmentListActions';

import { deleteAssignmentReminderAction } from '../redux/actions/assignmentListActions';
import { addAssignmentReminderAction } from '../redux/actions/assignmentListActions';
import { updateAssignmentReminderArray } from '../redux/actions/assignmentListActions';
import TextAreaAutoSize from 'react-textarea-autosize';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import applyTheme from '../utils/colorThemeHandler';

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

const EventComponent = ({
  id,
  name,
  dateTime,
  difficulty,
  type,
  reminders,
  onUpdateDifficultyAndType,
}) => {
  const dispatch = useDispatch();
  const formattedDateTime = new Date(dateTime);

  // ----------------------- State Variables ---------------------------

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

  // used to determine if the event is edited (add border if edited)
  const [edited, setEdited] = useState(false);
  // used to determine if we should show the add reminder input
  const [showAddReminder, setShowAddReminder] = useState(false);

  // used to keep track of the difficulty and type of the event that is not necessarily in redux or db (for undoing changes)
  const [theType, setType] = useState(type);
  const [theDifficulty, setDifficulty] = useState(difficulty);

  // used to keep track of reminders that are not in redux or db (for ongoing changes)
  const [editedReminderIndex, setEditedIndex] = useState(null);
  const [newReminderText, setNewReminderText] = useState('');
  if (reminders === undefined) {
    reminders = [];
  }
  const [editedReminders, setEditedReminders] = useState([...reminders]);

  function formatFriendlyDateTime(dateTimeString) {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    };

    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString(undefined, options);
  }

  // ----------------------- Updating Difficulty and Type ---------------------------

  // update assignment difficulty in redux and db
  const changeAssignmentDifficultyDB = async (id, difficulty) => {
    await dispatch(updateAssignmentDifficulty(id, difficulty));
    await handleEdited(id, assignment.difficulty, type);
  };
  // update assignment type in redux and db
  const changeAssignmentTypeDB = async (id, type) => {
    await dispatch(updateAssignmentType(id, type));
    await handleEdited(id, assignment.difficulty, type);
  };
  // update assignment difficulty and type in redux and db
  const changeAssignmentDifficultyAndTypeDB = async (id, difficulty, type) => {
    await dispatch(updateAssignmentDifficulty(id, difficulty));
    await dispatch(updateAssignmentType(id, type));
    await handleEdited(id, difficulty, type);
  };

  // ----------------------- Completing an Assignment ---------------------------

  // complete an assignment in redux and db
  const completeDB = (id) => {
    dispatch(completeAssignment(id));
  };

  // ------------------------ Updating, Removing, Adding Reminders in REDUX AND DB --------------------------

  const updateReminder = (index) => {
    const updatedReminders = [...reminders];
    updatedReminders[index] = editedReminders[index];
    setEditedIndex(null);

    dispatch(updateAssignmentReminderArray(id, updatedReminders));
  };
  const removeReminder = async (reminderIndex) => {
    const updatedReminders = [...editedReminders];
    updatedReminders.splice(reminderIndex, 1);
    setEditedReminders(updatedReminders);

    dispatch(deleteAssignmentReminderAction(id, reminderIndex));
  };
  const addReminder = async () => {
    const updatedReminders = [...editedReminders];
    updatedReminders.push(newReminderText);
    setEditedReminders(updatedReminders);
    setNewReminderText('');
    setShowAddReminder(false);

    dispatch(addAssignmentReminderAction(id, newReminderText));
  };

  // ------------------------ Helper Functions --------------------------

  const extractContentInBrackets = (str) => {
    const matches = str.match(/\[(.*?)\]/);
    return matches ? matches[1] : '';
  };
  const formatDate = (date) => {
    if (Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date)) {
      return formatFriendlyDateTime(date.toString());
    } else {
      return 'Invalid Date';
    }
  };

  // ------------------------- Event Handlers -------------------------

  const handleUpdateButtonClick = async (id, difficulty, type) => {
    if (assignment.difficulty != difficulty && assignment.type != type) {
      await changeAssignmentDifficultyAndTypeDB(id, difficulty, type);
    } else if (assignment.difficulty != difficulty) {
      await changeAssignmentDifficultyDB(id, difficulty);
    } else if (assignment.assignmentType != type) {
      await changeAssignmentTypeDB(id, type);
    }
  };
  const handleEdited = async (id, difficulty, type) => {
    if (assignment.type == type && assignment.difficulty == difficulty) {
      await setEdited(false);
      onUpdateDifficultyAndType(false, id, difficulty, type);
    } else {
      await setEdited(true);
      onUpdateDifficultyAndType(true, id, difficulty, type);
    }
    setType(type);
    setDifficulty(difficulty);
  };
  const handleEditReminder = (index, value) => {
    const updatedReminders = [...editedReminders];
    updatedReminders[index] = value;
    setEditedReminders(updatedReminders);
  };

  // ------------------------ Undoing Changes --------------------------

  const undoAllChanges = async () => {
    await setEdited(false);
    await setType(assignment.type);
    await setDifficulty(assignment.difficulty);
    onUpdateDifficultyAndType(false, id, assignment.difficulty, assignment.type);
  };

  let assignments = useSelector((state) => state.assignmentsListReducer);
  let assignment = assignments.find((assignment) => assignment._id === id);
  const extractedContent = extractContentInBrackets(name);
  const displayName = extractedContent ? `${extractedContent}: ` : '';

  // ------------------------- Render -------------------------

  useEffect(() => {
    if (!localStorage.theme || localStorage.theme === '') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColorTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  return (
    <div
      /* Determines if we need edited border or not */
      className={`mb-5 ${edited ? 'border-2 border-red-500 rounded-lg' : ''}`}
    >
      <div
        className={
          formattedDateTime < new Date()
            ? 'bg-rose-600 rounded-tl-md rounded-tr-md text-white'
            : formattedDateTime.toDateString() === new Date().toDateString()
            ? 'bg-yellow-600 rounded-tl-md rounded-tr-md text-white'
            : 'bg-violet-600 rounded-tl-md rounded-tr-md text-white'
        }
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold py-2 px-4">
            {displayName}
            <span>{name.replace(/\[.*?\]/, '')}</span>
          </h3>
          {/* Complete Button */}
          <button
            className="bg-green-600 text-white px-3 py-1 rounded-md m-2 mr-4 text-sm"
            onClick={() => completeDB(id)}
          >
            Done
          </button>
        </div>
      </div>

      {/* Assignment Details */}
      <div className="p-4 bg-zinc-100 rounded-bl-md rounded-br-md dark:bg-zinc-800">
        {/* Due Date */}
        <p className="text-md">
          <span className="font-semibold">Due: </span>
          {formatDate(formattedDateTime)}{' '}
        </p>

        {/* Difficulty and Type */}
        <div className="items-center p-2">
          <div className="flex justify-between">
            <ThemeProvider theme={theColorTheme === 'dark' ? darkTheme : lightTheme}>
              <Slider
                value={theDifficulty}
                onChange={(e, value) => handleEdited(id, value, theType)}
                step={1}
                marks={marks}
                min={1}
                max={5}
                valueLabelDisplay="off"
                className="ml-1 w-1/2 mt-2 text-zinc-600 mr-8 md:ml-4 dark:text-white"
              />
              <Select
                className="bg-white rounded text-sm w-1/2 mt-2 dark:text-white dark:bg-zinc-700"
                value={theType}
                onChange={(e) => {
                  handleEdited(id, theDifficulty, e.target.value);
                }}
              >
                <MenuItem value="Assignment">Assignment</MenuItem>
                <MenuItem value="Quiz">Quiz</MenuItem>
                <MenuItem value="Exam">Exam</MenuItem>
                <MenuItem value="Project">Project</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </ThemeProvider>
          </div>

          {/* Update and Undo Buttons */}
          <div>
            {edited && (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm sm: mt-4"
                onClick={() => handleUpdateButtonClick(id, theDifficulty, theType)}
              >
                Update
              </button>
            )}
            {edited && (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md ml-3 text-sm sm: mt-4"
                onClick={() => undoAllChanges()}
              >
                Undo
              </button>
            )}
          </div>
        </div>

        {/* Reminders */}
        {reminders && reminders.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold">Reminders:</p>
            <div className="list-disc ml-1">
              {reminders.map((reminder, index) => (
                <div key={index} className="flex items-center w-full">
                  {editedReminderIndex === index ? (
                    <div className="flex items-center w-full">
                      <span className="list-disc pr-2">•</span>
                      <TextAreaAutoSize
                        className="w-full px-2 text-base dark:bg-zinc-600"
                        value={editedReminders[index]}
                        onChange={(e) => handleEditReminder(index, e.target.value)}
                        autoFocus
                        onBlur={() => updateReminder(index)}
                      />
                    </div>
                  ) : (
                    <p onClick={() => setEditedIndex(index)} className="flex items-center">
                      <span className="list-disc pr-2">•</span>
                      {reminder}
                    </p>
                  )}
                  <button
                    className="text-zinc-600 ml-4 text-default dark:text-zinc-400"
                    onClick={() => removeReminder(index)}
                  >
                    ⓧ
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Reminder Input */}
        {showAddReminder ? (
          <div className="mt-4 w-full flex items-center">
            <TextAreaAutoSize
              className="text-sm w-full px-2 py-2 dark:bg-zinc-600 mr-2 rounded"
              value={newReminderText}
              onChange={(e) => setNewReminderText(e.target.value)}
              placeholder="Add a reminder..."
              autoFocus
            />
            <button
              className="text-sm bg-violet-600 text-white px-3 py-1 rounded max-h-9"
              onClick={addReminder}
            >
              Add
            </button>
          </div>
        ) : (
          <button
            className="text-sm text-zinc-500 px-2 py-2 rounded underline dark:text-zinc-400"
            onClick={() => setShowAddReminder(true)}
          >
            Add Reminder
          </button>
        )}
      </div>
    </div>
  );
};

export default EventComponent;
