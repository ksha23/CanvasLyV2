import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Link, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

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
          {/* <Link to="/">
            <img
              className="h-8"
              src={`${process.env.PUBLIC_URL}/canvasly.svg`}
              alt="CanvasLy Logo"
            />
          </Link> */}
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
                className={`text-black text-s md:text-base dark:text-white ${isActiveLink(
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
          {!auth.isAuthenticated && <Link to="/login">Login</Link>}
          {auth.isAuthenticated && (
            <>
              <img className="h-8 w-8 rounded-full" src={auth.me.avatar} alt="User Avatar" />
              <a href="#" onClick={onLogOut}>
                Log out
              </a>
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
