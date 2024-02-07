import React, { useState, useLayoutEffect } from 'react';
import { isMobile } from 'react-device-detect';
import Loader from '../Loader/Loader';
import { connect } from 'react-redux';
import { getCanvasAssignments, refreshCanvasAssignments } from '../../store/actions/canvasActions';
import CanvasAssign from '../CanvasAssignment/CanvasAssignment';

const CanvasList = ({
  assignments,
  isLoading,
  error,
  getCanvasAssignments,
  refreshCanvasAssignments,
}) => {
  const [selectedGroups, setSelectedGroups] = useState([]);

  useLayoutEffect(() => {
    // select all groups by default
    if (assignments && assignments.length > 0 && selectedGroups.length === 0) {
      setSelectedGroups(assignments.map((assignment) => assignment.course));
    }

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
          <div className="pt-5 pb-8">
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
            {assignments.map((assignmentGroup, index) => {
              let name = ' ' + assignmentGroup.course;
              if (name.length > 40 && isMobile) {
                name = name.substring(0, 40) + '...';
              }
              return (
                <div key={index}>
                  <label className="text-sm md:text-base">
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(assignmentGroup.course)}
                      onChange={() => handleGroupSelection(assignmentGroup.course)}
                    />
                    {name}
                  </label>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading &&
          assignments &&
          assignments.length > 0 &&
          assignments.map((assignmentGroup, index) => {
            if (selectedGroups.includes(assignmentGroup.course)) {
              return (
                <div key={index}>
                  <p className="text-xl md:text-2xl font-bold mb-2">{assignmentGroup.course}</p>
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
