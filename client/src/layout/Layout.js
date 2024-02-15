import React from 'react';
import PropTypes from 'prop-types';

import Navbar from '../components/Navbar/Navbar';
import MobileNavbar from '../components/Navbar/MobileNavbar';
import Footer from '../components/Footer/Footer';
import CourseSelector from '../components/CourseSelector';

const Layout = ({ children }) => {
  const [showSidebar, setShowSidebar] = React.useState(false);

  return (
    <>
      <div className="bg-white min-h-screen dark:bg-slate-950 flex flex-col justify-between w-full">
        <Navbar />
        <div className="p-5 pt-8 md:p-10 md:pt-8 flex justify-center flex-grow">{children}</div>
        <Footer />
        <MobileNavbar setter={setShowSidebar} />
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
