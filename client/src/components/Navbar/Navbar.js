import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Link, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';

import { logOutUser } from '../../store/actions/authActions';

const Navbar = ({ auth, logOutUser, history }) => {
  const location = useLocation();

  const onLogOut = (event) => {
    event.preventDefault();
    // this is for testing mobile
    Cookies.remove('x-auth-cookie');

    logOutUser(history);
  };

  const isActiveLink = (pathname) => {
    return location.pathname === pathname ? 'font-bold' : '';
  };

  return (
    <nav className="bg-white text-black px-6 py-4 dark:text-white dark:bg-black">
      <div className="sticky top-0 flex items-center justify-between">
        <div className="flex space-x-4 items-center">
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="50"
              height="50"
              viewBox="0 0 50 50"
              className="fill-zinc-700 dark:fill-white h-6 w-6"
            >
              <path d="M 25 1.0507812 C 24.7825 1.0507812 24.565859 1.1197656 24.380859 1.2597656 L 1.3808594 19.210938 C 0.95085938 19.550938 0.8709375 20.179141 1.2109375 20.619141 C 1.5509375 21.049141 2.1791406 21.129062 2.6191406 20.789062 L 4 19.710938 L 4 46 C 4 46.55 4.45 47 5 47 L 19 47 L 19 29 L 31 29 L 31 47 L 45 47 C 45.55 47 46 46.55 46 46 L 46 19.710938 L 47.380859 20.789062 C 47.570859 20.929063 47.78 21 48 21 C 48.3 21 48.589063 20.869141 48.789062 20.619141 C 49.129063 20.179141 49.049141 19.550938 48.619141 19.210938 L 25.619141 1.2597656 C 25.434141 1.1197656 25.2175 1.0507812 25 1.0507812 z M 35 5 L 35 6.0507812 L 41 10.730469 L 41 5 L 35 5 z"></path>
            </svg>{' '}
          </Link>
          {auth.isAuthenticated && (
            <>
              <Link
                to="/assignments"
                className={`text-black text-s md:text-base dark:text-white ${isActiveLink(
                  '/assignments',
                )}`}
              >
                Assignments
              </Link>
              <Link
                to={`/${auth.me.username}`}
                className={`text-black text-s hidden md:block md:text-base dark:text-white ${isActiveLink(
                  `/${auth.me.username}`,
                )}`}
              >
                Profile
              </Link>
              {auth.me?.role === 'ADMIN' && (
                <>
                  <Link className="hidden md:block " to="/users">
                    Users
                  </Link>
                  <Link className="hidden md:block" to="/admin">
                    Admin
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <DarkModeToggle />
          {!auth.isAuthenticated && <Link to="/login">Log in</Link>}
          {auth.isAuthenticated && (
            <Link to={`/${auth.me.username}`} className="flex space-x-4 m-0">
              <img className="h-7 w-7 rounded-full" src={auth.me.avatar} alt="User Avatar" />
              <a href="#" onClick={onLogOut}>
                Log out
              </a>
            </Link>
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
