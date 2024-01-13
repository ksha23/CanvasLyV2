import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Message from '../Message/Message';
import Loader from '../Loader/Loader';

import { getMessages } from '../../store/actions/messageActions';

const MessageList = ({ getMessages, messages, isLoading, error }) => {
  useEffect(() => {
    if (!messages || messages.length == 0) {
      console.log('getting messages');
      getMessages();
    }

    // get messages every 30 seconds
  }, []);

  return (
    <div className="justify-center w-full max-w-4xl">
      <>
        {isLoading ? (
          <div className="flex justify-center w-full max-w-4xl">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center">{error}</div>
        ) : (
          <div>
            {/* map through only assignments/messages that are not completed*/}
            {messages &&
              messages.length > 1 &&
              messages.map((message, index) => {
                if (message.completed === false && message.confirmedCompleted === false) {
                  return <Message key={index} message={message} />;
                }
              })}
            {/* map through only assignments/messages that are completed*/}
            {messages &&
              messages.length > 1 &&
              messages.map((message, index) => {
                if (message.completed === true && message.confirmedCompleted === false) {
                  return <Message key={index} message={message} />;
                }
              })}
          </div>
        )}
      </>
    </div>
  );
};

const mapStateToProps = (state) => ({
  messages: state.message.messages, // Access messages directly
  isLoading: state.message.isLoading,
  error: state.message.error,
});

export default connect(mapStateToProps, { getMessages })(MessageList);
