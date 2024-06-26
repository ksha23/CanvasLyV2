import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <footer className="hidden md:block py-4 px-4 bg-slate-200 dark:bg-slate-800 bottom-0 w-full">
        <div className="mx-auto flex justify-center items-center">
          <p className="text-sm dark:text-slate-200">
            &copy; {new Date().getFullYear()} CanvasLy. All rights reserved.
          </p>
          <Link to="/privacy" className="ml-4 text-sm text-blue-600">
            Privacy Policy
          </Link>
        </div>
      </footer>
      <div className="py-10 md:hidden"></div>
    </>
  );
};

export default Footer;
