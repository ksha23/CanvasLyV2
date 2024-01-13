import React from 'react';
import { Link } from 'react-router-dom';

import Layout from '../../layout/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center p-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
            Oops! This Page Could Not Be Found
          </h1>
          <Link className="text-purple-600 dark:text-purple-400" to="/">
            Go Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
