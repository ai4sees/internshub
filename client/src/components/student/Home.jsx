import React,{useEffect,useState} from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import RightSide from './RightSide'
import { useNavigate } from 'react-router-dom'
// import getUserIdFromToken from "./auth/authUtils"
import { useParams } from 'react-router-dom';
import getUserIdFromToken from './auth/authUtils';
import Spinner from '../common/Spinner'
import { useStudent } from './context/studentContext'


const Home = () => {

  const navigate = useNavigate();
  const { userId } = useParams();
  const idFromToken = getUserIdFromToken();
  const {student,logout}=useStudent();
  const token=localStorage.getItem('token');

 



  useEffect(() => {
    
    
    if(!token ){
      navigate('/student/login');
      return;
    }
    if(userId!==idFromToken){
      logout();
      navigate('/student/login');
      return;
    }
   
    console.log(userId);
  }, [userId,idFromToken,token])

  if(!student){
    return <Spinner/>
  }


  
  return (
   <>
      
          <div className='Home'>
        <Sidebar student={student}/>
          <RightSide/>
          </div>
      
  </>
    
  )
}

export default Home