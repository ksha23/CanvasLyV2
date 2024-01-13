import React from 'react';
import ReactLoading from 'react-loading';

function Loader() {
  return (
    <div className="flex justify-center items-center">
      <ReactLoading type={'cylon'} color={'#3d8eeb'} width={150} height={150} />
    </div>
  );
}

export default Loader;
