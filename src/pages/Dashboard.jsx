import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import useProfile from '../hooks/useProfile';
import http from '../utils/http';

import * as Storage from '../utils/storage';

const Dashboard = () => {
  const user = Storage.getUser();

  const [profile, getProfile, loading] = useProfile();

  if (loading) return <Loader />;

  if (user.role === 'hirer')
    return (
      <div className='px-4 py-6 sm:px-0'>
        <StartBidding />
      </div>
    );

  return (
    <div className='px-4 py-6 sm:px-0'>
      <UploadResume profile={profile} />
      <StartTest />
    </div>
  );
};

export default Dashboard;

function UploadResume({ profile }) {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState(profile && profile.resume);

  const onDownload = () => {
    window.open(link);
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    if (!file) return toast.warning('choose file to upload first');

    toast.info('File uploading...');

    try {
      const form = new FormData();
      form.append('file', file);

      const res = await http.put('/profiles/upload-resume', form);
      setLink(res.data.data.resume);

      toast.success('File uploaded successfully');
    } catch (err) {
      toast.error('Oops, error uploading');
    }
  };

  return (
    <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
      <div className='flex justify-between items-center'>
        <div className='px-4 py-5 sm:px-6'>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>Upload Resume</h3>
          <div className='w-60'>
            <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor='file_input'>
              Upload Resume
            </label>
            <input className='block w-full text-sm text-gray-900  rounded-lg cursor-pointer ' aria-describedby='file_input_help' id='file_input' type='file' onChange={onFileChange} />
            <p className='mt-1 text-sm text-gray-400' id='file_input_help'>
              DOC, DOCX or PDF.
            </p>
          </div>
        </div>

        <div className='px-3'>
          {link && (
            <button onClick={onDownload} className='border px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700' type='submit'>
              Download
            </button>
          )}
          <button onClick={onUpload} className='border px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700' type='submit'>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

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
