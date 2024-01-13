import React, { useEffect, useState, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import { withRouter } from 'react-router-dom';

import { getProfile, editUser } from '../../store/actions/userActions';
import { loadMe } from '../../store/actions/authActions';
import Layout from '../../layout/Layout';
import Loader from '../../components/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';
import { profileSchema } from './validation';
import Slider from '@mui/material/Slider';

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
  user: { profile, isLoading, error },
  auth: { me },
  editUser,
  deleteUser,
  loadMe,
  history,
  match,
}) => {
  const [image, setImage] = useState('');
  const [avatar, setAvatar] = useState('');
  const matchUsername = match.params.username;

  useEffect(() => {
    getProfile(matchUsername, history);
  }, [matchUsername]);

  const onChange = (event) => {
    formik.setFieldValue('image', event.currentTarget.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
    setAvatar(event.target.files[0]);
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
    },
  });

  return (
    <Layout>
      {error && <p className="error">{error}</p>}

      <div className="dark:text-white w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Profile</h1>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <div className="flex justify-center flex-col w-full">
            <div className="flex justify-center items-center space-x-4 w-full">
              <div className="w-20 h-20 md:w-40 md:h-40">
                <img src={image ? image : profile.avatar} className="object-cover w-full h-full" />
              </div>
              <div>
                <div>
                  <span className="font-bold">Name: </span>
                  <span className="">{profile.name}</span>
                </div>
                <div>
                  <span className="font-bold">Username: </span>
                  <span className="info">{profile.username}</span>
                </div>
                <div>
                  <span className="font-bold">Email: </span>
                  <span className="info">{profile.email}</span>
                </div>
                <div>
                  <span className="font-bold">Calendar: </span>
                  <span className="info">
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

            <div className="flex justify-center w-full">
              <p></p>
              <form onSubmit={formik.handleSubmit} className="flex flex-col justify-center w-full">
                <div className="mt-2 flex flex-col justify-center items-center w-full">
                  <label className="font-bold text-lg mt-4 mb-1">Avatar: </label>
                  <input
                    className="px-4 py-2 ml-2 rounded-md bg-zinc-200 dark:bg-zinc-700 w-full max-w-xl text-center"
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
                      Remove Image
                    </button>
                  )}
                </div>
                {/* <input name="id" type="hidden" value={formik.values.id} /> */}
                <div className="mt-4 flex flex-col justify-center items-center w-full">
                  <label className="font-bold text-lg mb-1">Name: </label>
                  <input
                    placeholder="Name"
                    name="name"
                    className="p-2 ml-2 rounded-md bg-zinc-200 dark:bg-zinc-700 w-full max-w-xl text-center"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <p className="error">{formik.errors.name}</p>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-col justify-center items-center w-full">
                  <label className="font-bold text-lg mb-1">Username: </label>
                  <input
                    placeholder="Username"
                    name="username"
                    className="p-2 ml-2 rounded-md bg-zinc-200 dark:bg-zinc-700 w-full max-w-xl text-center"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <p className="error">{formik.errors.username}</p>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-col justify-center items-center w-full">
                  <label className="font-bold text-lg mb-1">Calendar: </label>
                  <select
                    className="p-2 ml-2 rounded-md bg-zinc-200 dark:bg-zinc-700 w-full max-w-xl text-center"
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
                    <p className="error">{formik.errors.calendarId}</p>
                  )}
                </div>
                <div className="mt-4 flex flex-col justify-center items-center w-full">
                  <label className="font-bold text-lg mb-1">Due Date Weight: </label>

                  <Slider
                    name="dueDateWeight"
                    value={formik.values.dueDateWeight}
                    onChange={formik.handleChange}
                    // onBlur={formik.handleBlur}
                    step={1}
                    marks={marks}
                    min={1}
                    max={10}
                    valueLabelDisplay="off"
                    className="w-full max-w-xl"
                  />
                </div>
                <div className="mt-4 flex flex-col justify-center items-center w-full">
                  <label className="font-bold text-lg mb-1">Difficulty Weight: </label>
                  <Slider
                    name="difficultyWeight"
                    value={formik.values.difficultyWeight}
                    onChange={formik.handleChange}
                    // onBlur={formik.handleBlur}
                    step={1}
                    marks={marks}
                    min={1}
                    max={10}
                    valueLabelDisplay="off"
                    className="w-full max-w-xl"
                  />
                </div>
                <div className="mt-4 flex flex-col justify-center items-center w-full">
                  <label className="font-bold text-lg mb-1">Type Weight: </label>
                  <Slider
                    name="typeWeight"
                    value={formik.values.typeWeight}
                    onChange={formik.handleChange}
                    // onBlur={formik.handleBlur}
                    step={1}
                    marks={marks}
                    min={1}
                    max={10}
                    valueLabelDisplay="off"
                    className="w-full max-w-xl"
                  />
                  {formik.errors.typeWeight && formik.touched.typeWeight && (
                    <p className="error">{formik.errors.typeWeight}</p>
                  )}
                </div>
                <div className="mt-4 flex justify-center items-center w-full">
                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 rounded-md text-white bg-violet-600"
                  >
                    Save Preferences
                  </button>
                </div>
              </form>
            </div>
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
  connect(mapStateToProps, { getProfile, editUser, loadMe }),
)(Profile);
