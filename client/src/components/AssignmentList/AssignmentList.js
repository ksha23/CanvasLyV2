import React, { useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import Assignment from '../Assignment/Assignment';
import Loader from '../Loader/Loader';

import { getAssignments, refreshAssignments } from '../../store/actions/assignmentActions';

const AssignmentList = ({ getAssignments, refreshAssignments, assignments, isLoading, error }) => {
  useLayoutEffect(() => {
    if (!assignments || assignments.length === 0) {
      getAssignments();
    }
    refreshAssignments();
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
          <div className="flex justify-center w-full max-w-4xl">
            <Loader />
          </div>
        ) : error ? (
          <div className="text-center">{error}</div>
        ) : (
          <div>
            {/* map through only assignments/assignments that are not completed*/}
            {assignments &&
              assignments.length > 1 &&
              assignments.map((assignment, index) => {
                if (assignment.completed === false && assignment.confirmedCompleted === false) {
                  return <Assignment key={index} assignment={assignment} />;
                }
              })}
            {/* map through only assignments/assignments that are completed*/}
            {assignments &&
              assignments.length > 1 &&
              assignments.map((assignment, index) => {
                if (assignment.completed === true && assignment.confirmedCompleted === false) {
                  return <Assignment key={index} assignment={assignment} />;
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

export default connect(mapStateToProps, { getAssignments, refreshAssignments })(AssignmentList);
