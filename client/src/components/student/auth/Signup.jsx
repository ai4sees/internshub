import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye,faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import google_pic from '../../../images/google_pic.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import getUserIdFromToken from "./authUtils"
import {auth,provider} from '../../common/firebaseConfig'
import {signInWithPopup} from 'firebase/auth'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStudent } from '../context/studentContext';
import login_bg from '../../../images/login_bg.jpeg'
import ToggleButton from '../../common/ToggleButton';
import ToggleButtonSecond from '../../common/ToogleButtonSecond';
import api from '../../common/server_url'
function Signup() {

  const [showPassword, setShowPassword] = useState(false);

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const navigate = useNavigate();
  const userId=  getUserIdFromToken();
  const {login}=useStudent();
 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      login();
      navigate(`/student/dashboard/${userId}`);
    }
  }, [userId]);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle form submission

    if (!validateEmail(email)) {
      setEmailError('The email does not look right. Try again.');
      return;
    }
    setEmailError('');
    try {
      // Send a POST request to the backend
      const response = await axios.post(`${api}/student/signup`, {
        firstname,
        lastname,
        email,
        password,
      });

      // Handle success
      toast.success('You are Signed in');
      localStorage.setItem('token', response.data.token); // Store token if needed
      login();
      const userId=  getUserIdFromToken();
      console.log(response.data.token);
      navigate(`/student/dashboard/${userId}`);
    } catch (error) {
      // Handle error
      toast.error(error.response.data.message);
    }

  };

  const isFormValid = email.trim() !== '' && password.trim() !== '' && firstname.trim()!=='' && lastname.trim() !== '';

  const handleGoogleClick=async(e)=>{
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const email = user.email;
      const firstname = user.displayName.split(' ')[0];
      const lastname = user.displayName.split(' ')[1] || '';

      const response = await axios.post(`${api}/student/signup/googleauth`, {
        email,
        firstname,
        lastname,
      });

      if (response.data.success) {
        toast.success('You are Signed in');
        const token=response.data.token;
        localStorage.setItem('token',token);
        login();
        const userId=  getUserIdFromToken();
        navigate(`/student/dashboard/${userId}`);
      } else {
        toast.error('Something went wrong')
      }


    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  }


  return (
    <div className='flex min-h-screen'>
      <div className='relative w-1/2 h-auto '>
      <img src={login_bg} alt="" className=' w-full h-screen'/>
      </div>
      <div className='w-1/2 '>
        
        <div className='flex flex-col items-center mt-[20px]'>
          <p className='text-5xl font-extrabold mb-12 '>Sign up</p>
          <div className='flex space-x-3'>
          <ToggleButton type='student' auth='signup'/>
          <ToggleButtonSecond type="student" auth="signup"/>
          </div>
        </div>
        <div>

          {/* form starts from here */}

          <div className="flex justify-center items-center mt-[40px] w-full " >
            <form onSubmit={handleSubmit} className="space-y-4 mx-auto">
              <div className='flex flex-col items-center'>
                <input type="text" 
                id='firstname'
                value={firstname}
                placeholder='Enter Your First Name'
                onChange={(e)=>{
                  setFirstName(e.target.value);
                  if(e.target.value.trim()===''){
                    setNameError('Give complete name')
                  }
                  else setNameError('');
                }}
                className='h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md w-[560px]'/>
                {nameError && (
                  <p className="text-red-500 text-left w-full">{nameError}</p>
                )}
                </div>

                <div className='flex flex-col items-center'>
                <input type="text" 
                id='lastname'
                value={lastname}
                placeholder='Enter Your Last Name'
                onChange={(e)=>{
                  setLastName(e.target.value);
                  if(e.target.value.trim()===''){
                    setNameError('Give complete name')
                  }
                  else setNameError('');
                }}
                className='h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md w-[560px]'/>
                {nameError && (
                  <p className="text-red-500 text-left w-full">{nameError}</p>
                )}
                </div>


                <div className="flex flex-col items-center">
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder='Email'
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (!validateEmail(e.target.value)) {
                      setEmailError('The email does not look right. Try again.');
                    }
                    else setEmailError('');
                  }}
                  className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md w-[560px]"
                  required
                />
                {emailError && (
                  <p className="text-red-500 text-left w-full">{emailError}</p>
                )}

              </div>

              <div className="flex flex-col items-center relative">

                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  placeholder='Password'
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value.trim().length < 8) setPasswordError('Password must be at least 8 characters');
                    else setPasswordError('');
                  }
                  }
                  className="h-12 border-none bg-[rgb(246,247,245)] p-2 rounded-md pr-10 w-[560px]"
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-left w-full">{passwordError}</p>
                )}


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
                Create Account
              </button>
            </form>

          </div>

          {/* <div className='w-[80%] mx-auto mt-[40px]'>
            <p className='text-center text-gray-500'>
              By clicking Create account, you agree to Linktree's privacy notice, T&Cs and to receive offers, news and updates.
            </p>
          </div> */}

          <p className='mt-5 text-center'>OR</p>
          
          <div className='w-[580px] mx-auto mt-8  space-y-3'>
            
          <button onClick={handleGoogleClick}
            className='w-full mx-auto py-2 border border-gray-300 h-[50px] text-black text-[18px] rounded-full font-semibold'
          >
            <div className='inline-flex space-x-4'>
            <img src={google_pic} alt="" className='w-5 h-5 py-0 px-0 ml-5 mt-2'/>
            <span className='mt-1'>Sign up with Google</span>
            </div>
          </button>
          {/* <button
            className='w-full py-2 border border-gray-300 h-[50px] text-black text-[18px] rounded-full font-semibold'
          >
            <div className='inline-flex space-x-1 ml-0'>
            <img src={apple_pic} alt="" className='w-10 h-10 py-0 px-0 ml-5 mt-[-4px]'/>
            <span className='mt-1'>Sign up with Apple</span>
            </div>
          </button> */}
          </div>
          
          {/* <div className='flex justify-center items-center space-x-7 mt-3'>
          <div className='  flex '>
            <span className='text-gray-500 '>Already have an account?</span>
            <Link to='/student/login'><span className='text-purple-500 underline'>Log in</span></Link>
          </div>

          <div className=' flex items-center'>
            <span className='text-gray-500 '>Sign up as recruiter?</span>
            <Link to='/recruiter/signup'><span className='text-purple-500 underline'>&nbsp;Sign up</span></Link>
          </div>
          </div> */}







        </div>
      </div>
    </div>
  )
}

export default Signup