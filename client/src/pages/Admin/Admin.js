import React from 'react';
import { Link } from 'react-router-dom';

import requireAdmin from '../../hoc/requireAdmin';
import Layout from '../../layout/Layout';

const Admin = () => {
  return (
    <Layout>
      <div className="dark:text-white">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p>
          This is the Admin page. Only the Admin can access this page. Return back to{' '}
          <Link className="bold" to="/">
            Home
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default requireAdmin(Admin);
