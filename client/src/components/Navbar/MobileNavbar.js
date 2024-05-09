import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Link, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { GOOGLE_AUTH_LINK } from '../../constants';

import { logOutUser } from '../../store/actions/authActions';

const Navbar = ({ setter, auth, logOutUser, history }) => {
  let googleAuthLink;
  if (process.env.NODE_ENV === 'development') {
    googleAuthLink = GOOGLE_AUTH_LINK;
  } else {
    googleAuthLink = '/auth/google';
  }
  const location = useLocation();

  const onLogOut = (event) => {
    event.preventDefault();
    // this is for testing mobile
    Cookies.remove('x-auth-cookie');

    logOutUser(history);
  };

  const isActiveLink = (pathname) => {
    return location.pathname === pathname ? 'font-bold text-black dark:text-white' : '';
  };

  return (
    <div className="fixed bottom-0 bg-slate-300 dark:bg-slate-700 text-slate-600 px-6 py-4 dark:text-slate-300 md:hidden w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <Link className={`flex items-center ${isActiveLink('/')}`} to="/">
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M11.3 3.3a1 1 0 0 1 1.4 0l6 6 2 2a1 1 0 0 1-1.4 1.4l-.3-.3V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3c0 .6-.4 1-1 1H7a2 2 0 0 1-2-2v-6.6l-.3.3a1 1 0 0 1-1.4-1.4l2-2 6-6Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>

          {auth.isAuthenticated && (
            <>
              <Link
                to="/calendar"
                className={`ml-8 text-s md:text-base ${isActiveLink('/calendar')}`}
              >
                <svg
                  className="w-6 h-6 mr-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 5c.6 0 1-.4 1-1a1 1 0 1 1 2 0c0 .6.4 1 1 1h1c.6 0 1-.4 1-1a1 1 0 1 1 2 0c0 .6.4 1 1 1h1c.6 0 1-.4 1-1a1 1 0 1 1 2 0c0 .6.4 1 1 1a2 2 0 0 1 2 2v1c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V7c0-1.1.9-2 2-2ZM3 19v-7c0-.6.4-1 1-1h16c.6 0 1 .4 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6-6c0-.6-.4-1-1-1a1 1 0 1 0 0 2c.6 0 1-.4 1-1Zm2 0a1 1 0 1 1 2 0c0 .6-.4 1-1 1a1 1 0 0 1-1-1Zm6 0c0-.6-.4-1-1-1a1 1 0 1 0 0 2c.6 0 1-.4 1-1ZM7 17a1 1 0 1 1 2 0c0 .6-.4 1-1 1a1 1 0 0 1-1-1Zm6 0c0-.6-.4-1-1-1a1 1 0 1 0 0 2c.6 0 1-.4 1-1Zm2 0a1 1 0 1 1 2 0c0 .6-.4 1-1 1a1 1 0 0 1-1-1Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link className={`ml-8 text-s md:text-base ${isActiveLink('/canvas')}`} to="/canvas">
                <svg
                  fill="currentColor"
                  width="18px"
                  height="18px"
                  viewBox="0 0 1920 1920"
                  xmlns="http://www.w3.org/2000/svg"
                  className="md:mr-1"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M1468.214 0v551.145L840.27 1179.089c-31.623 31.623-49.693 74.54-49.693 119.715v395.289h395.288c45.176 0 88.093-18.07 119.716-49.694l162.633-162.633v438.206H0V0h1468.214Zm129.428 581.3c22.137-22.136 57.825-22.136 79.962 0l225.879 225.879c22.023 22.023 22.023 57.712 0 79.848l-677.638 677.637c-10.616 10.503-24.96 16.49-39.98 16.49H903.516v-282.35c0-15.02 5.986-29.364 16.49-39.867Zm-920.005 548.095H338.82v112.94h338.818v-112.94Zm225.88-225.879H338.818v112.94h564.697v-112.94Zm734.106-202.5-89.561 89.56 146.03 146.031 89.562-89.56-146.031-146.031Zm-508.228-362.197H338.82v338.818h790.576V338.82Z"
                      fillRule="evenodd"
                    />
                  </g>
                </svg>
              </Link>
              <Link
                to={`/${auth.me.id}`}
                className={`ml-8 text-s md:text-base ${isActiveLink(`/${auth.me.id}`)}`}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 16"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
                </svg>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <DarkModeToggle />
          {!auth.isAuthenticated && <a href={googleAuthLink}>Sign in</a>}
          {auth.isAuthenticated && (
            <>
              <Link to={`/${auth.me.id}`} className="flex items-center space-x-3 m-0">
                <img className="h-6 w-6 rounded-full" src={auth.me.avatar} alt="User Avatar" />
              </Link>
              <button onClick={onLogOut}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(withRouter, connect(mapStateToProps, { logOutUser }))(Navbar);
