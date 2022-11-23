import { Formik, Field, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LockClosedIcon } from '@heroicons/react/20/solid';

import http from '../../utils/http';

import { setAccessToken, setUser } from '../../utils/storage';

const initialValues = {
  email: '',
  password: '',
};

export default function Login() {
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const res = await http.post('/users/login', values);
      const data = res.data.data;
      setAccessToken(data.access_token);
      setUser(data);
      navigate('/dashboard');
      toast.success('Login successful');
    } catch (err) {
      if (err.response.status === 401) {
        toast.error('Invalid email or password');
      } else toast.error('Oops! Something went wrong');
    }
  };

  return (
    <>
      <div className='flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-8'>
          <div>
            <img className='mx-auto h-24 w-auto' src='/certify.svg' alt='Your Company' />
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>Sign in to your account</h2>
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
                    className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm'
                    placeholder='Email address'
                  />
                </div>
                <div>
                  <label htmlFor='password' className='sr-only'>
                    Password
                  </label>
                  <Field
                    id='password'
                    name='password'
                    type='password'
                    autoComplete='current-password'
                    required
                    className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm'
                    placeholder='Password'
                  />
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input id='remember-me' name='remember-me' type='checkbox' className='h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500' />
                  <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
                    Remember me
                  </label>
                </div>

                <div className='text-sm'>
                  <Link to='/forgot-password' className='font-medium text-sky-600 hover:text-sky-500'>
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  className='group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'>
                  <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
                    <LockClosedIcon className='h-5 w-5 text-sky-500 group-hover:text-sky-400' aria-hidden='true' />
                  </span>
                  Sign in
                </button>
              </div>
              <div className='text-sm text-center'>
                Don't have an account?{' '}
                <Link to='/register' className='font-medium text-sky-600 hover:text-sky-500'>
                  Register Now
                </Link>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
}
