import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import { compose } from 'redux';
import { connect } from 'react-redux';

import { GOOGLE_AUTH_LINK } from '../../constants';
// import { useGoogleLogin } from '@react-oauth/google';

let googleAuthLink;
if (process.env.NODE_ENV === 'development') {
  googleAuthLink = GOOGLE_AUTH_LINK;
} else {
  googleAuthLink = '/auth/google';
}

const Login = ({ auth, history }) => {
  if (auth.isAuthenticated) return <Redirect to="/" />;

  return (
    <div className="h-screen flex justify-center dark:bg-black dark:text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 mt-20">Log in to CanvasLy</h1>
        <p className="mb-4">
          Go back to{' '}
          <a className="font-bold underline" href="/">
            Home page
          </a>
        </p>
        <a
          className="bg-gradient-to-bl from-red-500 to-red-900 px-4 py-2 text-white rounded flex items-center justify-center"
          href={googleAuthLink}
        >
          <i className="fa fa-google fa-fw mr-2" />
          <span>Sign in with Google</span>
        </a>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default compose(withRouter, connect(mapStateToProps))(Login);
