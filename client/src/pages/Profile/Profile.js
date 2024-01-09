import React, { useEffect, useState, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
// import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { getProfile, editUser, deleteUser } from '../../store/actions/userActions';
// import { getCalendars } from '../../store/actions/calendarActions';
import { loadMe } from '../../store/actions/authActions';
import Layout from '../../layout/Layout';
import Loader from '../../components/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';
import { profileSchema } from './validation';

import './styles.css';

const Profile = ({
  getProfile,
  // getCalendars,
  user: { profile, isLoading, error },
  auth: { me },
  editUser,
  deleteUser,
  loadMe,
  history,
  match,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const retryCount = useRef(0);
  const matchUsername = match.params.username;

  useEffect(() => {
    getProfile(matchUsername, history);
    // getCalendars();
  }, [matchUsername]);

  // if changed his own username reload me, done in userActions

  const onChange = (event) => {
    formik.setFieldValue('image', event.currentTarget.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
    setAvatar(event.target.files[0]);
  };

  // handles initial population of form with profile data
  const handleClickEdit = () => {
    retryCount.current = 0;
    setIsEdit((oldIsEdit) => !oldIsEdit);
    setImage(null);
    setAvatar(null);
    formik.setFieldValue('id', profile.id);
    formik.setFieldValue('name', profile.name);
    formik.setFieldValue('username', profile.username);
    formik.setFieldValue('calendarId', profile.calendarId);
    formik.setFieldValue('dueDateWeight', profile.weights[0]);
    formik.setFieldValue('difficultyWeight', profile.weights[1]);
    formik.setFieldValue('typeWeight', profile.weights[2]);
  };

  const handleDeleteUser = (id, history) => {
    deleteUser(id, history);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: '',
      name: '',
      username: '',
      password: '',
      dueDateWeight: 0,
      difficultyWeight: 0,
      typeWeight: 0,
      calendarId: '',
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
      //setIsEdit(false);
    },
  });

  return (
    <Layout>
      <div className="profile">
        <h1>Profile Settings</h1>
        <p>
          This is your profile settings page. Here, you can see and edit your profile information.
        </p>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="profile-info">
            <img src={image ? image : profile.avatar} className="avatar" />
            <div className="info-container">
              {/* <div>
                <span className="label">Provider: </span>
                <span className="info">{profile.provider}</span>
              </div> */}
              {/* <div>
                <span className="label">Role: </span>
                <span className="info">{profile.role}</span>
              </div> */}
              <div>
                <span className="label">Name: </span>
                <span className="info">{profile.name}</span>
              </div>
              <div>
                <span className="label">Username: </span>
                <span className="info">{profile.username}</span>
              </div>
              <div>
                <span className="label">Email: </span>
                <span className="info">{profile.email}</span>
              </div>
              {/* <div>
                <span className="label">Joined: </span>
                <span className="info">
                  {moment(profile.createdAt).format('dddd, MMMM Do YYYY, H:mm:ss')}
                </span>
              </div> */}
              <div>
                <span className="label">Calendar: </span>
                <span className="info">
                  {profile.calendars &&
                    profile.calendars.find((calendar) => calendar.id === profile.calendarId)
                      .summary}
                </span>
              </div>
              {profile.weights && (
                <>
                  <div>
                    <span className="label">Due Date Weight: </span>
                    <span className="info">{profile.weights[0]}</span>
                  </div>
                  <div>
                    <span className="label">Difficulty Weight:</span>
                    <span className="info">{profile.weights[1]}</span>
                  </div>
                  <div>
                    <span className="label">Type Weight: </span>
                    <span className="info">{profile.weights[2]}</span>
                  </div>
                </>
              )}

              <div>
                <button
                  className="btn"
                  type="button"
                  onClick={handleClickEdit}
                  disabled={!(me?.username === profile.username || me?.role === 'ADMIN')}
                >
                  {isEdit ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {isEdit && (
          <div className="form">
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label>Avatar:</label>
                <input name="image" type="file" onChange={onChange} />
                {image && (
                  <button
                    className="btn"
                    onClick={() => {
                      setImage(null);
                      setAvatar(null);
                    }}
                    type="button"
                  >
                    Remove Image
                  </button>
                )}
              </div>
              <input name="id" type="hidden" value={formik.values.id} />
              <div className="input-div">
                <label>Name:</label>
                <input
                  placeholder="Name"
                  name="name"
                  className=""
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                  <p className="error">{formik.errors.name}</p>
                ) : null}
              </div>
              <div className="input-div">
                <label>Username:</label>
                <input
                  placeholder="Username"
                  name="username"
                  className=""
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                />
                {formik.touched.username && formik.errors.username ? (
                  <p className="error">{formik.errors.username}</p>
                ) : null}
              </div>
              <div className="input-div">
                <label>Calendar:</label>
                <select
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
              <div className="input-div">
                <label>Due Date Weight:</label>
                <select
                  name="dueDateWeight"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.dueDateWeight}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                {formik.errors.dueDateWeight && formik.touched.dueDateWeight && (
                  <p className="error">{formik.errors.dueDateWeight}</p>
                )}
              </div>
              <div className="input-div">
                <label>Difficulty Weight:</label>
                <select
                  name="difficultyWeight"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.difficultyWeight}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                {formik.errors.difficultyWeight && formik.touched.difficultyWeight && (
                  <p className="error">{formik.errors.difficultyWeight}</p>
                )}
              </div>
              <div className="input-div">
                <label>Type Weight:</label>
                <select
                  name="typeWeight"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.typeWeight}
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                {formik.errors.typeWeight && formik.touched.typeWeight && (
                  <p className="error">{formik.errors.typeWeight}</p>
                )}
              </div>

              {profile.provider === 'email' && (
                <div className="input-div">
                  <label>Password:</label>
                  <input
                    placeholder="Password"
                    name="password"
                    className=""
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <p className="error">{formik.errors.password}</p>
                  ) : null}
                </div>
              )}
              <button type="submit" className="btn">
                Save
              </button>
              <button
                onClick={() => handleDeleteUser(profile.id, history)}
                type="button"
                className="btn"
              >
                Delete User
              </button>
            </form>
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
  connect(mapStateToProps, { getProfile, /*getCalendars,*/ editUser, deleteUser, loadMe }),
)(Profile);
