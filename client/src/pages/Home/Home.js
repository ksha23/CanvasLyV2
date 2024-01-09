import React from 'react';
import { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Youtube from 'react-youtube';
import Layout from '../../layout/Layout';
import MessageList from '../../components/MessageList/MessageList';
import MessageForm from '../../components/MessageForm/MessageForm';
import { reseedDatabase } from '../../store/actions/authActions';

import './styles.css';

// const ReseedMessage = ({ handleReseed }) => {
//   return (
//     <div>
//       <span style={{ marginRight: '10px' }}>
//         If the app has been vandalized just reseed the database by clicking this button
//       </span>
//       <button onClick={handleReseed} className="btn reseed-btn">
//         Reseed Database
//       </button>
//     </div>
//   );
// };

const Home = ({ auth, reseedDatabase }) => {
  // const handleReseed = () => {
  //   reseedDatabase();
  // };

  return (
    <Layout>
      <div className="home-page">
        {!auth.isAuthenticated ? (
          <div>
            <div className="flex flex-col dark:bg-black dark:text-white min-h-screen">
              <div className="flex-grow max-w-3xl mx-auto text-center p-10 pt-5">
                <h1 className="text-4xl font-bold mb-4 text-purple-600">Welcome to CanvasLy</h1>
                <p>
                  Login in with Google to get started:{' '}
                  <Link className="bold" to="/login">
                    Log in
                  </Link>{' '}
                  {/* or{' '} */}
                  {/* <Link className="bold" to="/register">
                Register
              </Link> */}
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
                      <Youtube videoId="5tayaNGT-F4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* <ReseedMessage handleReseed={handleReseed} /> */}
            {/* <MessageForm /> */}
            <div className="flex flex-col dark:bg-black dark:text-white min-h-screen">
              <h1 className="text-4xl font-bold mb-4 text-purple-600">Welcome, {auth.me.name}</h1>
              <div className="flex-grow max-w-3xl mx-auto text-center p-10 pt-5">
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
                      <Youtube videoId="5tayaNGT-F4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {/* <MessageList /> */}
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { reseedDatabase }))(Home);
