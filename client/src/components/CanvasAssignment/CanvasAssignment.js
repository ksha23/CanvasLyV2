import React from 'react';
import axios from 'axios';

const CanvasAssignment = ({ assignment }) => {
  async function markDone(assignment) {
    axios.put('api/canvas/complete/' + assignment._id);
  }

  async function confirmComplete(assignment) {
    if (window.confirm('Are you sure you want to mark this assignment as complete?')) {
      axios.put('api/canvas/confirm/' + assignment._id);
    }
  }
  return (
    <div
      className={`mb-2 p-5 border border-zinc-500 rounded-md ${
        assignment.completed && 'text-zinc-400 dark:text-zinc-600'
      }`}
    >
      <a href={assignment.link} target="_blank" rel="noreferrer">
        <p className={`font-bold text-lg underline ${assignment.isQuiz && 'text-blue-600'}`}>
          {assignment.name}
        </p>
      </a>
      <p>
        <strong>Due: </strong>
        {assignment.dueDate != 'Unspecified'
          ? new Date(assignment.dueDate).toLocaleString()
          : 'Unspecified'}
      </p>
      {assignment.description && (
        <p>
          <strong>Description: </strong>
          {assignment.description}
        </p>
      )}
      <p>
        <strong>Type: </strong>
        {assignment.type}
      </p>
      <p>
        <strong>Points:</strong> {assignment.pointsPossible}
      </p>
      <p>
        <strong>Difficulty</strong> {assignment.difficulty}
      </p>
      <button
        className="bg-green-600 text-white px-3 py-2 mt-2 rounded-md"
        onClick={() => markDone(assignment)}
      >
        {assignment.completed ? 'Incomplete' : 'Complete'}
      </button>

      {assignment.completed && (
        <button
          className="bg-blue-600 text-white px-3 py-2 mt-2 ml-2 rounded-md"
          onClick={() => confirmComplete(assignment)}
        >
          Confirm
        </button>
      )}
    </div>
  );
};

export default CanvasAssignment;
