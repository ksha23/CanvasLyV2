import React, { useEffect, useState } from 'react';
import Layout from '../../layout/Layout';
import requireAuth from '../../hoc/requireAuth';
import MessageList from '../../components/MessageList/MessageList';
import MessageForm from '../../components/MessageForm/MessageForm';
import { compose } from 'redux';
import { connect } from 'react-redux';

const Assignments = ({ auth, message }) => {
  const [isEdit, setIsEdit] = useState(false);

  const closeForm = () => {
    setIsEdit(false);
  };

  // redirect to home if we're in error state
  useEffect(() => {
    if (auth.error || message.error) {
      window.location.href = '/';
    }
  }, [auth.error, message.error]);

  return (
    <Layout>
      {isEdit ? (
        <div className="w-full flex justify-center">
          <MessageForm closeForm={closeForm} />
        </div>
      ) : (
        <div className="w-full">
          <div className="flex justify-center">
            <p className="dark:text-white text-3xl font-bold mr-4">Assignments</p>
            <button
              onClick={() => setIsEdit(true)}
              className="bg-violet-600 rounded px-4 py-2 text-white transition duration-300 hover:bg-violet-700"
            >
              Add
            </button>
          </div>
          <div className="flex justify-center w-full">
            <MessageList isEdit={isEdit} closeForm={closeForm} />
          </div>
        </div>
      )}
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  message: state.message,
});

export default compose(requireAuth, connect(mapStateToProps))(Assignments);
