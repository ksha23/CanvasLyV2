import React, { useState, useLayoutEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import DateTime from '../../components/DateTime';
import { GOOGLE_AUTH_LINK } from '../../constants';
import Weather from '../../components/Weather';

import { getCanvasAssignments } from '../../store/actions/canvasActions';
import { getProfile } from '../../store/actions/userActions';
import Layout from '../../layout/Layout';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Loader from '../../components/Loader/Loader';
import { getAssignments, refreshAssignments } from '../../store/actions/assignmentActions';

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

const Home = ({
  auth,
  assignment,
  canvas,
  profile,
  getAssignments,
  getCanvasAssignments,
  refreshAssignments,
  getProfile,
}) => {
  let googleAuthLink;
  if (process.env.NODE_ENV === 'development') {
    googleAuthLink = GOOGLE_AUTH_LINK;
  } else {
    googleAuthLink = '/auth/google';
  }
  const [theme, setTheme] = useState(localStorage.getItem('theme') === 'dark');

  useLayoutEffect(() => {
    if (auth.isAuthenticated) {
      if (assignment.assignments.length === 0) getAssignments();
      else refreshAssignments();
      if (canvas.assignments.length === 0) getCanvasAssignments();
      if (!profile || !profile.id) {
        getProfile(auth.me.id);
      }
    }

    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
  }, []);

  window.addEventListener('themeChange', handleThemeChange);

  function handleThemeChange() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
  }

  return (
    <Layout>
      <>
        {!auth.isAuthenticated ? (
          <div className="flex flex-col justify-center items-center w-full text-zinc-700 dark:text-zinc-300 text-center px-2 pt-5 md:pt-0">
            <div className="w-full">
              <h1 className="text-4xl md:text-5xl mb-4 font-bold">
                Never doubt what to do next again
              </h1>
              <h2 className="text-xl md:text-2xl mb-10">
                CanvasLy helps you prioritize your assignments
              </h2>
              <a
                className="mb-6 py-3 px-6 text-base rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                href={googleAuthLink}
              >
                Sign in to get started &rarr;
              </a>
            </div>
            <div className="py-16 w-full max-w-5xl text-left">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-bl from-sky-400 to-indigo-800 inline-block text-transparent bg-clip-text">
                Why CanvasLy?
              </h2>
              <ul className="text-left list-disc ml-6 dark:text-zinc-300 why-canvasly-list">
                <li className="text-lg">
                  Effortlessly manage upcoming assignments, quizzes, projects, and exams
                </li>
                <li className="text-lg">
                  Personalize prioritization of assignments based on due date, difficulty, and type
                </li>
                <li className="text-lg">Never miss another assignment again!</li>
                <li className="text-lg">It's totally free!</li>
              </ul>
            </div>
            <div className="w-full max-w-5xl mb-5">
              <div className="p-5 bg-gradient-to-bl from-slate-200 dark:from-slate-900 to-zinc-50 dark:to-zinc-800 rounded-md text-left">
                <div className="flex justify-between items-center space-x-2 mb-2 w-full">
                  <h3 className="text-xl md:text-2xl font-bold">Problem Set 1</h3>
                  <div className="flex">
                    <button className="px-4 bg-gradient-to-bl from-emerald-500 to-lime-700 font-semibold text-white rounded-md py-1 ml-2">
                      ✓
                    </button>
                    {/* <button className="px-4 ml-2 px-4 bg-gradient-to-bl from-rose-500 to-red-700 text-white rounded-md py-1 font-bold">
                        ✕
                      </button> */}
                  </div>
                </div>
                <div className="flex justify-start space-x-2 items-center">
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z" />
                  </svg>
                  <p className="w-full text-sm md:text-lg text-left">
                    Mon, Jan 21, 2030, 12:00 AM UTC
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <select
                    name="type"
                    className="w-1/2 rounded-md bg-transparent border-zinc-300 dark:border-zinc-700 dark:text-zinc-300"
                  >
                    <option value="Assignment">Assignment</option>
                  </select>
                  <div className="w-1/2 ml-8 mr-4">
                    <div className="text-blue-600">
                      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
                        <div className="w-full">
                          <Slider
                            name="difficulty"
                            className="text-blue-600"
                            value={3}
                            step={1}
                            marks={marks}
                            min={1}
                            max={5}
                            valueLabelDisplay="off"
                          />
                        </div>
                      </ThemeProvider>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold">Reminders:</p>
                  <div className="flex items-center w-full space-x-2 mb-1">
                    <p className="text-2xl font-bold">•</p>
                    <div className="px-2 py-1 w-full rounded-md border bg-transparent dark:bg-transparent border-zinc-300 dark:border-zinc-700">
                      Review question 3
                    </div>
                    <button type="button">ⓧ</button>
                  </div>
                  <button
                    className="text-xs underline text-zinc-400 dark:text-zinc-500"
                    type="button"
                  >
                    Add Reminder
                  </button>
                </div>
              </div>
              {/* <button className="mt-2 px-4 mr-2 bg-gradient-to-bl from-emerald-500 to-lime-700 text-white rounded-md py-2">
                    Update
                  </button>
                  <button className="mt-2 px-4 mr-4 bg-gradient-to-bl from-rose-500 to-red-700 text-white rounded-md py-2">
                    Undo
                  </button> */}
            </div>
            <div className="w-full max-w-5xl mb-5">
              <div className="p-5 bg-gradient-to-bl from-slate-200 dark:from-slate-900 to-zinc-50 dark:to-zinc-800 rounded-md text-left border-2 border-sky-600 dark:border-sky-700">
                <div className="flex justify-between items-center space-x-2 mb-2 w-full">
                  <h3 className="text-xl md:text-2xl font-bold">Quiz 1</h3>
                  <div className="flex">
                    <button className="px-4 bg-gradient-to-bl from-emerald-500 to-lime-700 font-semibold text-white rounded-md py-1 ml-2">
                      ✓
                    </button>
                    {/* <button className="px-4 ml-2 px-4 bg-gradient-to-bl from-rose-500 to-red-700 text-white rounded-md py-1 font-bold">
                        ✕
                      </button> */}
                  </div>
                </div>
                <div className="flex justify-start space-x-2 items-center">
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z" />
                  </svg>
                  <p className="w-full text-sm md:text-lg text-left">
                    Mon, Jan 24, 2030, 12:00 AM UTC
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <select
                    name="type"
                    className="w-1/2 rounded-md bg-transparent border-zinc-300 dark:border-zinc-700 dark:text-zinc-300"
                  >
                    <option value="Quiz">Quiz</option>
                  </select>
                  <div className="w-1/2 ml-8 mr-4">
                    <div className="text-blue-600">
                      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
                        <div className="w-full">
                          <Slider
                            name="difficulty"
                            className="text-blue-600"
                            value={4}
                            step={1}
                            marks={marks}
                            min={1}
                            max={5}
                            valueLabelDisplay="off"
                          />
                        </div>
                      </ThemeProvider>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold">Reminders:</p>
                  <div className="flex items-center w-full space-x-2 mb-1">
                    <p className="text-2xl font-bold">•</p>
                    <div className="px-2 py-1 w-full rounded-md border bg-transparent dark:bg-transparent border-zinc-300 dark:border-zinc-700">
                      Research more ways of solving Lagrange multipliers
                    </div>
                    <button type="button">ⓧ</button>
                  </div>
                  <button
                    className="text-xs underline text-zinc-400 dark:text-zinc-500"
                    type="button"
                  >
                    Add Reminder
                  </button>
                </div>
                <button className="mt-2 px-4 mr-2 bg-gradient-to-bl from-emerald-500 to-lime-700 text-white rounded-md py-2">
                  Update
                </button>
                <button className="mt-2 px-4 mr-4 bg-gradient-to-bl from-rose-500 to-red-700 text-white rounded-md py-2">
                  Undo
                </button>
              </div>
            </div>
            <div className="w-full max-w-5xl">
              <div className="p-5 bg-zinc-100 dark:bg-zinc-900 rounded-md text-left text-zinc-300 dark:text-zinc-700">
                <div className="flex justify-between items-center space-x-2 mb-2 w-full">
                  <h3 className="text-xl md:text-2xl font-bold">Completed Assignment</h3>
                  <div className="flex">
                    <button className="px-4 bg-gradient-to-bl from-emerald-500 to-lime-700 font-semibold text-white rounded-md py-1 ml-2">
                      ⇧
                    </button>
                    <button className="px-4 ml-2 bg-gradient-to-bl from-rose-500 to-red-700 text-white rounded-md py-1 font-bold">
                      ✕
                    </button>
                  </div>
                </div>
                <div className="flex justify-start space-x-2 items-center">
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z" />
                  </svg>
                  <p className="w-full text-sm md:text-lg text-left">
                    Mon, Jan 20, 2030, 12:00 AM UTC
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <select
                    name="type"
                    className="w-1/2 rounded-md bg-transparent border-zinc-300 dark:border-zinc-700 dark:text-zinc-700"
                  >
                    <option value="Assignment">Assignment</option>
                  </select>
                  <div className="w-1/2 ml-8 mr-4">
                    <div className="text-blue-600">
                      <ThemeProvider theme={theme === 'dark' ? lightTheme : darkTheme}>
                        <div className="w-full">
                          <Slider
                            name="difficulty"
                            className="text-zinc-300 dark:text-zinc-700"
                            disabled={true}
                            value={3}
                            step={1}
                            marks={marks}
                            min={1}
                            max={5}
                            valueLabelDisplay="off"
                          />
                        </div>
                      </ThemeProvider>
                    </div>
                  </div>
                </div>
                <div>
                  <button className="text-xs text-zinc-300 dark:text-zinc-700" type="button">
                    Add Reminder
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full max-w-5xl py-16 text-left">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-br from-sky-400 to-indigo-800 inline-block text-transparent bg-clip-text">
                How to Get Started:
              </h2>
              <ol className="text-left list-decimal ml-6 dark:text-zinc-300">
                <li className="text-lg">Go to the Profile page</li>
                <li className="text-lg">
                  Upload your organization's Canvas API URL (This usually is your regular Canvas URL
                  with /api/v1 at the end)
                </li>
                <li className="text-lg">Navigate to your organization's Canvas site</li>
                <li className="text-lg">Go to Account and then Settings</li>
                <li className="text-lg">
                  Click "+ New Access Token" and give it a name. Copy the token.
                </li>
                <li className="text-lg">Paste the access token into the Profile page and upload</li>
                <li className="text-lg">You're all set!</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full text-zinc-700 dark:text-zinc-300 text-center px-2">
            <h1 className="text-4xl font-bold mb-2 text-center light:text-black dark:text-white">
              Welcome, {auth.me.name}
            </h1>
            <div className="flex flex-col items-center justify-center w-full space-y-5">
              <DateTime />
              <Weather />
            </div>

            <div className="flex flex-col items-center justify-center w-full mb-10">
              {/*Display details of first assignment*/}
              <>
                {assignment.error && <p className="text-red-600">{assignment?.error}</p>}
                {assignment.isLoading ? (
                  <div className="flex space-y-8 flex-col justify-center w-full py-5">
                    <Loader width={140} height={140} />
                    <p className="text-xl font-semibold">Loading calendar assignments</p>
                  </div>
                ) : (
                  assignment.firstAssignment && (
                    <>
                      <h1 className="text-2xl font-bold mb-2 mt-5 bg-gradient-to-tl from-sky-400 to-indigo-800 inline-block text-transparent bg-clip-text">
                        Next Calendar Event:
                      </h1>
                      <div className="flex justify-center w-full max-w-xl text-left flex-col px-6 py-4 bg-gradient-to-bl from-slate-200 dark:from-slate-900 to-zinc-50 dark:to-zinc-800 rounded-md">
                        <h2 className="text-xl font-bold mb-2">
                          {assignment.firstAssignment.name}
                        </h2>
                        <h2 className="text-base">
                          <strong>Due: </strong>
                          {new Date(assignment.firstAssignment.dueDate).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              timeZoneName: 'short',
                              hour12: true,
                            },
                          )}
                        </h2>
                        <h2 className="text-base">
                          <strong>Type: </strong>
                          {assignment.firstAssignment.type}
                        </h2>
                        <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
                          <div className="w-full px-4 pt-2">
                            <Slider
                              disabled={true}
                              className="text-blue-600"
                              value={assignment.firstAssignment.difficulty}
                              step={1}
                              marks={marks}
                              min={1}
                              max={5}
                              valueLabelDisplay="off"
                            />
                          </div>
                        </ThemeProvider>
                      </div>
                    </>
                  )
                )}
              </>
            </div>
            <div className="flex flex-col items-center justify-center w-full max-w-xl">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-br from-sky-400 to-indigo-800 inline-block text-transparent bg-clip-text">
                Need Help Getting Started?
              </h2>
              <ol className="text-left list-decimal ml-6 dark:text-zinc-300">
                <li className="text-base">Go to the Profile page</li>
                <li className="text-base">
                  Upload your organization's Canvas API URL (This usually is your regular Canvas URL
                  with /api/v1 at the end)
                </li>
                <li className="text-base">Navigate to your organization's Canvas site</li>
                <li className="text-base">Go to Account and then Settings</li>
                <li className="text-base">
                  Click "+ New Access Token" and give it a name. Copy the token.
                </li>
                <li className="text-base">
                  Paste the access token into the Profile page and upload
                </li>
                <li className="text-base">You're all set!</li>
              </ol>
            </div>
          </div>
        )}
      </>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  assignment: state.assignment,
  canvas: state.canvas,
  profile: state.user.profile,
});

export default compose(
  connect(mapStateToProps, {
    getAssignments,
    getCanvasAssignments,
    refreshAssignments,
    getProfile,
  }),
)(Home);
