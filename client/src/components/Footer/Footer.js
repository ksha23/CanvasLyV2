import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-4 px-4 bg-zinc-200 dark:bg-zinc-800 bottom-0 w-full">
      <div className="mx-auto flex justify-center items-center">
        <p className="text-sm dark:text-zinc-200">
          &copy; {new Date().getFullYear()} CanvasLy. All rights reserved.
        </p>
        <Link to="/privacy" className="ml-4 text-sm text-violet-600">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
