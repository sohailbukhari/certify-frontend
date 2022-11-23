import { useLocation } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import ForgotPassword from './pages/auth/ForgotPassword';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';

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
    <>
      <Routes>
        <Route path='/' element={<PublicPage />} />
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
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

function PublicPage() {
  return <div>Landing Home Page</div>;
}

export default App;
