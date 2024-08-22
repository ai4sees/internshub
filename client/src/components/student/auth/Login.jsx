import React, { useState,useEffect } from 'react'

import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye as EyeIcon, faEyeSlash as EyeSlashIcon, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import google_pic from '../../../images/google_pic.png'
import axios from 'axios';
import { useNavigate,useParams } from 'react-router-dom';
import getUserIdFromToken from "./authUtils"
import {auth,provider} from '../../common/firebaseConfig'
import {signInWithPopup} from 'firebase/auth'


function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const userId=getUserIdFromToken();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/student/dashboard/${userId}`);
      return;
    }
  }, [navigate,userId]);

  

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/student/login', {
        email,
        password,
      });

      // Handle success
      console.log(response.data.message);
      localStorage.setItem('token', response.data.token);
      const userId= getUserIdFromToken();
      navigate(`/student/dashboard/${userId}`); 
    } catch (error) {
      // Handle error
      console.log(error.response.data.message);
      // setError(error.response.data.message || 'Login failed');
    }
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';


  const handleGoogleClick=async(e)=>{
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;
      const firstname = user.displayName.split(' ')[0];
      const lastname = user.displayName.split(' ')[1] || '';

      const response = await axios.post('http://localhost:4000/student/login/googleauth', {
        email,
        firstname,
        lastname
      });

      if (response.data.success) {
        console.log('User successfully logged in or registered:', response.data.student);
        const token=response.data.token;
        localStorage.setItem('token',token);
        const userId=  getUserIdFromToken();
        navigate(`/student/dashboard/${userId}`);
      } else {
        console.error('Error handling Google sign-in on the server:', response.data.message);
      }


    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  }

  return (
    <div className='flex min-h-screen'>
      <div className='w-full'>
       

        <div className='text-center  mt-10'>
          <p className='text-5xl font-extrabold mb-6'>Welcome back!</p>
          <p className='text-gray-500 text-lg'>Student Login.

          </p>
        </div>
        <div>

          {/* form starts from here */}

          <div className="flex justify-center items-center mt-[80px] w-[600px] mx-auto " >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center">
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder='Email'
                  onChange={(e) => {
                    setEmail(e.target.value);

                  }}
                  className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md w-[560px]"
                  required
                />


              </div>

              <div className="flex flex-col items-center relative">

                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  placeholder='Password'
                  onChange={(e) => setPassword(e.target.value)
                  }
                  className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md pr-10 w-[560px]"
                  required
                />



                <button
                  type="button"
                  onClick={handlePasswordToggle}
                  className="absolute right-2 top-[24px] transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEye} className="w-5 h-5 text-gray-500" />

                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} className="w-5 h-5 text-gray-500" />
                  )}
                </button>

              </div>

              <button
                type="submit"
                className={`w-full py-2 bg-[rgb(129,41,217)] border-none h-[50px] text-white rounded-full ${!isFormValid ? `bg-[rgb(224,226,217)]` : ''} `}
                disabled={!isFormValid}

              >
                Log in
              </button>
            </form>

          </div>

          <p className='my-4 text-center'>OR</p>

          <div className='w-[580px] mx-auto mt-8 space-y-3'>

            <button
              className='w-full py-2 border border-gray-300 h-[50px] text-black text-[18px] rounded-full font-semibold' onClick={handleGoogleClick}
            >
              <div className='inline-flex space-x-4'>
                <img src={google_pic} alt="" className='w-5 h-5 py-0 px-0 ml-5 mt-2' />
                <span className='mt-1'>Continue up with Google</span>
              </div>
            </button>
            
          </div>

          <div className='mt-[30px] text-center'>
            <span className='text-gray-500 '>Don't have an account? </span>
            <Link to='/student/signup'><span className='text-purple-500 underline'>Sign up.</span></Link>
          </div>

        </div>

        <div className='mt-[30px] text-center'>
            <span className='text-gray-500 '>login as recruiter </span>
            <Link to='/recruiter/login'><span className='text-purple-500 underline'>login</span></Link>
          </div>
      </div>

    </div>
  )

}

export default Login