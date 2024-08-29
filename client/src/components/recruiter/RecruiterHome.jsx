import React,{useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import getUserIdFromToken from './auth/authUtilsRecr';


const RecruiterHome = () => {

  const navigate=useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const idFromToken = getUserIdFromToken();

    if (idFromToken !== userId) {
      localStorage.removeItem('token');
      navigate('/recruiter/login');
    }
  }, [userId, navigate]);
  

  return (
    <div>RecruiterDash</div>
  )
}

export default RecruiterHome