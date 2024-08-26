import React, { useEffect } from 'react'
import Education from './Education'
import getUserIdFromToken from './auth/authUtils'
import { useNavigate, useParams } from 'react-router-dom'
import { useStudent } from './context/studentContext'
import Spinner from '../common/Spinner'
import WorkExp from './WorkExp'

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

  }, [userId, idFromToken,token])
  return (
    !student ? (
      <Spinner />
    ) : (
      <div className='container mx-auto p-4 border border-black mt-[68px]'>
        <h1 className="text-3xl font-bold mb-2 ">Profile</h1>
        <h1 className=' text-xl capitalize text-gray-600'>{student.firstname} {student.lastname}</h1>
        <h1 className=' text-gray-600'>{student.email}</h1>

        <section className="mb-8">
          <Education />
        </section>
        <section className="mb-8">
          <WorkExp />
        </section>
      </div>
    )
  );
}

export default Profile