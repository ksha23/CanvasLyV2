import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';

import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { loginUserWithEmail } from '../../store/actions/authActions';
import { GOOGLE_AUTH_LINK } from '../../constants';
// import { loginSchema } from './validation';
import { useGoogleLogin } from '@react-oauth/google';

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

  // alternative login (web)
  // const loginWithGoogle = useGoogleLogin({
  //   select_account: true,
  //   onNonOAuthError: (response) => {
  //     console.error('Login failed', response);
  //   },
  //   onFailure: (response) => {
  //     console.error('Login failed', response);
  //   },
  //   ux_mode: 'redirect',
  //   redirect_uri: `https://localhost:4000/auth/google/callback`,
  //   flow: 'auth-code',
  // });

  // mobile login (testing)
  // const loginWithGoogle = useGoogleLogin({
  //   select_account: true,
  //   onNonOAuthError: (response) => {
  //     console.error('Login failed', response);
  //   },
  //   onFailure: (response) => {
  //     console.error('Login failed', response);
  //   },
  //   ux_mode: 'redirect',
  //   redirect_uri: `http://localhost:3000`,
  //   flow: 'auth-code',
  // });

  if (auth.isAuthenticated) return <Redirect to="/" />;

  return (
    <div className="h-screen flex justify-center items-center dark:bg-black dark:text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Log in to CanvasLy</h1>
        <p className="mb-4">
          Go back to{' '}
          <a className="font-bold underline" href="/">
            Home page
          </a>
        </p>
        <a
          className="bg-red-600 px-4 py-2 text-white rounded flex items-center justify-center"
          href={GOOGLE_AUTH_LINK}
        >
          <i className="fa fa-google fa-fw mr-2" />
          <span>Sign in with Google</span>
        </a>
      </div>
    </div>
  );
};

{
  /* <form onSubmit={formik.handleSubmit}> */
}
{
  /* <a className="fb btn" href={FACEBOOK_AUTH_LINK}>
            <span className="login-text">
              <i className="fa fa-facebook fa-fw" /> Login with Facebook
            </span>
          </a> */
}
{
  /* <a className="google btn" onClick={() => loginWithGoogle()}>
          <span className="login-text">
            <i className="fa fa-google fa-fw" /> TEST! Sign in with Google Mobile TEST!
          </span>
        </a> */
}
{
  /* <h2>Login with email address</h2>
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
          </div> */
}
{
  /* </form> */
}
// </div>

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default compose(withRouter, connect(mapStateToProps, { loginUserWithEmail }))(Login);
