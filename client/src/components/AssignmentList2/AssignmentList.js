import React, { useState, useLayoutEffect } from 'react';
import DOMPurify from 'dompurify';
import Loader from '../Loader/Loader';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);

  const setup = async () => {
    const response = await fetch('/api/canvas/assignments');
    const data = await response.json();
    setAssignments(data.assignments);
  };

  useLayoutEffect(() => {
    setup();
  }, []);

  return (
    <div className="justify-center w-full max-w-4xl text-zinc-700 dark:text-zinc-300">
      {!assignments ||
        (assignments.length === 0 && (
          <div>
            <Loader />
          </div>
        ))}

      <div>
        {assignments &&
          assignments.length > 0 &&
          assignments.map((assignmentGroup, index) => {
            return (
              <div className="m-5" key={index}>
                <p className="text-xl font-bold mb-1">{assignmentGroup.course}</p>
                {assignmentGroup.assignments.assignments.map((assignment, index) => {
                  const sanitizedDescription = DOMPurify.sanitize(assignment.description, {
                    ALLOWED_TAGS: ['p', 'span'], // Allow only 'p' and 'span' tags
                    ALLOWED_ATTR: [], // Keep 'style' attribute
                  });
                  return (
                    <div className="mb-2 p-2 border border-zinc-500 rounded-md" key={index}>
                      <p className={`font-bold text-lg ${assignment.isQuiz && 'text-blue-600'}`}>
                        {assignment.name}
                      </p>
                      {assignment.description && <p className="font-semibold">Description:</p>}
                      <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
                      <p>Due: {assignment.dueDate || 'Unsepcified'}</p>
                      <p>Points possible: {assignment.pointsPossible}</p>
                      <a
                        className="underline text-blue-500"
                        href={assignment.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Link to assignment
                      </a>
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AssignmentList;
