import React, { useLayoutEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import { withRouter } from 'react-router-dom';

import { getProfile, refreshProfile, editUser } from '../../store/actions/userActions';
import { loadMe } from '../../store/actions/authActions';
import Layout from '../../layout/Layout';
import Loader from '../../components/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';
import { profileSchema } from './validation';
import Slider from '@mui/material/Slider';
import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 1,
    label: '1',
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 4,
    label: '4',
  },
  {
    value: 5,
    label: '5',
  },
  {
    value: 6,
    label: '6',
  },
  {
    value: 7,
    label: '7',
  },
  {
    value: 8,
    label: '8',
  },
  {
    value: 9,
    label: '9',
  },
  {
    value: 10,
    label: '10',
  },
];

const Profile = ({
  getProfile,
  refreshProfile,
  user: { profile, isLoading, error },
  auth: { me },
  editUser,
  loadMe,
  history,
  match,
}) => {
  const [image, setImage] = useState('');
  const [avatar, setAvatar] = useState('');
  const matchUsername = match.params.username;

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  window.addEventListener('themeChange', handleThemeChange);

  function handleThemeChange() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
  }

  useLayoutEffect(() => {
    if (!profile || profile.username !== matchUsername) getProfile(me.id, history);
    // else refreshProfile(matchUsername);
    if (matchUsername == profile.username) refreshProfile(me.id, history);
  }, [matchUsername]);

  const onChange = (event) => {
    formik.setFieldValue('image', event.currentTarget.files[0]);
    try {
      setImage(URL.createObjectURL(event.target.files[0]));
      setAvatar(event.target.files[0]);
    } catch (err) {
      // expected
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      image: '',
      avatar: '',
      id: profile.id,
      name: profile.name,
      username: profile.username,
      password: '',
      dueDateWeight: profile.weights ? profile.weights[0] : 0,
      difficultyWeight: profile.weights ? profile.weights[1] : 0,
      typeWeight: profile.weights ? profile.weights[2] : 0,
      calendarId: profile.calendarId ? profile.calendarId : '',
    },
    validationSchema: profileSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('avatar', avatar);
      formData.append('name', values.name);
      formData.append('username', values.username);
      formData.append('calendarId', values.calendarId);
      formData.append('dueDateWeight', parseInt(values.dueDateWeight));
      formData.append('difficultyWeight', parseInt(values.difficultyWeight));
      formData.append('typeWeight', parseInt(values.typeWeight));
      if (profile.provider === 'email') {
        formData.append('password', values.password);
      }
      editUser(values.id, formData, history);
      // reset form
      formik.resetForm();
      setImage('');
      setAvatar('');
      // scroll to top
      window.scrollTo(0, 0);
    },
  });

  return (
    <Layout>
      {error && <p className="error">{error}</p>}

      <div className="dark:text-white w-full">
        <p className="text-4xl font-bold text-center mb-4">Profile: {profile.name}</p>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div className="flex justify-center items-center flex-col w-full text-zinc-700 dark:text-zinc-300">
            <div className="flex justify-center items-center space-x-5">
              <div className="w-20 h-20 md:w-40 md:h-40">
                <img
                  src={image ? image : profile.avatar}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <div>
                <div>
                  <span className="font-bold">Username: </span>
                  <span className="info">{profile.username}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>
                    <svg
                      className="w-4 h-4"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm14-7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm-5-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1ZM20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z" />
                    </svg>
                  </span>
                  <span>
                    {profile.calendars && profile.calendarId == '' && 'No Calendar Selected'}
                    {profile.calendars &&
                      profile.calendarId !== '' &&
                      profile.calendars.find((calendar) => calendar.id === profile.calendarId)
                        .summary}
                  </span>
                </div>
                {profile.weights && (
                  <>
                    <div>
                      <span className="font-bold">Due Date Weight: </span>
                      <span className="info">{profile.weights[0]}</span>
                    </div>
                    <div>
                      <span className="font-bold">Difficulty Weight: </span>
                      <span className="info">{profile.weights[1]}</span>
                    </div>
                    <div>
                      <span className="font-bold">Type Weight: </span>
                      <span className="info">{profile.weights[2]}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {matchUsername == me.username && (
              <div className="flex justify-center w-full">
                <form
                  onSubmit={formik.handleSubmit}
                  className="flex flex-col justify-center w-full"
                >
                  <div className="mt-2 flex flex-col justify-center items-center w-full">
                    <div className="max-w-xl w-full flex items-center mt-4">
                      <label className="font-bold text-lg">
                        <svg
                          className="w-7 h-7"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 18"
                        >
                          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                        </svg>
                      </label>
                      <input
                        className="ml-2 bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-md justify-center text-zinc-500 file:bg-transparent file:text-blue-600 file:dark:text-blue-500 file:font-semibold file:rounded-md file:underline file:border-none file:py-2 file:pl-4 file:pr-2  w-full max-w-xl"
                        name="image"
                        type="file"
                        onChange={onChange}
                      />
                      {image && (
                        <button
                          className="ml-2"
                          onClick={() => {
                            setImage('');
                            setAvatar('');
                          }}
                          type="button"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  {/* <input name="id" type="hidden" value={formik.values.id} /> */}
                  <div className="mt-2 flex flex-col justify-center items-center w-full">
                    <div className="max-w-xl w-full flex items-center">
                      <label className="font-bold text-lg mb-1">Name:</label>
                      <input
                        placeholder="Name"
                        name="name"
                        className="ml-2 rounded-md border bg-transparent border-zinc-300 dark:border-zinc-700 w-full max-w-xl"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                      />
                    </div>
                    {formik.touched.name && formik.errors.name ? (
                      <p className="text-red-600 dark:text-red-500">{formik.errors.name}</p>
                    ) : null}
                  </div>

                  <div className="mt-2 flex flex-col justify-center items-center w-full">
                    <div className="max-w-xl w-full flex items-center">
                      <label className="font-bold text-lg mb-1">Username: </label>
                      <input
                        placeholder="Username"
                        name="username"
                        className="px-4 ml-2 rounded-md bg-transparent border border-zinc-300 dark:border-zinc-700 w-full max-w-xl"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                      />
                    </div>
                    {formik.touched.username && formik.errors.username ? (
                      <p className="text-red-600 dark:text-red-500">{formik.errors.username}</p>
                    ) : null}
                  </div>
                  <div className="mt-4 flex flex-col justify-center items-center w-full">
                    <label className="font-bold text-lg">Calendar: </label>
                    <select
                      className="rounded-md bg-transparent border border-zinc-300 dark:border-zinc-700  w-full max-w-xl"
                      name="calendarId"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.calendarId}
                    >
                      <option value="">Choose a Calendar</option>
                      {profile.calendars &&
                        profile.calendars.map((calendar) => (
                          <option key={calendar.id} value={calendar.id}>
                            {calendar.summary}
                          </option>
                        ))}
                    </select>
                    {formik.errors.calendarId && formik.touched.calendarId && (
                      <p className="text-red-600 dark:text-red-500">{formik.errors.calendarId}</p>
                    )}
                  </div>
                  <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                    <div className="mt-4 flex flex-col justify-center items-center w-full">
                      <label className="font-bold text-lg mb-1">Due Date Weight: </label>
                      <Slider
                        name="dueDateWeight"
                        value={formik.values.dueDateWeight}
                        onChange={formik.handleChange}
                        step={1}
                        marks={marks}
                        min={0}
                        max={10}
                        valueLabelDisplay="off"
                        className="w-full max-w-xl text-blue-600"
                      />
                    </div>
                    <div className="mt-4 flex flex-col justify-center items-center w-full">
                      <label className="font-bold text-lg mb-1">Difficulty Weight: </label>
                      <Slider
                        name="difficultyWeight"
                        value={formik.values.difficultyWeight}
                        onChange={formik.handleChange}
                        step={1}
                        marks={marks}
                        min={0}
                        max={10}
                        valueLabelDisplay="off"
                        className="w-full max-w-xl text-blue-600"
                      />
                    </div>
                    <div className="mt-4 flex flex-col justify-center items-center w-full">
                      <label className="font-bold text-lg mb-1">Type Weight: </label>
                      <Slider
                        name="typeWeight"
                        value={formik.values.typeWeight}
                        onChange={formik.handleChange}
                        step={1}
                        marks={marks}
                        min={0}
                        max={10}
                        valueLabelDisplay="off"
                        className="w-full max-w-xl text-blue-600"
                      />
                      {formik.errors.typeWeight && formik.touched.typeWeight && (
                        <p className="text-red-600 dark:text-red-500">{formik.errors.typeWeight}</p>
                      )}
                    </div>
                  </ThemeProvider>

                  <div className="mt-4 flex justify-center items-center w-full">
                    <button
                      type="submit"
                      className="mt-2 px-4 py-2 rounded-md text-white bg-gradient-to-bl from-sky-600 to-blue-800 w-full max-w-xl"
                    >
                      Save Preferences
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  auth: state.auth,
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { getProfile, refreshProfile, editUser, loadMe }),
)(Profile);

/*
getProfile,
  user: { profile, isLoading, error },
  auth: { me },
  editUser,
  loadMe,
  history,
  match,
*/
