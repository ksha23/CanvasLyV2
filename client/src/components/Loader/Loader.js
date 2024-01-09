// import React from 'react';

// import './styles.css';

// const Loader = (props) => {
//   return (
//     <div className="loader-container loader" {...props}>
//       <h3 className="loader-content">Loading...</h3>
//     </div>
//   );
// };

// export default Loader;

// balls, bars, bubbles, cubes, cylon, spin, spokes

import React from 'react';
import ReactLoading from 'react-loading';
import './styles.css';

function Loader() {
  return (
    <div className="loader-container">
      <ReactLoading type={'cylon'} color={'#3d8eeb'} width={150} height={150} />
    </div>
  );
}

export default Loader;
