import React,{useEffect} from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import RightSide from './RightSide'
import { useNavigate } from 'react-router-dom'
import getUserIdFromToken from "./auth/authUtils"


const Home = () => {
  const navigate = useNavigate();
  const userId=getUserIdFromToken();
  useEffect(() => {
    const token=localStorage.getItem('token');
    if(!token){
      navigate('/student/login');
      return;
    }
  }, [])
  
  return (
    <div className='Home'>
      {/* <Navbar/> */}
      <Sidebar/>
      <RightSide/>
      
    </div>
  )
}

export default Home