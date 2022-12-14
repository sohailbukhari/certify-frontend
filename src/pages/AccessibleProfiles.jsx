import React, { useEffect, useState } from 'react';
import { ArrowDownTrayIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';

import Loader from '../components/Loader';

import http from '../utils/http';

const AccessibleProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUnlockedProfiles = async () => {
    setLoading(true);
    try {
      const res = await http.get('/profiles/unlocked');
      setProfiles(res.data.data);
    } catch (err) {}
    setLoading(false);
  };

  const onDownload = (link) => {
    window.open(link);
  };

  useEffect(() => {
    getUnlockedProfiles();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className='border-t border-gray-200'>
      <div class='overflow-x-auto relative shadow-md sm:rounded-lg'>
        <table class='w-full text-sm text-left text-gray-500'>
          <thead class='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th scope='col' class='py-3 px-6'>
                Image
              </th>
              <th scope='col' class='py-3 px-6'>
                Candidate
              </th>
              <th scope='col' class='py-3 px-6'>
                CNIC
              </th>
              <th scope='col' class='py-3 px-6'>
                Phone
              </th>
              <th scope='col' class='py-3 px-6'>
                Resume
              </th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => {
              return (
                <tr class='bg-white border-b hover:bg-gray-50'>
                  <td class='py-4 px-6'>
                    <img data-tooltip-target='tooltip-jese' class='w-10 h-10 rounded' src={profile.image} alt='Profile' />
                  </td>
                  <td class='py-4 px-6'>{profile.name}</td>
                  <td class='py-4 px-6'>{profile.cnic}</td>
                  <td class='py-4 px-6'>{profile.phone}</td>
                  <td class='py-4 px-8 hover:cursor-pointer hover:text-sky-600'>
                    {profile.resume ? <ArrowDownTrayIcon className='w-6 h-6' onClick={() => onDownload(profile.resume)} /> : <ExclamationCircleIcon className='w-6 h-6' />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessibleProfiles;
