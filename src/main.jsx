import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './index.css';
import 'react-toastify/dist/ReactToastify.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <ToastContainer hideProgressBar={true} autoClose={1000} position='bottom-right' />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.Fragment>
);
