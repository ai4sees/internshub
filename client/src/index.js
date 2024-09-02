import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { StudentProvider } from './components/student/context/studentContext';
import { RecruiterProvider } from './components/recruiter/context/recruiterContext';

// import { BrowserRouter as Router } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RecruiterProvider>
    <StudentProvider>
      <React.StrictMode>
          <App />
          </React.StrictMode>
    </StudentProvider>
    </RecruiterProvider>
    
  
  
);


