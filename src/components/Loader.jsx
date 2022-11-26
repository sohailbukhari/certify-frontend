import React from 'react';

const Loader = () => {
  return (
    <div className='w-full h-96 flex justify-center items-center'>
      <img src='/certify.svg' className='w-12 h-12 animate animate-bounce' />
    </div>
  );
};

export default Loader;
