const USER_TOKEN = 'x-access-token';

export const getAccessToken = () => localStorage.getItem(USER_TOKEN);
export const setAccessToken = (token) => localStorage.setItem(USER_TOKEN, token);
export const clearAccessToken = () => localStorage.removeItem(USER_TOKEN);
