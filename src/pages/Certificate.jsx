import { useEffect, Fragment, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InformationCircleIcon, PaperClipIcon, PrinterIcon } from '@heroicons/react/20/solid';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import dayjs from 'dayjs';

import Loader from '../components/Loader';

import http from '../utils/http';

import NotFound from '../assets/not_found.svg';
import { toast } from 'react-toastify';

export default function Certificates() {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [certificates, setCertificates] = useState([]);

  const getCertificates = async () => {
    setLoading(true);
    try {
      const res = await http.get('/certificates');
      setCertificates(res.data.data);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    getCertificates();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
      <ListingPopup open={open} setOpen={setOpen} />
      <div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
        <div>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>Certificates</h3>
          <p className='mt-1 max-w-2xl text-sm text-gray-500'>Summary</p>
        </div>
        <div className='px-3'>
          <button
            onClick={() => {
              setOpen(true);
            }}
            className='border px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700'>
            List Your Profile
          </button>
        </div>
      </div>
      {certificates.length ? (
        <div className='border-t border-gray-200'>
          <div class='overflow-x-auto relative shadow-md sm:rounded-lg'>
            <table class='w-full text-sm text-left text-gray-500'>
              <thead class='text-xs text-gray-700 uppercase bg-gray-50'>
                <tr>
                  <th scope='col' class='py-3 px-6'>
                    Category
                  </th>
                  <th scope='col' class='py-3 px-6'>
                    Score
                  </th>
                  <th scope='col' class='py-3 px-6'>
                    Expire On
                  </th>
                  <th scope='col' class='py-3 px-6'>
                    Status
                  </th>
                  <th scope='col' class='py-3 px-6'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {certificates.reverse().map((certificate) => {
                  return (
                    <tr class='bg-white border-b hover:bg-gray-50'>
                      <th scope='row' class='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'>
                        {certificate.category.replace('-', ' ').toUpperCase()}
                      </th>
                      <td class='py-4 px-6'>{certificate.test.score} %</td>
                      <td class='py-4 px-6'>{dayjs(certificate.expiry).format('MMM D, YYYY h:mm A	')}</td>
                      <td class='py-4 px-6'>{certificate.is_expired ? 'Expired' : 'Active'}</td>
                      <td class='py-4 px-8 hover:cursor-pointer hover:text-sky-600'>
                        <PrinterIcon className='w-6 h-6' />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center bg-gray-50'>
          <img className='h-80 w-80' src={NotFound} alt='No Certificates' />
          <div className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl space-y-1'>No Record</div>
          <div className='mt-10 w-full px-10'>
            <StartTest />
          </div>
        </div>
      )}
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

function ListingPopup({ open, setOpen }) {
  const cancelButtonRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');

  const getCategories = async () => {
    try {
      const res = await http.get('/categories');
      setCategories(res.data.data);
    } catch (err) {}
  };

  const applyForListing = async () => {
    try {
      const res = await http.post('/listings', { category });
      toast.success('Profile listed successfully');
    } catch (err) {
      toast.error(err.response.data.message);
    }

    setOpen(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child as={Fragment} enter='ease-out duration-300' enterFrom='opacity-0' enterTo='opacity-100' leave='ease-in duration-200' leaveFrom='opacity-100' leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                  <div className='sm:flex sm:items-start'>
                    <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 sm:mx-0 sm:h-10 sm:w-10'>
                      <InformationCircleIcon className='h-6 w-6 text-sky-600' aria-hidden='true' />
                    </div>
                    <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                      <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                        List Profile
                      </Dialog.Title>
                      <div className='mt-2'>
                        <p className='text-sm text-gray-500'>Are you sure you want to list your profile? All of your data will be shared with organisation</p>

                        <p className='mt-4 max-w-2xl text-sm text-gray-500 font-bold'>Select your Skill Category</p>
                        <select
                          className='mt-4 border px-3 py-2 rounded-md'
                          value={category}
                          onChange={(e) => {
                            setCategory(e.target.value);
                          }}>
                          <option value={''}> Select Category</option>
                          {categories.map((category, key) => {
                            return (
                              <option key={key} value={category.handle}>
                                {category.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                  <button
                    type='button'
                    className='inline-flex w-full justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'
                    onClick={applyForListing}
                    disabled={category === '' ? true : false}>
                    Submit
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
