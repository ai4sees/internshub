import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const StudentContext = createContext();

// Custom hook for accessing the context
export const useStudent = () => useContext(StudentContext);

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:4000/student/details', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // console.log(response.data);
          setStudent(response.data);
        } catch (error) {
          console.error('Error fetching student data:', error);
          // Optionally handle errors (e.g., logout user)
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <StudentContext.Provider value={student}>
      {children}
    </StudentContext.Provider>
  );
};
