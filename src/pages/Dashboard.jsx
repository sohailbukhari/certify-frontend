import React from 'react';
import { useNavigate } from 'react-router-dom';

import * as Storage from '../utils/storage';

const Dashboard = () => {
  const user = Storage.getUser();

  if (user.role === 'hirer')
    return (
      <div className='px-4 py-6 sm:px-0'>
        <StartBidding />
      </div>
    );

  return (
    <div className='px-4 py-6 sm:px-0'>
      <StartTest />
    </div>
  );
};

export default Dashboard;

function StartTest() {
  const navigate = useNavigate();

  const redirect = () => navigate('/dashboard/exam');

  return (
    <div className='bg-gray-50'>
      <div className='mx-auto max-w-7xl py-12 lg:flex lg:items-center lg:justify-between'>
        <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl space-y-1'>
          <span className='block'>Ready to get Certificate?</span>
          <span className='block text-sky-600'>Start your test now</span>
        </h2>
        <div className='mt-8 flex lg:mt-0 lg:flex-shrink-0'>
          <div className='inline-flex rounded-md shadow'>
            <button onClick={redirect} className='inline-flex items-center justify-center rounded-md border border-transparent bg-sky-600 px-5 py-3 text-base font-medium text-white hover:bg-sky-700'>
              Get started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StartBidding() {
  const navigate = useNavigate();

  const redirect = () => navigate('/dashboard/listing');

  return (
    <div className='bg-gray-50'>
      <div className='mx-auto max-w-7xl py-12 lg:flex lg:items-center lg:justify-between'>
        <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl space-y-1'>
          <span className='block'>Ready to acquire new candidates?</span>
          <span className='block text-sky-600'>Start bidding now</span>
        </h2>
        <div className='mt-8 flex lg:mt-0 lg:flex-shrink-0'>
          <div className='inline-flex rounded-md shadow'>
            <button onClick={redirect} className='inline-flex items-center justify-center rounded-md border border-transparent bg-sky-600 px-5 py-3 text-base font-medium text-white hover:bg-sky-700'>
              Get started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
