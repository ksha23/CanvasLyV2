import React from 'react';

import './styles.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <span className="footer-text">
          © 2024 CanvasLy. All Rights Reserved. <Link to="/privacy">Privacy Policy</Link>
        </span>
        <span className="username"> </span>
      </div>
    </div>
  );
};

export default Footer;
