import React, { useState, useEffect } from 'react';

export const DateTime = () => {
  var [date, setDate] = useState(new Date());

  useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  return (
    <div>
      <p className="font-semibold text-2xl text-zinc-700 dark:text-zinc-300">
        {date.toLocaleDateString()} {' at '}
        {date.toLocaleTimeString()}
      </p>
    </div>
  );
};

export default DateTime;
