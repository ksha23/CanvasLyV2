import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';

// import { useFormik } from 'formik';

import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { loginUserWithEmail } from '../../store/actions/authActions';
// import { FACEBOOK_AUTH_LINK, GOOGLE_AUTH_LINK } from '../../constants';
// import { loginSchema } from './validation';
import { useGoogleLogin } from '@react-oauth/google';
import './styles.css';

const Login = ({ auth, history, loginUserWithEmail }) => {
  // const formik = useFormik({
  //   initialValues: {
  //     email: '',
  //     password: '',
  //   },
  //   validationSchema: loginSchema,
  //   onSubmit: (values) => {
  //     loginUserWithEmail(values, history);
  //   },
  // });

  const loginWithGoogle = useGoogleLogin({
    select_account: true,
    onNonOAuthError: (response) => {
      console.error('Login failed', response);
    },
    onFailure: (response) => {
      console.error('Login failed', response);
    },
    ux_mode: 'redirect',
    redirect_uri: `https://localhost:4000/auth/google/callback`,
    flow: 'auth-code',
  });
  // const loginWithGoogle = useGoogleLogin({
  //   onSuccess: async (response) => {
  //     console.log('Login succeeded with auth code', response.code);
  //     // send code to backend to exchange for access token
  //     const jwt = await fetch(
  //       `https://localhost:4000/auth/google/callback?code=${response.code}&scope=email%20profile%20openid%20https://www.googleapis.com/auth/calendar%20https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email&authuser=0&prompt=consent`,
  //       {
  //         method: 'GET',
  //       },
  //     );

  //     console.log(jwt);
  //   },
  //   onNonOAuthError: (response) => {
  //     console.error('Login failed', response);
  //   },
  //   onFailure: (response) => {
  //     console.error('Login failed', response);
  //   },
  //   ux_mode: 'popup',
  //   // redirect_uri: `https://localhost:3000`,
  //   flow: 'auth-code',
  // });

  if (auth.isAuthenticated) return <Redirect to="/" />;

  return (
    <div className="login">
      <div className="container">
        <h1>Log in to CanvasLy</h1>
        <p>
          back to{' '}
          <Link className="bold" to="/">
            Home page
          </Link>
        </p>
        {/* <form onSubmit={formik.handleSubmit}> */}
        {/* <a className="fb btn" href={FACEBOOK_AUTH_LINK}>
            <span className="login-text">
              <i className="fa fa-facebook fa-fw" /> Login with Facebook
            </span>
          </a> */}
        <a className="google btn" onClick={() => loginWithGoogle()}>
          <span className="login-text">
            <i className="fa fa-google fa-fw" /> Sign in with Google
          </span>
        </a>
        {/* <h2>Login with email address</h2>
          <p className="logins">Admin: email0@email.com 123456789</p>
          <p className="logins">User: email1@email.com 123456789</p>
          <div>
            <input
              placeholder="Email address"
              name="email"
              className="text"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="error">{formik.errors.email}</p>
            ) : null}
            <input
              placeholder="Password"
              name="password"
              type="password"
              className="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="error">{formik.errors.password}</p>
            ) : null}
          </div>
          {auth.error && <p className="error">{auth.error}</p>}
          <div>
            <button
              className="btn submit"
              disabled={auth.isLoading || !formik.isValid}
              type="submit"
            >
              Log in now
            </button>
          </div>
          <div>
            Don't have an account?{' '}
            <Link className="bold" to="/register">
              Register
            </Link>
          </div> */}
        {/* </form> */}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default compose(withRouter, connect(mapStateToProps, { loginUserWithEmail }))(Login);
