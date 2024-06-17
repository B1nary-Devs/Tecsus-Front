import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import RoutesApp from './routes/index.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  useEffect(() => {
    document.title = "B1nary Devs";
  }, []);
  return (
      <RoutesApp/> 
  );
}

export default App;