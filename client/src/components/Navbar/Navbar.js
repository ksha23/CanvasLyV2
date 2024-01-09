import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { logOutUser } from '../../store/actions/authActions';
import './styles.css';

const Navbar = ({ auth, logOutUser, history }) => {
  const onLogOut = (event) => {
    event.preventDefault();
    logOutUser(history);
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <img className="logo" src={`${process.env.PUBLIC_URL}/canvasly.svg`} />
      </Link>
      <ul className="nav-links flex-1">
        {/* <li className="nav-item">
          <Link to="/">Home</Link>
        </li> */}
        {auth.isAuthenticated ? (
          <>
            <li className="nav-item">
              <Link to="/assignments">Assignments</Link>
            </li>
            <li className="nav-item">
              <Link to={`/${auth.me.username}`}>Profile</Link>
            </li>
            {auth.me?.role === 'ADMIN' && (
              <li className="nav-item">
                <Link to="/users">Users</Link>
              </li>
            )}
            {auth.me?.role === 'ADMIN' && (
              <li className="nav-item">
                <Link to="/admin">Admin</Link>
              </li>
            )}
            <li className="flex-1" />
            <img className="avatar" src={auth.me.avatar} />
            <li className="logout-btn" onClick={onLogOut}>
              <a href="#">Log out</a>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <p>
                <strong>CanvasLy</strong>
              </p>
            </li>
            <li className="flex-1" />

            <li className="nav-item">
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(withRouter, connect(mapStateToProps, { logOutUser }))(Navbar);
