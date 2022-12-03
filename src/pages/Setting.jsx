import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { PaperClipIcon } from '@heroicons/react/20/solid';

import http from '../utils/http';
import * as Storage from '../utils/storage';

import Loader from '../components/Loader';

const defaultImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

export default function Setting() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  const [passwords, setPasswords] = useState({});

  const [amount, setAmount] = useState(0);

  const user = Storage.getUser();

  const getProfile = async () => {
    setLoading(true);
    try {
      const res = await http.get('/profiles/me');
      setProfile(res.data.data);
      setLoading(false);
    } catch (err) {
      toast.error('Oops! Something went wrong');
    }
  };

  const onProfileSubmit = async (values) => {
    setLoading(true);
    delete values.image;
    try {
      const res = await http.put('/profiles', values);
      setProfile(res.data.data);
      toast.success('Profile information updated');
    } catch (err) {
      toast.error('Oops! Something went wrong');
    }
    setLoading(false);
  };

  const onPasswordSubmit = async (values) => {
    setLoading(true);
    try {
      await http.put('/users/change-password', values);
      setPasswords({});
      toast.success('Password changed successfully');
    } catch (err) {
      console.log(err);
      if (err.response.status == 400) {
        toast.error('Password incorrect');
      } else toast.error('Oops! Something went wrong');
    }
    setLoading(false);
  };

  const addBalance = async () => {
    try {
      await http.post('/profiles/topup', { amount });
      toast.success('Balance added successfully');
      getProfile();
    } catch (err) {
      toast.error('Oops! Something went wrong');
    }
  };

  const changeBalanceAmount = (e) => setAmount(e.target.value);

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (profile) Storage.setProfile(profile);
  }, [profile]);

  if (loading) return <Loader />;

  return (
    <div className='space-y-4'>
      <Formik initialValues={profile} onSubmit={onProfileSubmit}>
        <Form>
          <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
            <div className='flex justify-between items-center'>
              <div className='px-4 py-5 sm:px-6'>
                <h3 className='text-lg font-medium leading-6 text-gray-900'>Setting</h3>
                <p className='mt-1 max-w-2xl text-sm text-gray-500'>Your Profile Summary</p>
              </div>
              <div className='px-3'>
                <button className='border px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700' type='submit'>
                  Update
                </button>
              </div>
            </div>

            <div className='border-t border-gray-200'>
              <dl>
                <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>Name</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                    <Field type='text' className='appearance-none	border py-2 px-3 rounded-lg' placeholder='Full Name' name='name' required />
                  </dd>
                </div>
                <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>National Identity Number</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                    <Field type='text' className='appearance-none	border py-2 px-3 rounded-lg' placeholder='CNIC' name='cnic' required />
                  </dd>
                </div>
                <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>Email address</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>{user.email}</dd>
                </div>
                <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>Phone Number</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                    <Field type='text' className='appearance-none	border py-2 px-3 rounded-lg' placeholder='Phone Number' name='phone' required />
                  </dd>
                </div>
                <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>About</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                    <Field type='text' className='appearance-none	border py-2 px-3 rounded-lg' placeholder='About' name='bio' required />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Form>
      </Formik>

      <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
        <div className='flex justify-between items-center'>
          <div className='px-4 py-5 sm:px-6'>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Balance</h3>
            <p className='mt-2 max-w-2xl text-sm text-gray-500'>Rs. {profile.balance}</p>
          </div>
          <div className='px-3'>
            <button onClick={addBalance} className='border px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700' type='submit'>
              Add Balance
            </button>
          </div>
        </div>

        <div className='border-t border-gray-200'>
          <dl>
            <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>Amount</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                <input type='number' value={amount} onChange={changeBalanceAmount} className='appearance-none	border py-2 px-3 rounded-lg' placeholder='Amount' name='amount' required />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <UploadProfile profile={profile} />

      <Formik initialValues={passwords} onSubmit={onPasswordSubmit}>
        <Form>
          <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
            <div className='flex justify-between items-center'>
              <div className='px-4 py-5 sm:px-6'>
                <h3 className='text-lg font-medium leading-6 text-gray-900'>Update Password</h3>
              </div>
              <div className='px-3'>
                <button className='border px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700' type='submit'>
                  Change Password
                </button>
              </div>
            </div>

            <div className='border-t border-gray-200'>
              <dl>
                <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>Old Password</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                    <Field type='password' className='appearance-none	border py-2 px-3 rounded-lg' placeholder='Old Password' name='password' required />
                  </dd>
                </div>
                <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                  <dt className='text-sm font-medium text-gray-500'>New Password</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                    <Field name='new_password' type='password' autoComplete='new-password' minlength='8' className='appearance-none	border py-2 px-3 rounded-lg' placeholder='New Password' required />
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

function UploadProfile({ profile }) {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState(profile && profile.image);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    if (!file) return toast.warning('choose image to upload first');

    toast.info('Image uploading...');

    try {
      const form = new FormData();
      form.append('image', file);

      const res = await http.put('/profiles/upload-profile-image', form);
      setLink(res.data.data.image);

      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Oops, error uploading');
    }
  };

  return (
    <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
      <div className='flex justify-between items-center'>
        <div className='px-4 py-5 sm:px-6'>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>Update Profile Picture</h3>
        </div>
        <div className='px-3'>
          <button onClick={onUpload} className='border px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700' type='submit'>
            Upload
          </button>
        </div>
      </div>

      <div className='border-t border-gray-200'>
        <dl>
          <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500 flex space-x-4 items-center'>
              <div> Profile</div>
              <div>
                <div
                  id='tooltip-jese'
                  role='tooltip'
                  class='inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700'>
                  Name
                  <div class='tooltip-arrow' data-popper-arrow></div>
                </div>
                <img data-tooltip-target='tooltip-jese' class='w-10 h-10 rounded' src={link ? link : defaultImage} alt='Medium avatar' />
              </div>
            </dt>
            <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
              <div className='w-60'>
                <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white' htmlFor='file_input'>
                  Upload Picture
                </label>
                <input className='block w-full text-sm text-gray-900  rounded-lg cursor-pointer ' aria-describedby='file_input_help' id='file_input' type='file' onChange={onFileChange} />
                <p className='mt-1 text-sm text-gray-400' id='file_input_help'>
                  JPG JPEG or PNG
                </p>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
