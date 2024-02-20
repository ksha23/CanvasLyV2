import React from 'react';
import Layout from '../../layout/Layout';
import CanvasList from '../../components/CanvasList/CanvasList';
const CanvasAssignments = () => {
  return (
    <Layout>
      <div className="w-full px-2">
        <div className="flex justify-center w-full">
          <CanvasList />
        </div>
      </div>
    </Layout>
  );
};

export default CanvasAssignments;
