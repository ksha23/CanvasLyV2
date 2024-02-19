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
          className="mr-2 rounded-full"
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
        if (name.length > 20) {
          name = name.substring(0, 20) + '...';
        }
        if (assignmentGroup.assignments.length === 0) {
          return null;
        }
        return (
          <div key={index}>
            <label className="text-sm md:text-base">
              <input
                type="checkbox"
                className="mr-2 rounded-full"
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 mx-2 py-2 px-3 rounded-full"
          onClick={() => sortAssignmentsByDueDate()}
        >
          Due Date
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 mx-2 py-2 px-3 rounded-full"
          onClick={() => sortAssignmentsByDifficulty()}
        >
          Difficulty
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-1 mx-2 py-2 px-3 rounded-full"
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
