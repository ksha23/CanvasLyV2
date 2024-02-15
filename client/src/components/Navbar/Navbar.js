import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Link, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
import { GOOGLE_AUTH_LINK } from '../../constants';

import { logOutUser } from '../../store/actions/authActions';

const Navbar = ({ auth, logOutUser, history }) => {
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
    return location.pathname === pathname ? 'font-bold text-blue-700 dark:text-blue-400' : '';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white text-zinc-600 px-6 py-4 dark:text-zinc-300 dark:bg-slate-950 hidden md:block">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link className="flex items-center" to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              zoomAndPan="magnify"
              viewBox="0 0 375 374.999991"
              height="30"
              preserveAspectRatio="xMidYMid meet"
              version="1.0"
            >
              <defs>
                <clipPath id="313c65f1bc">
                  <path
                    d="M 5.195312 5.195312 L 369.804688 5.195312 L 369.804688 369.804688 L 5.195312 369.804688 Z M 5.195312 5.195312 "
                    clipRule="nonzero"
                  />
                </clipPath>
                <clipPath id="0c3abcd63a">
                  <path d="M 60 60 L 315 60 L 315 315 L 60 315 Z M 60 60 " clipRule="nonzero" />
                </clipPath>
                <clipPath id="80c1c206e5">
                  <path
                    d="M 29.472656 94.910156 L 279.945312 29.507812 L 345.347656 279.980469 L 94.875 345.382812 Z M 29.472656 94.910156 "
                    clipRule="nonzero"
                  />
                </clipPath>
                <clipPath id="e9f0f854a7">
                  <path
                    d="M 29.472656 94.910156 L 279.945312 29.507812 L 345.347656 279.980469 L 94.875 345.382812 Z M 29.472656 94.910156 "
                    clipRule="nonzero"
                  />
                </clipPath>
              </defs>
              <g clipPath="url(#313c65f1bc)">
                <path
                  fill="#2563eb"
                  d="M 187.5 57.480469 C 259.261719 57.480469 317.519531 115.738281 317.519531 187.5 C 317.519531 259.257812 259.261719 317.519531 187.5 317.519531 C 115.738281 317.519531 57.480469 259.261719 57.480469 187.5 C 57.480469 115.738281 115.738281 57.480469 187.5 57.480469 Z M 198.34375 5.640625 C 191.121094 5.210938 183.878906 5.210938 176.660156 5.640625 L 164.078125 34.425781 C 152.84375 36.144531 141.835938 39.09375 131.25 43.222656 L 105.957031 24.582031 C 99.488281 27.820312 93.21875 31.441406 87.179688 35.425781 L 90.675781 66.648438 C 81.808594 73.75 73.75 81.808594 66.644531 90.679688 L 35.425781 87.179688 C 31.441406 93.21875 27.820312 99.488281 24.582031 105.957031 L 43.222656 131.246094 C 39.097656 141.835938 36.144531 152.84375 34.429688 164.074219 L 5.640625 176.65625 C 5.210938 183.878906 5.210938 191.121094 5.640625 198.339844 L 34.429688 210.921875 C 36.144531 222.15625 39.097656 233.164062 43.222656 243.75 L 24.582031 269.039062 C 27.820312 275.507812 31.441406 281.78125 35.425781 287.816406 L 66.644531 284.320312 C 73.75 293.1875 81.808594 301.25 90.679688 308.351562 L 87.183594 339.574219 C 93.21875 343.558594 99.492188 347.175781 105.960938 350.414062 L 131.25 331.777344 C 141.835938 335.902344 152.84375 338.851562 164.078125 340.570312 L 176.660156 369.359375 C 183.878906 369.789062 191.121094 369.789062 198.34375 369.359375 L 210.921875 340.570312 C 222.15625 338.851562 233.164062 335.902344 243.75 331.777344 L 269.039062 350.414062 C 275.511719 347.179688 281.78125 343.558594 287.816406 339.574219 L 284.320312 308.351562 C 293.191406 301.246094 301.25 293.1875 308.355469 284.320312 L 339.574219 287.816406 C 343.558594 281.78125 347.179688 275.507812 350.414062 269.039062 L 331.777344 243.75 C 335.902344 233.164062 338.851562 222.15625 340.570312 210.921875 L 369.359375 198.339844 C 369.789062 191.121094 369.789062 183.878906 369.359375 176.65625 L 340.570312 164.078125 C 338.851562 152.84375 335.902344 141.835938 331.777344 131.25 L 350.414062 105.960938 C 347.179688 99.492188 343.558594 93.222656 339.574219 87.183594 L 308.355469 90.679688 C 301.25 81.8125 293.191406 73.753906 284.320312 66.648438 L 287.816406 35.425781 C 281.78125 31.445312 275.507812 27.824219 269.039062 24.585938 L 243.75 43.226562 C 233.164062 39.097656 222.15625 36.148438 210.921875 34.429688 Z M 198.34375 5.640625 "
                  fillOpacity="1"
                  fillRule="evenodd"
                />
              </g>
              <g clipPath="url(#0c3abcd63a)">
                <g clipPath="url(#80c1c206e5)">
                  <g clipPath="url(#e9f0f854a7)">
                    <path
                      fill="#2563eb"
                      d="M 164.160156 98.128906 C 213.484375 85.246094 263.988281 114.835938 276.867188 164.160156 C 289.746094 213.484375 260.15625 263.984375 210.832031 276.863281 C 161.507812 289.746094 111.007812 260.15625 98.125 210.832031 C 85.246094 161.507812 114.835938 111.007812 164.160156 98.128906 Z M 162.308594 60.550781 C 157.269531 61.550781 152.292969 62.847656 147.40625 64.441406 L 143.921875 86.484375 C 136.511719 89.683594 129.472656 93.6875 122.9375 98.421875 L 102.210938 90.152344 C 98.34375 93.539062 94.683594 97.152344 91.25 100.972656 L 99.253906 121.804688 C 94.433594 128.28125 90.34375 135.265625 87.050781 142.636719 L 64.964844 145.835938 C 63.308594 150.703125 61.945312 155.660156 60.882812 160.6875 L 78.234375 174.726562 C 77.296875 182.742188 77.242188 190.839844 78.078125 198.867188 L 60.550781 212.683594 C 61.550781 217.726562 62.847656 222.699219 64.441406 227.585938 L 86.488281 231.070312 C 89.683594 238.480469 93.6875 245.519531 98.425781 252.054688 L 90.152344 272.78125 C 93.539062 276.648438 97.152344 280.308594 100.972656 283.742188 L 121.804688 275.738281 C 128.28125 280.554688 135.265625 284.648438 142.636719 287.941406 L 145.835938 310.027344 C 150.703125 311.683594 155.664062 313.042969 160.691406 314.109375 L 174.726562 296.757812 C 182.742188 297.695312 190.839844 297.75 198.871094 296.914062 L 212.683594 314.441406 C 217.726562 313.441406 222.703125 312.140625 227.589844 310.550781 L 231.070312 288.503906 C 238.480469 285.308594 245.519531 281.304688 252.054688 276.566406 L 272.78125 284.839844 C 276.648438 281.453125 280.308594 277.839844 283.742188 274.019531 L 275.738281 253.1875 C 280.558594 246.710938 284.648438 239.726562 287.941406 232.355469 L 310.027344 229.15625 C 311.683594 224.289062 313.046875 219.328125 314.109375 214.300781 L 296.757812 200.265625 C 297.695312 192.25 297.75 184.152344 296.914062 176.121094 L 314.441406 162.308594 C 313.441406 157.265625 312.144531 152.289062 310.550781 147.40625 L 288.503906 143.925781 C 285.308594 136.511719 281.304688 129.476562 276.566406 122.9375 L 284.839844 102.210938 C 281.453125 98.34375 277.839844 94.6875 274.019531 91.25 L 253.1875 99.257812 C 246.710938 94.4375 239.726562 90.34375 232.355469 87.050781 L 229.15625 64.964844 C 224.289062 63.3125 219.332031 61.949219 214.304688 60.882812 L 200.265625 78.234375 C 192.25 77.296875 184.152344 77.246094 176.125 78.078125 Z M 162.308594 60.550781 "
                      fillOpacity="1"
                      fillRule="evenodd"
                    />
                  </g>
                </g>
              </g>
            </svg>
            <p className={`hidden md:block font-semibold text-xl ml-2 ${isActiveLink('/')}`}>
              CanvasLy
            </p>
            {!auth.isAuthenticated && <p className="ml-2 font-semibold md:hidden">CanvasLy</p>}
          </Link>

          {auth.isAuthenticated && (
            <>
              <Link
                to="/calendar"
                className={`ml-6 text-s md:text-base ${isActiveLink('/calendar')}`}
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-1"
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
                  <p className="hidden md:block">Calendar</p>
                </div>
              </Link>
              <Link className={`ml-6 text-s md:text-base ${isActiveLink('/canvas')}`} to="/canvas">
                <div className="flex items-center">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 1920 1920"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1 w-4 h-4"
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
                  <p className="hidden md:block">Canvas</p>
                </div>
              </Link>
              <Link
                to={`/${auth.me.id}`}
                className={`ml-6 text-s md:text-base ${isActiveLink(`/${auth.me.id}`)}`}
              >
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 16"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
                  </svg>
                  <p className="hidden md:block">Profile</p>
                </div>
              </Link>

              {auth.me?.role === 'ADMIN' && (
                <>
                  <Link className={`ml-6 hidden md:block ${isActiveLink('/users')}`} to="/users">
                    <div className="flex items-center">
                      <svg
                        className="flex w-4 h-4 mr-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 18"
                      >
                        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                      </svg>
                      Users
                    </div>
                  </Link>
                  <Link className={`ml-6 hidden md:block ${isActiveLink('/admin')}`} to="/admin">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2"
                        />
                      </svg>
                      Admin
                    </div>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <DarkModeToggle />
          {!auth.isAuthenticated && <a href={googleAuthLink}>Sign in</a>}
          {auth.isAuthenticated && (
            <>
              <Link to={`/${auth.me.id}`} className="flex items-center space-x-3 m-0">
                <img className="h-7 w-7 rounded-full" src={auth.me.avatar} alt="User Avatar" />
              </Link>
              <button onClick={onLogOut}>Log out</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(withRouter, connect(mapStateToProps, { logOutUser }))(Navbar);
