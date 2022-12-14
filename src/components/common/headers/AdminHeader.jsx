import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import * as Storage from '../../../utils/storage';

const navigation = [
  { name: 'Dashboard', to: '/dashboard' },
  { name: 'Certificates', to: '/dashboard/certificates', role: 'applicant' },
  { name: 'Listing', to: '/dashboard/listing', role: 'hirer' },
  { name: 'Accessible Profiles', to: '/dashboard/accessible-profiles', role: 'hirer' },
];
const userNavigation = [{ name: 'Settings', to: '/dashboard/setting' }];

const defaultImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const userStorage = Storage.getUser();

  const user = {
    name: '',
    email: userStorage ? userStorage.email : '',
    imageUrl: defaultImage,
  };

  const logout = () => {
    Storage.clearAll();
    navigate('/login');
  };

  return (
    <Disclosure as='nav' className='bg-sky-800'>
      {({ open }) => (
        <>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='flex h-16 items-center justify-between'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <img className='h-9 w-9' src='/certify.svg' alt='Certify' />
                </div>
                <div className='hidden md:block'>
                  <div className='ml-10 flex items-baseline space-x-4'>
                    {navigation.map((item) => {
                      const current = item.to === location.pathname;
                      const display = item.role && userStorage.role === item.role;
                      if (item.role && !display) return;

                      return (
                        <Link
                          key={item.name}
                          to={item.to}
                          className={classNames(current ? 'bg-sky-900 text-white' : 'text-gray-300 hover:bg-sky-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium')}>
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className='hidden md:block'>
                <div className='ml-4 flex items-center md:ml-6'>
                  <button
                    type='button'
                    className='rounded-full bg-sky-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-800'>
                    <span className='sr-only'>View notifications</span>
                    <BellIcon className='h-6 w-6' aria-hidden='true' />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as='div' className='relative ml-3'>
                    <div>
                      <Menu.Button className='flex max-w-xs items-center rounded-full bg-sky-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-800'>
                        <span className='sr-only'>Open user menu</span>
                        <img className='h-8 w-8 rounded-full' src={user.imageUrl} alt='' />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter='transition ease-out duration-100'
                      enterFrom='transform opacity-0 scale-95'
                      enterTo='transform opacity-100 scale-100'
                      leave='transition ease-in duration-75'
                      leaveFrom='transform opacity-100 scale-100'
                      leaveTo='transform opacity-0 scale-95'>
                      <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                        {userNavigation.map((item) => {
                          return (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link to={item.to} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          );
                        })}

                        <Menu.Item>
                          {({ active }) => (
                            <button onClick={logout} className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-start text-gray-700 w-full')}>
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
              <div className='-mr-2 flex md:hidden'>
                {/* Mobile menu button */}
                <Disclosure.Button className='inline-flex items-center justify-center rounded-md bg-sky-800 p-2 text-sky-400 hover:bg-sky-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-800 focus:ring-offset-2 focus:ring-offset-sky-800'>
                  <span className='sr-only'>Open main menu</span>
                  {open ? <XMarkIcon className='block h-6 w-6' aria-hidden='true' /> : <Bars3Icon className='block h-6 w-6' aria-hidden='true' />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className='md:hidden'>
            <div className='space-y-1 px-2 pt-2 pb-3 sm:px-3'>
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as='a'
                  href={item.to}
                  className={classNames(item.current ? 'bg-sky-900 text-white' : 'text-gray-300 hover:bg-sky-700 hover:text-white', 'block px-3 py-2 rounded-md text-base font-medium')}
                  aria-current={item.current ? 'page' : undefined}>
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className='border-t border-sky-700 pt-4 pb-3'>
              <div className='flex items-center px-5'>
                <div className='flex-shrink-0'>
                  <img className='h-10 w-10 rounded-full' src={user.imageUrl} alt='' />
                </div>
                <div className='ml-3 space-y-2'>
                  <div className='text-base font-medium leading-none text-white'>{user.name}</div>
                  <div className='text-sm font-medium leading-none text-gray-400'>{user.email}</div>
                </div>
                <button
                  type='button'
                  className='ml-auto flex-shrink-0 rounded-full bg-sky-800 p-1 text-sky-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-800'>
                  <span className='sr-only'>View notifications</span>
                  <BellIcon className='h-6 w-6' aria-hidden='true' />
                </button>
              </div>
              <div className='mt-3 space-y-1 px-2'>
                {userNavigation.map((item) => (
                  <Disclosure.Button key={item.name} as='a' href={item.to} className='block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>
                    {item.name}
                  </Disclosure.Button>
                ))}
                <Disclosure.Button key={'Sign out'} className='block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
