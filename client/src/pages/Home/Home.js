import React, { useState, useLayoutEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import YoutubeComponent from '../../components/YoutubeComponent/YoutubeComponent';
import './Home.css';
import Layout from '../../layout/Layout';
import HomePicture from '../../Assets/CanvaslyHome.png';
import HomePictureLight from '../../Assets/CanvaslyHomeLight.png';

const Home = ({ auth }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useLayoutEffect(() => {
    if (localStorage.getItem('darkMode') === 'true') {
      setDarkMode(true);
    }
  }, []);

  window.addEventListener('themeChange', handleThemeChange);

  function handleThemeChange() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    setDarkMode(currentTheme === 'dark');
  }

  const dummyAssignment = {
    id: 1,
    name: 'Dummy Assignment',
    dueDate: '2021-04-20T23:59:00Z',
    type: 'Assignment',
    difficulty: 'Hard',
    reminders: [],
    completed: true,
  };

  return (
    <Layout>
      <>
        {!auth.isAuthenticated ? (
          <div>
            <div className="flex flex-col dark:bg-black dark:text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to CanvasLy</h1>

                <Link
                  className="font-semibold text-zinc-700 dark:text-zinc-300 py-2 px-4 rounded-lg"
                  to="/login"
                >
                  Log in with Google to get started
                </Link>
                {/* <div class="relative flex justify-center items-center w-full">
                  <div class="absolute -inset-1 bg-gradient-to-r from-red-600 to-violet-600 rounded-lg blur opacity-100"></div>
                  <div class="relative rounded-lg flex justify-center mx-auto">
                    <Link
                      className="font-semibold text-zinc-700 dark:text-black bg-zinc-200 dark:bg-white py-2 px-4 rounded-lg"
                      to="/login"
                    >
                      Log in with Google to get started
                    </Link>
                  </div>
                </div> */}

                {/* <ReseedMessage handleReseed={handleReseed} /> */}
                <div className="mt-4 mb-12">
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-bl from-sky-400 to-indigo-900 inline-block text-transparent bg-clip-text">
                    Why Choose CanvasLy?
                  </h2>
                  <ul className="text-left list-disc ml-6 dark:text-zinc-300 why-canvasly-list">
                    <li>Effortlessly manage upcoming assignments, quizzes, projects, and exams</li>
                    <li>
                      Personalize prioritization of assignments based on due date, difficulty, and
                      type
                    </li>
                    <li>Never miss another assignment again!</li>
                  </ul>
                </div>
                {darkMode && (
                  <div className="mb-12">
                    <img src={HomePicture} alt="Canvasly Home" className="mx-auto" />
                  </div>
                )}
                {!darkMode && (
                  <div className="mb-12">
                    <img
                      src={darkMode == true ? HomePicture : HomePictureLight}
                      alt="Canvasly Home"
                      className="mx-auto"
                    />
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-br from-sky-400 to-indigo-900 inline-block text-transparent bg-clip-text">
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
                  <div className="mt-8">
                    <div className="video-container">
                      <YoutubeComponent videoId="5tayaNGT-F4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col flex-grow dark:bg-black dark:text-white">
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
