import React, { useEffect,useState } from 'react'

import getUserIdFromToken from './auth/authUtilsRecr'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecruiter } from './context/recruiterContext'
import Spinner from '../common/Spinner'


const RecProfile = () => {

  const idFromToken = getUserIdFromToken();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { logout, recruiter } = useRecruiter();
  const token = localStorage.getItem('token');
  console.log(recruiter);
  
  useEffect(() => {

    if (!token) {
      navigate('/recruiter/login');
      return;
    }
    console.log('id from token', idFromToken);
    console.log('id from params', userId);

    if (idFromToken !== userId) {
      logout(); //logout from studentContext to remove token and setToken to null in useeffect of context to trigger the useeffect of studentContext
      navigate('/recruiter/login');
      return;
    }

  }, [userId, idFromToken, token]);


 

  return (
    !recruiter ? (
      <Spinner />
    ) : (
      <div className='container mx-auto p-4 mt-[68px] '>
        <div className='border-b '>
          <h1 className="text-3xl font-bold mb-2 text-center">Profile</h1>
          <h1 className=' text-2xl capitalize  text-gray-600'>{recruiter.firstname} {recruiter.lastname}</h1>
          <h1 className=' text-gray-600 '>{recruiter.email}</h1>
          <h1 className=' text-gray-600 '>Ph no- {recruiter.phone}</h1>
        </div>

        

        
      </div>
    )
  );
}

export default RecProfile