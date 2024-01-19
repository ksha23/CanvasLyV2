import React from 'react';
import ReactLoading from 'react-loading';

function Loader({ width, height }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <ReactLoading type={'cylon'} color={'#3d8eeb'} width={width || 150} height={height || 150} />
    </div>
  );
}

export default Loader;
