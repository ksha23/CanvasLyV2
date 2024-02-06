import React from 'react';
import Layout from '../../layout/Layout';
import CanvasList from '../../components/CanvasList/CanvasList';
const CanvasAssignments = () => {
  return (
    <Layout>
      <div className="w-full p-10 pt-5">
        <div className="flex justify-center">
          <p className="text-black dark:text-white text-3xl font-bold mr-4">Assignments</p>
        </div>
        <div className="flex justify-center w-full">
          <CanvasList />
        </div>
      </div>
    </Layout>
  );
};

export default CanvasAssignments;
