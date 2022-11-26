const USER_TOKEN = 'x-access-token';
const USER = 'x-user';
const PROFILE = 'x-profile';

export const getAccessToken = () => localStorage.getItem(USER_TOKEN);
export const setAccessToken = (token) => localStorage.setItem(USER_TOKEN, token);
export const clearAccessToken = () => localStorage.removeItem(USER_TOKEN);

export const getUser = () => {
  let user = localStorage.getItem(USER);
  if (user) user = JSON.parse(user);
  return user;
};

export const setUser = (obj) => localStorage.setItem(USER, JSON.stringify(obj));
export const clearUser = () => localStorage.removeItem(USER);

export const getProfile = () => {
  let profile = localStorage.getItem(PROFILE);
  if (profile) profile = JSON.parse(profile);
  return profile;
};

export const setProfile = (obj) => localStorage.setItem(PROFILE, JSON.stringify(obj));
export const clearProfile = () => localStorage.removeItem(PROFILE);

export const clearAll = () => localStorage.clear();
