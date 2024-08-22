import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { StudentProvider } from './components/student/context/studentContext';

// import { BrowserRouter as Router } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StudentProvider>
      <App />
    </StudentProvider>
    
  </React.StrictMode>,
  
);


