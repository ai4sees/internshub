import React, { useEffect,useState } from 'react'
import Education from './Education'
import getUserIdFromToken from './auth/authUtils'
import { useNavigate, useParams } from 'react-router-dom'
import { useStudent } from './context/studentContext'
import Spinner from '../common/Spinner'
import WorkExp from './WorkExp'
import Certificates from './Certificates'
import PersonalProjects from './PersonalProjects'
import Skills from './Skills'
import Portfolio from './Portfolio'

const Profile = () => {

  const idFromToken = getUserIdFromToken();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { logout, student } = useStudent();
  const token = localStorage.getItem('token');
  
  useEffect(() => {

    if (!token) {
      navigate('/student/login');
      return;
    }
    console.log('id from token', idFromToken);
    console.log('id from params', userId);

    if (idFromToken !== userId) {
      logout(); //logout from studentContext to remove token and setToken to null in useeffect of context to trigger the useeffect of studentContext
      navigate('/student/login');
      return;
    }

  }, [userId, idFromToken, token]);


 

  return (
    !student ? (
      <Spinner />
    ) : (
      <div className='container mx-auto p-4 mt-[68px] '>
        <div className='border-b '>
          <h1 className="text-3xl font-bold mb-2 text-center">Profile</h1>
          <h1 className=' text-xl capitalize text-center text-gray-600'>{student.firstname} {student.lastname}</h1>
          <h1 className=' text-gray-600 text-center'>{student.email}</h1>
        </div>

        

        <section className="mb-8">
          <Education />
        </section>
        <section className="mb-8">
          <WorkExp />
        </section>
        <section className="mb-8">
          <Certificates />
        </section>
        <section className="mb-8">
          <PersonalProjects />
        </section>
        <section className="mb-8">
          <Skills />
        </section>
        <section className="mb-8">
          <Portfolio />
        </section>
      </div>
    )
  );
}

export default Profile