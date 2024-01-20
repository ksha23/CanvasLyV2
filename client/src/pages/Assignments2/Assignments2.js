import React, { useState } from 'react';
import Layout from '../../layout/Layout';
import AssignmentList from '../../components/AssignmentList2/AssignmentList';
const Assignments2 = () => {
  return (
    <Layout>
      <div className="w-full p-10">
        <div className="flex justify-center">
          <p className="text-black dark:text-white text-4xl font-bold mr-4">Assignments</p>
        </div>
        <div className="flex justify-center w-full">
          <AssignmentList />
        </div>
      </div>
    </Layout>
  );
};

export default Assignments2;
