import React, { useState, useLayoutEffect, useEffect } from 'react';
import Loader from '../Loader/Loader';
import CanvasAssignment from '../CanvasAssignment/CanvasAssignment';
import { connect } from 'react-redux';
import { getCanvasAssignments, refreshCanvasAssignments } from '../../store/actions/canvasActions';
import CanvasAssign from '../CanvasAssignment/CanvasAssign';

const CanvasList = ({
  assignments,
  isLoading,
  error,
  getCanvasAssignments,
  refreshCanvasAssignments,
}) => {
  useLayoutEffect(() => {
    if (!assignments || assignments.length === 0) {
      getCanvasAssignments();
    } else refreshCanvasAssignments();

    // refresh data every every 30 seconds
    const interval = setInterval(() => {
      refreshCanvasAssignments();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="justify-center w-full max-w-4xl text-zinc-700 dark:text-zinc-300">
      {isLoading && (
        <div>
          <Loader />
        </div>
      )}

      <div>
        {!isLoading &&
          assignments &&
          assignments.length > 0 &&
          assignments.map((assignmentGroup, index) => {
            return (
              <div className="m-5" key={index}>
                <p className="text-2xl font-bold mb-1">{assignmentGroup.course}</p>
                {assignmentGroup.assignments.assignments.map((assignment, index) => {
                  if (assignment.completed === false && assignment.confirmedCompleted === false) {
                    return <CanvasAssign assignment={assignment} key={index} />;
                  } else {
                    return null;
                  }
                })}
                {assignmentGroup.assignments.assignments.map((assignment, index) => {
                  if (assignment.completed === true && assignment.confirmedCompleted === false) {
                    return <CanvasAssign assignment={assignment} key={index} />;
                  } else {
                    return null;
                  }
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  assignments: state.canvas.assignments,
  isLoading: state.canvas.isLoading,
  error: state.canvas.error,
});

export default connect(mapStateToProps, { getCanvasAssignments, refreshCanvasAssignments })(
  CanvasList,
);
