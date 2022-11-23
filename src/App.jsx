import { useLocation } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import ForgotPassword from './pages/auth/ForgotPassword';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function RequireAuth({ children }) {
  const logged_in = false;

  let location = useLocation();

  if (!logged_in) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<PublicPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
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

function Dashboard() {
  return <div>Dashboard Page</div>;
}

function PublicPage() {
  return <div>Landing Home Page</div>;
}

export default App;
