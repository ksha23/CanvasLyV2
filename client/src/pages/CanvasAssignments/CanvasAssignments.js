import React from 'react';
import Layout from '../../layout/Layout';
import CanvasList from '../../components/CanvasList/CanvasList';
const CanvasAssignments = () => {
  return (
    <Layout>
      <div className="w-full p-8 md:p-10 pt-2 md:pt-5">
        <div className="flex justify-center w-full">
          <p className="text-black dark:text-white text-3xl font-bold">Assignments</p>
        </div>
        <div className="flex justify-center w-full">
          <CanvasList />
        </div>
      </div>
    </Layout>
  );
};

export default CanvasAssignments;
