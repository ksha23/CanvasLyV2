import React, { useEffect, useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import Assignment from '../Assignment/Assignment';
import Loader from '../Loader/Loader';

import { getAssignments } from '../../store/actions/assignmentActions';

const AssignmentList = ({ getAssignments, assignments, isLoading, error }) => {
  useLayoutEffect(() => {
    getAssignments();
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

export default connect(mapStateToProps, { getAssignments })(AssignmentList);