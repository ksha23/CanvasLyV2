import React from 'react';

const HomeComponent = () => {
  return (
    <div className="w-full max-w-4xl mb-8 text-left bg-black text-slate-300 p-10">
      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-bl from-sky-400 to-indigo-800 inline-block text-transparent bg-clip-text">
        Why CanvasLy?
      </h2>
      <ul className="text-left list-disc ml-6 dark:text-slate-300 why-canvasly-list">
        <li className="text-lg">
          Effortlessly manage upcoming assignments, quizzes, projects, and exams
        </li>
        <li className="text-lg">
          Personalize prioritization of assignments based on due date, difficulty, and type
        </li>
        <li className="text-lg">Never miss another assignment again!</li>
      </ul>
    </div>
  );
};

export default HomeComponent;
