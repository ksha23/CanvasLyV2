import React, { useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import {
  sortAssignmentsByDifficulty,
  sortAssignmentsByDueDate,
  sortAssignmentsByType,
} from '../store/actions/canvasActions';
import { assign } from 'lodash';

const CanvasSidebar = ({
  isMobile,
  selectedGroups,
  assignments,
  setSelectedGroups,
  handleGroupSelection,
  sortAssignmentsByDifficulty,
  sortAssignmentsByDueDate,
  sortAssignmentsByType,
}) => {
  useLayoutEffect(() => {
    setSelectedGroups(assignments.map((assignment) => assignment.course));
  }, []);

  return (
    <div className="sticky top-[150px] mr-8">
      <h2 className="text-2xl font-bold mb-2">Courses</h2>
      <label>
        <input
          type="checkbox"
          className="m-1 mr-2 rounded-full"
          checked={selectedGroups.length === assignments.length}
          onChange={() => {
            if (selectedGroups.length === assignments.length) {
              setSelectedGroups([]);
            } else {
              setSelectedGroups(assignments.map((assignment) => assignment.course));
            }
          }}
        />
        Select All
      </label>
      {assignments.map((assignmentGroup, index) => {
        let name = assignmentGroup.course;
        if (assignmentGroup.assignments.length === 0) {
          return null;
        }
        return (
          <div key={index} className="flex items-center">
            <label className="text-base line-clamp-1">
              <input
                type="checkbox"
                className="m-1 mr-2 rounded-full "
                checked={selectedGroups.includes(assignmentGroup.course)}
                onChange={() => handleGroupSelection(assignmentGroup.course)}
              />
              {name}
            </label>
          </div>
        );
      })}
      <h2 className="text-2xl font-bold mt-4 mb-2">Sort By</h2>
      <div className="text-sm">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold my-1 mx-2 py-2 px-4
           rounded-full"
          onClick={() => sortAssignmentsByDueDate()}
        >
          Due Date
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold my-1 mx-2 py-2 px-4 rounded-full"
          onClick={() => sortAssignmentsByDifficulty()}
        >
          Difficulty
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold my-1 mx-2 py-2 px-4 rounded-full"
          onClick={() => sortAssignmentsByType()}
        >
          Type
        </button>
      </div>
    </div>
  );
};

export default connect(null, {
  sortAssignmentsByDueDate,
  sortAssignmentsByDifficulty,
  sortAssignmentsByType,
})(CanvasSidebar);
