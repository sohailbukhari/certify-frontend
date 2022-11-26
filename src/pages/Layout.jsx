import React from 'react';
import { Outlet } from 'react-router-dom';

import AdminHeader from '../components/common/headers/AdminHeader';

const Layout = () => {
  return (
    <div className='min-h-full'>
      <AdminHeader />
      <main>
        <div className='mx-auto max-w-7xl py-6 sm:px-6 lg:px-8'>
          {/* Replace with your content */}
          <Outlet />
          {/* /End replace */}
        </div>
      </main>
    </div>
  );
};

export default Layout;
