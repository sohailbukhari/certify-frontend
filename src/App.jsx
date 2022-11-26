import { useLocation } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import ForgotPassword from './pages/auth/ForgotPassword';

import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import Setting from './pages/Setting';
import Exam from './pages/Exam';
import Error404 from './pages/Error404';
import Certificate from './pages/Certificate';

import { getAccessToken } from './utils/storage';

function RequireAuth({ children }) {
  let location = useLocation();
  const accessToken = getAccessToken();

  if (!accessToken) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
}

function RequireNoAuth({ children }) {
  let location = useLocation();
  const accessToken = getAccessToken();

  if (accessToken) {
    return <Navigate to='/dashboard' state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route
        path='/login'
        element={
          <RequireNoAuth>
            <Login />
          </RequireNoAuth>
        }
      />
      <Route
        path='/register'
        element={
          <RequireNoAuth>
            <Register />
          </RequireNoAuth>
        }
      />
      <Route
        path='/forgot-password'
        element={
          <RequireNoAuth>
            <ForgotPassword />
          </RequireNoAuth>
        }
      />
      <Route
        path='/dashboard'
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }>
        <Route path='' element={<Dashboard />} />
        <Route path='setting' element={<Setting />} />
        <Route path='exam' element={<Exam />} />
        <Route path='certificates' element={<Certificate />} />
        <Route path='*' element={<Error404 />} />
      </Route>

      <Route path='*' element={<Navigate to={'/'} />} />
    </Routes>
  );
}

export default App;
