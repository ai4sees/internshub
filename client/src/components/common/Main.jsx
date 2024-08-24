import React, { useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import getUserIdFromToken from "../student/auth/authUtils"
import { useNavigate } from 'react-router-dom';
import {useStudent} from '../student/context/studentContext'
import {useRecruiter} from '../recruiter/context/recruiterContext'

const Main = () => {
  const navigate = useNavigate();
  const userId=getUserIdFromToken();
  const {student}=useStudent();
  const {recruiter} = useRecruiter();
  const token=localStorage.getItem('token');

  useEffect(() => {
   
    console.log('Inside Useeffect of main');
    if(!token) return;
    else{
      const userId=getUserIdFromToken();
      if(student){
        navigate(`/student/dashboard/${userId}`);
        return;
      }
      if(recruiter){
        navigate(`/recruiter/dashboard/${userId}`);
        return;
      }
    }
  }, [student,recruiter,token])



  
  return (
    <div className='w-full h-screen flex'>
      <div className='w-1/2 border-r-4 border-black bg-red-600 h-screen flex items-center'>
      <div className='border w-full h-[200px] flex justify-center items-center'>
        <div className='w-[40%] h-[100px] border-4 border-dotted text-3xl font-extrabold rounded-xl text-white flex flex-col items-center space-y-2'>
          <p>I'm a Student</p>
          <div className='border-2 w-10 h-10 rounded-full hover:cursor-pointer hover:bg-white hover:scale-125 duration-300'>
            <Link to='/student/signup'><FontAwesomeIcon icon={faArrowRight} className=' w-full mx-auto hover:text-red-600'/></Link>
          </div>
        </div>
      </div>
      
      </div>



      <div className='w-1/2 h-screen flex  items-center px-0'>
      <div className='border border-red-600 w-full h-[200px] flex justify-center items-center ml-[-5px] '>
        <button className='w-[40%] h-[100px] border-red-600 border-4 border-dotted text-3xl font-extrabold rounded-xl text-red-600 flex flex-col items-center space-y-2'>
        <p>I'm a Recruiter</p>
          <div className='border-2 border-red-600 w-10 h-10 rounded-full hover:cursor-pointer hover:bg-red-600 hover:scale-125 duration-300'>
           <Link to='/recruiter/signup'> <FontAwesomeIcon icon={faArrowRight} className='w-full mx-auto hover:text-white'/></Link>
          </div>
        </button>
      </div>
      </div>

    </div>
  )
}

export default Main