import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useStudent } from './context/studentContext';
import Spinner from '../common/Spinner';


const Profile = () => {
  const student=useStudent();
  return (
    <>
    {
    student?(
    <div className='w-full h-[80vh] mt-[100px] space-y-3'>
    <div className='border border-black w-[100px] h-[100px] mx-auto rounded-full flex  justify-center'>
      <FontAwesomeIcon icon={faUser} className='w-[60px] h-[60px] mt-4'/>
    </div>
    <div>
      <p className='text-xl text-center capitalize'>{student.firstname} {student.lastname}</p>
    </div>
    <div>
      <p className='text-xl text-center'>{student.email}</p>
    </div>
    </div>
    ):(<Spinner/>)
    }
    </>
  )
}

export default Profile