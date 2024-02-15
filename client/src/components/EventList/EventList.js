import React, { useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import Event from '../Event/Event';
import Loader from '../Loader/Loader';

import { getAssignments, refreshAssignments } from '../../store/actions/assignmentActions';

const EventList = ({ getAssignments, refreshAssignments, assignments, isLoading, error }) => {
  useLayoutEffect(() => {
    if (!assignments || assignments.length === 0) {
      getAssignments();
    } else refreshAssignments();
    // refresh data every every 30 seconds
    const interval = setInterval(() => {
      refreshAssignments();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="justify-center w-full max-w-4xl">
      <>
        {isLoading ? (
          <div className="flex justify-center w-full max-w-4xl pt-10">
            <Loader />
          </div>
        ) : error ? (
          <div
            className="mt-5
           text-center text-red-600"
          >
            {error}
          </div>
        ) : (
          <div>
            {/* map through only assignments/assignments that are not completed*/}
            {assignments &&
              assignments.length > 0 &&
              assignments.map((assignment, index) => {
                if (assignment.completed === false && assignment.confirmedCompleted === false) {
                  return <Event key={index} assignment={assignment} />;
                }
              })}
            {/* map through only assignments/assignments that are completed*/}
            {assignments &&
              assignments.length > 0 &&
              assignments.map((assignment, index) => {
                if (assignment.completed === true && assignment.confirmedCompleted === false) {
                  return <Event key={index} assignment={assignment} />;
                }
              })}
          </div>
        )}
      </>
    </div>
  );
};

const mapStateToProps = (state) => ({
  assignments: state.assignment.assignments, // Access assignments directly
  isLoading: state.assignment.isLoading,
  error: state.assignment.error,
});

export default connect(mapStateToProps, { getAssignments, refreshAssignments })(EventList);
