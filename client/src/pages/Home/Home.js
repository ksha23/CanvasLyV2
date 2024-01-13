import React from 'react';
// import { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import Cookies from 'js-cookie';

import YoutubeComponent from '../../components/YoutubeComponent/YoutubeComponent';
import './Home.css';
import Layout from '../../layout/Layout';

const Home = ({ auth }) => {
  // const [cookies, setCookie, removeCookie] = useCookies(['x-auth-cookie']);

  // const handleReseed = () => {
  //   reseedDatabase();
  // };

  // for mobile (testing)
  // useEffect(() => {
  //   // grab the code from the URL
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get('code');
  //   // clear the code from the URL
  //   window.history.replaceState({}, null, '/');

  //   if (code && !auth.isAuthenticated && code !== 'undefined') {
  //     // exchange the code for a token
  //     exchangeCodeForToken(code);
  //   }
  // }, []);

  // for mobile (testing)
  // const exchangeCodeForToken = async (code) => {
  //   console.log('in exchangeCodeForToken');
  //   const response = await fetch(`https://localhost:4000/auth/google/authcode`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ code: code }),
  //   });

  //   const jwt = await response.json();

  //   // store the token in cookies

  //   Cookies.set('x-auth-cookie', jwt.token, { expires: 1 });
  //   // reload the page
  //   window.location.href = '/';
  // };

  return (
    <Layout>
      <>
        {!auth.isAuthenticated ? (
          <div>
            <div className="flex flex-col dark:bg-black dark:text-white">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to CanvasLy</h1>
                <p className="mb-5">
                  Login in with Google to get started:{' '}
                  <Link className="bold" to="/login">
                    Log in
                  </Link>
                </p>
                {/* <ReseedMessage handleReseed={handleReseed} /> */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-4 text-purple-600">Why Choose CanvasLy?</h2>
                  <ul className="text-left list-disc ml-6 dark:text-slate-300 why-canvasly-list">
                    <li>Effortlessly manage upcoming assignments, quizzes, projects, and exams</li>
                    <li>
                      Personalize prioritization of assignments based on due date, difficulty, and
                      type
                    </li>
                    <li>Never miss another assignment again!</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4 text-purple-600">How to Get Started:</h2>
                  <ol className="text-left list-decimal ml-6 dark:text-slate-300">
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
                  <h2 className="text-2xl font-bold mb-4 text-purple-600">
                    Need Help Getting Started?
                  </h2>
                  <ol className="text-left list-decimal ml-6 dark:text-slate-300">
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
