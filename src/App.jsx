import { Outlet, useLocation } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import ForgotPassword from './pages/auth/ForgotPassword';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Layout from './pages/Layout';
import Error404 from './pages/Error404';
import Setting from './pages/Setting';

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
      <Route path='/dashboard' element={<Layout />}>
        <Route path='' element={<Dashboard />} />
        <Route path='setting' element={<Setting />} />
        <Route path='*' element={<Error404 />} />
      </Route>
    </Routes>
  );
}

export default App;
