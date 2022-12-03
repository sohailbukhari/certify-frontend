import { getProfile } from './storage';

export const isProfileComplete = () => {
  const profile = getProfile();

  if (!profile.name || profile.name === '') return false;
  if (!profile.cnic || profile.cnic === '') return false;
  if (!profile.phone || profile.phone === '') return false;

  return true;
};
