import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../common/server_url'

// Create the context
const StudentContext = createContext();

// Custom hook for accessing the context
export const useStudent = () => useContext(StudentContext);

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      console.log('Inside useEffect of studentContext');
      if (token) {
        try {
          const response = await axios.get(`${api}/student/details`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if(!response.data.success){
            console.log('Student is not associated with this token');
            return;
          } 

          if(response.data.success){
            console.log('Student Found');
            setStudent(response.data.student);
          }
          
        } catch (error) {
          console.error('Error fetching student data:', error);
          // Optionally handle errors (e.g., logout user)
        }
      }
      else console.log('there is no token');
    };

    fetchUserData();
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null); // Clear token to trigger refetch
  };

  const login=()=>{
    const token=localStorage.getItem('token');
    setToken(token);
  }

  return (
    <StudentContext.Provider value={{student, logout,login}}>
      {children}
    </StudentContext.Provider>
  );
};
