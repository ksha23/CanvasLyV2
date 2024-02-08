import React from 'react';

import requireAdmin from '../../hoc/requireAdmin';
import Layout from '../../layout/Layout';

// const getFiles = async () => {
//   const response = await fetch('/api/fileadmin/');
//   const data = await response.json();
//   console.log(data);
// };

const Admin = () => {
  return (
    <Layout>
      <div className="dark:text-white">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p>Only admins can see this page!</p>
      </div>
    </Layout>
  );
};

export default requireAdmin(Admin);
