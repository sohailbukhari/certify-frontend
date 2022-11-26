import React, { useEffect, Fragment, useRef, useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/20/solid';
import { Dialog, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

import Loader from '../components/Loader';

import http from '../utils/http';

const Listing = () => {
  const [listing, setListing] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [listingId, setListingId] = useState(null);

  const [open, setOpen] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const [listingRes, profileRes] = await Promise.allSettled([http.get('/listings'), http.get('/profiles/me')]);

      if (listingRes.status === 'fulfilled') {
        setListing(listingRes.value.data.data);
      }

      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value.data.data);
      }
    } catch (err) {}
    setLoading(false);
  };

  const getListing = async () => {
    setLoading(true);
    try {
      const res = await http.get('/listings');
      setListing(res.data.data);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
      <BidPopup open={open} setOpen={setOpen} profile={profile} listingId={listingId} getListing={getListing} />
      <div className='flex justify-between items-center'>
        <div className='px-4 py-5 sm:px-6'>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>Listing Area</h3>
          <p className='mt-1 max-w-2xl text-sm text-gray-500'>Start Bidding to reveal candidate in your accessible profile section</p>
        </div>
        <div className='px-6 text-center space-y-1'>
          <h2 className='text-lg font-bold border-b'>Rs {profile && profile.balance}</h2>
          <p className='text-sm'>Wallet Balance</p>
        </div>
      </div>

      <div className='border-t border-gray-200'>
        <div className='overflow-x-auto relative shadow-md sm:rounded-lg'>
          <table className='w-full text-sm text-left text-gray-500'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
              <tr>
                <th scope='col' className='py-3 px-6'>
                  Candidate
                </th>
                <th scope='col' className='py-3 px-6'>
                  Category
                </th>
                <th scope='col' className='py-3 px-6'>
                  Score
                </th>
                <th scope='col' className='py-3 px-6'>
                  End On
                </th>
                <th scope='col' className='py-3 px-6'>
                  Active Bidder
                </th>
                <th scope='col' className='py-3 px-6'>
                  Active Bid Amount
                </th>
                <th scope='col' className='py-3 px-6'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {listing.map((doc) => {
                console.log(doc);

                return (
                  <tr className='bg-white border-b hover:bg-gray-50'>
                    <th scope='row' className='py-4 px-6 font-medium text-gray-900 whitespace-nowrap'>
                      <div className='p-3 rounded-full bg-sky-100 max-w-max'>
                        <UserCircleIcon className='w-10 h-10 text-sky-500' />
                      </div>
                    </th>
                    <td className='py-4 px-6'> {doc.category.replace('-', ' ').toUpperCase()}</td>
                    <td className='py-4 px-6'> {doc.score}</td>
                    <td className='py-4 px-6'>{dayjs(doc.expiry).format('MMM D, YYYY h:mm A	')}</td>
                    <td className='py-4 px-6'> {doc.bidder ? (doc.bidder === profile._id ? 'You' : 'Someone') : 'N/A'}</td>
                    <td className='py-4 px-6'> {doc.amount}</td>

                    <td className='py-4 px-6'>
                      <button
                        onClick={() => {
                          setOpen(true);
                          setListingId(doc._id);
                        }}
                        className='border px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700'
                        type='submit'>
                        Submit Bid
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Listing;

function BidPopup({ open, setOpen, profile, listingId, getListing }) {
  const cancelButtonRef = useRef(null);
  const [amount, setAmount] = useState(0);

  const onChange = (e) => setAmount(e.target.value);

  const bidAmount = async () => {
    if (amount <= 0) return;

    try {
      await http.post(`/listings/${listingId}/bid`, { amount });
      setOpen(false);
      toast.success('Profile bidding successfully');
      getListing();
    } catch (err) {
      toast.error(err.response.data.message);
    }

    setOpen(false);
  };

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
                        Submit Bid Amount
                      </Dialog.Title>
                      <div className='mt-2'>
                        <p className='text-sm text-gray-500'>
                          The Amount will be <strong>deducted from your balance</strong> once the <strong>listing expire</strong> for the profile and it will get available in your{' '}
                          <strong>Accessible Profiles</strong> section.
                        </p>
                        <p className='text-red-500 text-sm mt-2'>
                          <span className='font-bold'>Note:</span> You are low on balance.
                        </p>

                        <input type='number' className='mt-2 appearance-none	border py-2 px-3 rounded-lg' placeholder='Amount' name='amount' onChange={onChange} value={amount} required />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                  <button
                    onClick={bidAmount}
                    className='inline-flex w-full justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'>
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
