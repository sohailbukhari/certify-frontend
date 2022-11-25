import React from "react";
import AdminHeader from "../components/common/headers/AdminHeader";
import Settings from "../components/Settings";
const Userrofile = () => {
  return (
    <div className="min-h-full">
      <AdminHeader />
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Profile
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="px-4 py-6 sm:px-0">
            <div className="h-96 rounded-lg border-4 border-dashed border-gray-200 items-center">
              <div className="justify-center">
                <Settings />
              </div>
            </div>
            {/* /End replace */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Userrofile;
