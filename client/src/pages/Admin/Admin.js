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
      <div className="dark:text-white p-10">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      </div>
    </Layout>
  );
};

export default requireAdmin(Admin);
