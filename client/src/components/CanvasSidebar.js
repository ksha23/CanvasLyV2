import React, { useLayoutEffect } from 'react';
import { connect } from 'react-redux';

import {
  sortAssignmentsByDifficulty,
  sortAssignmentsByDueDate,
  sortAssignmentsByType,
} from '../store/actions/canvasActions';
import { toInteger } from 'lodash';

const CanvasSidebar = ({
  isMobile,
  selectedGroups,
  assignments,
  setSelectedGroups,
  handleGroupSelection,
  sortAssignmentsByDifficulty,
  sortAssignmentsByDueDate,
  sortAssignmentsByType,
  setTypeFilter,
  setDifficultyFilter,
}) => {
  useLayoutEffect(() => {
    setSelectedGroups(assignments.map((assignment) => assignment.course));
  }, []);

  return (
    <div className="sticky top-[115px] mr-8">
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
          className="border border-blue-600 my-1 mx-2 py-2 px-4
           rounded-full"
          onClick={() => sortAssignmentsByDueDate()}
        >
          Due Date
        </button>
        <button
          className="border border-blue-600 my-1 mx-2 py-2 px-4 rounded-full"
          onClick={() => sortAssignmentsByDifficulty()}
        >
          Difficulty
        </button>
        <button
          className="border border-blue-600 my-1 mx-2 py-2 px-4 rounded-full"
          onClick={() => sortAssignmentsByType()}
        >
          Type
        </button>
      </div>
      <h2 className="text-2xl font-bold mt-4 mb-2">Filter</h2>
      <div className="">
        <p className="pb-1">Filter By Type</p>
        <select
          className="w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-transparent"
          name="type"
          id="type"
          onChange={(e) => setTypeFilter(toInteger(e.target.value))}
        >
          <option value="All">All</option>
          <option value="Assignment">Assignment</option>
          <option value="Quiz">Quiz</option>
          <option value="Project">Project</option>
          <option value="Exam">Exam</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="mt-2">
        <p className="pb-1">Filter By Difficulty</p>
        <select
          className="w-full rounded-md border-zinc-300 dark:border-zinc-700 bg-transparent"
          name="difficulty"
          id="difficulty"
          onChange={(e) => setDifficultyFilter(toInteger(e.target.value))}
        >
          <option value="0">All</option>
          <option value="1">Easy</option>
          <option value="2">Medium</option>
          <option value="3">Normal</option>
          <option value="4">Challenging</option>
          <option value="5">Hard</option>
        </select>
      </div>
    </div>
  );
};

export default connect(null, {
  sortAssignmentsByDueDate,
  sortAssignmentsByDifficulty,
  sortAssignmentsByType,
})(CanvasSidebar);
