import React from 'react';
import ReactLoading from 'react-loading';

function Loader({ width, height }) {
  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <ReactLoading type={'spin'} color={'#3d8eeb'} width={width || 100} height={height || 100} />
    </div>
  );
}

export default Loader;
