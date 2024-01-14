import React, { useEffect, useState } from 'react';
import Layout from '../../layout/Layout';
import requireAuth from '../../hoc/requireAuth';
import AssignmentList from '../../components/AssignmentList/AssignmentList';
import AssignmentForm from '../../components/NewAssignmentForm/AssignmentForm';
import { compose } from 'redux';
import { connect } from 'react-redux';

const Assignments = ({ auth, assignment }) => {
  const [isEdit, setIsEdit] = useState(false);

  const closeForm = () => {
    setIsEdit(false);
  };

  // redirect to home if we're in error state
  useEffect(() => {
    if (auth.error || assignment.error) {
      window.location.href = '/';
    }
  }, [auth.error, assignment.error]);

  return (
    <Layout>
      {isEdit ? (
        <div className="w-full flex justify-center">
          <AssignmentForm closeForm={closeForm} />
        </div>
      ) : (
        <div className="w-full">
          <div className="flex justify-center">
            <p className="dark:text-white text-4xl font-bold mr-4">Assignments</p>
            <button
              onClick={() => setIsEdit(true)}
              className="bg-blue-600 rounded-full px-3 py-2 text-white hover:bg-blue-700"
            >
              <svg
                class="w-4 h-4 text-white dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 1v16M1 9h16"
                />
              </svg>
            </button>
          </div>
          <div className="flex justify-center w-full">
            <AssignmentList isEdit={isEdit} closeForm={closeForm} />
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

export default compose(requireAuth, connect(mapStateToProps))(Assignments);
