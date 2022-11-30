import { useEffect, useState } from 'react';

import http from '../utils/http';

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    getProfile();
  }, []);

  return [profile, getProfile, loading];
};

export default useProfile;
