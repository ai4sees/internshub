import React, { useEffect } from 'react'
import Education from './Education'
import getUserIdFromToken from './auth/authUtils'
import {useNavigate,useParams} from 'react-router-dom'
import { useStudent } from './context/studentContext'

const Profile = () => {

  const idFromToken = getUserIdFromToken();
  const { userId } = useParams();
  const navigate=useNavigate();
  const {logout}=useStudent();

  useEffect(()=>{
    const token =localStorage.getItem('token');
    if(!token){
      navigate('/student/login');
      return;
    }
    console.log('id from token', idFromToken);
    console.log('id from params',userId);
    
    if(idFromToken!==userId){
      logout(); //logout from studentContext to remove token and setToken to null in useeffect of context to trigger the useeffect of studentContext
      navigate('/student/login');
      return;
    }

  },[userId,idFromToken])
  return (
    <div className='container mx-auto p-4 border border-black mt-[68px]'>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <section className="mb-8">
        <Education />
      </section>
    </div>
  )
}

export default Profile