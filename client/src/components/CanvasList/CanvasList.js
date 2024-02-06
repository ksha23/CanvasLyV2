import React, { useState, useLayoutEffect } from 'react';
import Loader from '../Loader/Loader';
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
  const [selectedGroups, setSelectedGroups] = useState([]);

  useLayoutEffect(() => {
    if (!assignments || assignments.length === 0) {
      getCanvasAssignments();
    } else refreshCanvasAssignments();

    // refresh data every every 60 seconds

    const interval = setInterval(() => {
      refreshCanvasAssignments();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleGroupSelection = (group) => {
    if (selectedGroups.includes(group)) {
      setSelectedGroups(selectedGroups.filter((selectedGroup) => selectedGroup !== group));
    } else {
      setSelectedGroups([...selectedGroups, group]);
    }
  };

  return (
    <div className="justify-center w-full max-w-4xl text-zinc-700 dark:text-zinc-300">
      {isLoading && (
        <div>
          <Loader />
        </div>
      )}

      <div>
        {!isLoading && (
          <div className="py-5">
            {/*select all checkbox*/}
            <label className="">
              <input
                type="checkbox"
                checked={selectedGroups.length === assignments.length}
                onChange={() => {
                  if (selectedGroups.length === assignments.length) {
                    setSelectedGroups([]);
                  } else {
                    setSelectedGroups(assignments.map((assignment) => assignment.course));
                  }
                }}
              />
              {' Select All'}
            </label>
            {assignments.map((assignmentGroup, index) => (
              <div key={index}>
                <label className="">
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(assignmentGroup.course)}
                    onChange={() => handleGroupSelection(assignmentGroup.course)}
                  />
                  {' ' + assignmentGroup.course}
                </label>
              </div>
            ))}
          </div>
        )}

        {!isLoading &&
          assignments &&
          assignments.length > 0 &&
          assignments.map((assignmentGroup, index) => {
            if (selectedGroups.includes(assignmentGroup.course)) {
              return (
                <div key={index}>
                  <p className="text-2xl font-bold mb-2">{assignmentGroup.course}</p>
                  {assignmentGroup.assignments.map((assignment, index) => {
                    if (assignment.completed === false && assignment.confirmedCompleted === false) {
                      return <CanvasAssign assignment={assignment} key={index} />;
                    } else {
                      return null;
                    }
                  })}
                  {assignmentGroup.assignments.map((assignment, index) => {
                    if (assignment.completed === true && assignment.confirmedCompleted === false) {
                      return <CanvasAssign assignment={assignment} key={index} />;
                    } else {
                      return null;
                    }
                  })}
                </div>
              );
            } else {
              return null;
            }
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
