import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import { PaperClipIcon } from '@heroicons/react/20/solid';

import http from '../utils/http';
import * as Storage from '../utils/storage';

import Loader from '../components/Loader';

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

      {user.role === 'hirer' && (
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
      )}

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
