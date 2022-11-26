import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaperClipIcon, PrinterIcon } from '@heroicons/react/20/solid';

import dayjs from 'dayjs';

import Loader from '../components/Loader';

import http from '../utils/http';

import NotFound from '../assets/not_found.svg';

export default function Certificates() {
  const [loading, setLoading] = useState(true);
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
      <div className='px-4 py-5 sm:px-6'>
        <h3 className='text-lg font-medium leading-6 text-gray-900'>Certificates</h3>
        <p className='mt-1 max-w-2xl text-sm text-gray-500'>Summary</p>
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
