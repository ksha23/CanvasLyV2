import React from 'react';
import { Link } from 'react-router-dom';

import Layout from '../../layout/Layout';
import './styles.css';

const NotFound = () => {
  return (
    <Layout>
      <div className="not-found-page">
        <h1>Oops! This page doesn't exist</h1>
        <p>
          Go back to{' '}
          <Link className="bold" to="/">
            Home
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default NotFound;
