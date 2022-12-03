import React from 'react';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
  const navigate = useNavigate();

  return (
    <div className='px-4 py-6 sm:px-0'>
      <div className='h-96 rounded-lg border-4 border-dashed border-gray-200 flex flex-col justify-center items-center'>
        <h1 className='text-3xl text-gray-500'>
          <span className='text-sm '>Must Complete Your Profile</span>
        </h1>
        <button className='border px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700' onClick={() => navigate('/dashboard/setting')}>
          Fill in Detail
        </button>
      </div>
    </div>
  );
};

export default CompleteProfile;
