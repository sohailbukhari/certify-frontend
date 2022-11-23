import { Formik, Field, Form } from 'formik';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-toastify';

import http from '../../utils/http';
import { Link } from 'react-router-dom';

const initialValues = {
  email: '',
};

export default function ForgotPassword() {
  const onSubmit = async (values) => {
    try {
      await http.post('/users/forgot-password', values);
      toast.success('Email Sent');
    } catch (err) {
      toast.error('Oops! Something went wrong');
    }
  };

  return (
    <>
      <div className='flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-8'>
          <div>
            <img className='mx-auto h-12 w-auto' src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600' alt='Your Company' />
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>Forgot Password?</h2>
          </div>
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            <Form className='mt-8 space-y-6'>
              <input type='hidden' name='remember' defaultValue='true' />
              <div className='-space-y-px rounded-md shadow-sm'>
                <div>
                  <label htmlFor='email-address' className='sr-only'>
                    Email address
                  </label>
                  <Field
                    id='email-address'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                    placeholder='Email address'
                  />
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
                  <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                    <ArrowRightOnRectangleIcon className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400' aria-hidden='true' />
                  </span>
                  Submit
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
}
