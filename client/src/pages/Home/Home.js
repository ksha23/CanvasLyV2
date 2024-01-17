import React, { useState, useLayoutEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import YoutubeComponent from '../../components/YoutubeComponent/YoutubeComponent';
import './Home.css';
import Layout from '../../layout/Layout';
import HomePicture from '../../Assets/CanvaslyHome.png';
import HomePictureLight from '../../Assets/CanvaslyHomeLight.png';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import Slider from '@mui/material/Slider';

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

const Home = ({ auth }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') === 'dark');

  useLayoutEffect(() => {
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
          <div className="flex flex-col justify-center items-center text-center w-full text-black dark:text-white">
            <h1 className="text-4xl font-bold">Welcome to CanvasLy</h1>
            <Link
              className="text-zinc-700 dark:text-zinc-300 mt-4 mb-4 dark:mt-8 dark:mb-8 py-2 px-6 rounded-lg dark:shadow-[0_0_15px_theme('colors.blue.500')]"
              to="/login"
            >
              Sign in with Google to get started &rarr;
            </Link>
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-bl from-sky-400 to-indigo-800 inline-block text-transparent bg-clip-text">
              Why CanvasLy?
            </h2>
            <ul className="text-left list-disc ml-6 dark:text-zinc-300 why-canvasly-list">
              <li>Effortlessly manage upcoming assignments, quizzes, projects, and exams</li>
              <li>
                Personalize prioritization of assignments based on due date, difficulty, and type
              </li>
              <li>Never miss another assignment again!</li>
            </ul>

            <h2 className="mt-8 text-2xl font-bold mb-4 bg-gradient-to-tl from-sky-400 to-indigo-800 inline-block text-transparent bg-clip-text">
              Intuitive UI
            </h2>
            <div className="w-full max-w-4xl mb-5">
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
            <div className="w-full max-w-4xl mb-8">
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

            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-br from-sky-400 to-indigo-800 inline-block text-transparent bg-clip-text">
              How to Get Started:
            </h2>
            <ol className="text-left list-decimal ml-6 dark:text-zinc-300">
              <li>Access "Canvas Calendar" in the Canvas side menu</li>
              <li>Locate "Calendar Feed" and copy the URL</li>
              <li>Open Google Calendar and select "+ Other Calendars" then "From URL"</li>
              <li>Paste the URL and click "Add Calendar"</li>
              <li>Sign in to CanvasLy using your Google account</li>
              <li>Choose the imported Canvas calendar to display assignments</li>
              <li>You're all set!</li>
            </ol>
            <div className="mt-8 video-container">
              <YoutubeComponent videoId="5tayaNGT-F4" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col flex-grow dark:bg-black dark:text-white w-full">
              <h1 className="text-4xl font-bold mb-4 text-center">Welcome, {auth.me.name}</h1>
              <div className="flex-grow max-w-3xl mx-auto text-center">
                <div>
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-br from-sky-400 to-indigo-900 inline-block text-transparent bg-clip-text">
                    Need Help Getting Started?
                  </h2>
                  <ol className="text-left list-decimal ml-6 dark:text-zinc-300">
                    <li>Access "Canvas Calendar" in the Canvas side menu</li>
                    <li>Locate "Calendar Feed" and copy the URL</li>
                    <li>Open Google Calendar and select "+ Other Calendars" then "From URL"</li>
                    <li>Paste the URL and click "Add Calendar"</li>
                    <li>Sign in to CanvasLy using your Google account</li>
                    <li>Choose the imported Canvas calendar to display assignments</li>
                    <li>You're all set!</li>
                  </ol>

                  <div className="mt-8">
                    <div className="video-container">
                      <YoutubeComponent videoId="5tayaNGT-F4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps))(Home);
