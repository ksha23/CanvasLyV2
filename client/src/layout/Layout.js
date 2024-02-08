import React from 'react';
import PropTypes from 'prop-types';

import Navbar from '../components/Navbar/Navbar';
import MobileNavbar from '../components/Navbar/MobileNavbar';
import Footer from '../components/Footer/Footer';

const Layout = ({ children }) => {
  return (
    <>
      <div className="bg-white min-h-screen dark:bg-black flex flex-col justify-between w-full">
        <Navbar />
        <div className="p-5 md:p-10 md:pt-8 flex justify-center flex-grow">{children}</div>
        <Footer />
        <MobileNavbar />
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
