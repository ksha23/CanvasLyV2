import React, { useState } from 'react';
import Layout from '../../layout/Layout';
import requireAuth from '../../hoc/requireAuth';
import EventList from '../../components/EventList/EventList';
import AssignmentForm from '../../components/NewAssignmentForm/AssignmentForm';
import { compose } from 'redux';
import { connect } from 'react-redux';

const Calendar = ({ auth, assignment }) => {
  const [isEdit, setIsEdit] = useState(false);

  const closeForm = () => {
    setIsEdit(false);
  };

  return (
    <Layout>
      {isEdit ? (
        <div className="w-full flex justify-center">
          <AssignmentForm closeForm={closeForm} />
        </div>
      ) : (
        <div className="w-full px-2">
          <div className="flex justify-center">
            <p className="text-black dark:text-white text-3xl font-bold mr-4">Calendar</p>
            <button onClick={() => setIsEdit(true)}>
              <svg
                className="w-7 h-7 text-black dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 107.07 122.88"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M31.54,86.95c-1.74,0-3.16-1.43-3.16-3.19c0-1.76,1.41-3.19,3.16-3.19h20.5c1.74,0,3.16,1.43,3.16,3.19 c0,1.76-1.41,3.19-3.16,3.19H31.54L31.54,86.95z M31.54,42.27c-1.74,0-3.15-1.41-3.15-3.15c0-1.74,1.41-3.15,3.15-3.15h41.61 c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54L31.54,42.27z M56.85,116.58c1.74,0,3.15,1.41,3.15,3.15 c0,1.74-1.41,3.15-3.15,3.15H7.33c-2.02,0-3.85-0.82-5.18-2.15C0.82,119.4,0,117.57,0,115.55V7.33c0-2.02,0.82-3.85,2.15-5.18 C3.48,0.82,5.31,0,7.33,0h90.02c2.02,0,3.85,0.82,5.18,2.15c1.33,1.33,2.15,3.16,2.15,5.18V72.6c0,1.74-1.41,3.15-3.15,3.15 s-3.15-1.41-3.15-3.15V7.33c0-0.28-0.12-0.54-0.3-0.73c-0.19-0.19-0.45-0.3-0.73-0.3H7.33c-0.28,0-0.54,0.12-0.73,0.3 C6.42,6.8,6.3,7.05,6.3,7.33v108.21c0,0.28,0.12,0.54,0.3,0.73c0.19,0.19,0.45,0.3,0.73,0.3H56.85L56.85,116.58z M83.35,83.7 c0-1.73,1.41-3.14,3.14-3.14c1.73,0,3.14,1.41,3.14,3.14l-0.04,14.36l14.34,0.04c1.73,0,3.14,1.41,3.14,3.14s-1.41,3.14-3.14,3.14 l-14.35-0.04l-0.04,14.34c0,1.73-1.41,3.14-3.14,3.14c-1.73,0-3.14-1.41-3.14-3.14l0.04-14.35l-14.34-0.04 c-1.73,0-3.14-1.41-3.14-3.14c0-1.73,1.41-3.14,3.14-3.14l14.36,0.04L83.35,83.7L83.35,83.7z M31.54,64.59 c-1.74,0-3.15-1.41-3.15-3.15c0-1.74,1.41-3.15,3.15-3.15h41.61c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H31.54 L31.54,64.59z"
                />
              </svg>
            </button>
          </div>
          <div className="flex justify-center w-full">
            <EventList isEdit={isEdit} closeForm={closeForm} />
          </div>
        </div>
      )}
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  assignment: state.assignment,
});

export default compose(requireAuth, connect(mapStateToProps))(Calendar);
