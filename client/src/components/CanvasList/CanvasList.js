import React, { useState, useLayoutEffect } from 'react';
import Loader from '../Loader/Loader';
import CanvasAssignment from '../CanvasAssignment/CanvasAssignment';

const CanvasList = () => {
  const [assignments, setAssignments] = useState([]);

  const setup = async () => {
    const response = await fetch('/api/canvas/assignments');
    const data = await response.json();
    setAssignments(data.assignments);
    console.log(data);
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
                <p className="text-2xl font-bold mb-1">{assignmentGroup.course}</p>
                {assignmentGroup.assignments.assignments.map((assignment, index) => {
                  if (assignment.completed === false && assignment.confirmedCompleted === false) {
                    return <CanvasAssignment assignment={assignment} key={index} />;
                  } else {
                    return null;
                  }
                })}
                {assignmentGroup.assignments.assignments.map((assignment, index) => {
                  if (assignment.completed === true && assignment.confirmedCompleted === false) {
                    return <CanvasAssignment assignment={assignment} key={index} />;
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

export default CanvasList;
