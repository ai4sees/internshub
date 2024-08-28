import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ToggleButtonSecond = ({type,auth}) => {
  const [selected, setSelected] = useState(auth);
  const navigate = useNavigate();

  const toggleSelection = () => {
    // setSelected((prev) => (prev === 'student' ? 'recruiter' : 'student'));
    if(auth==='login' && type==='student'){
      setSelected('signup');
        navigate('/student/signup');
    }
    if(auth==='signup' && type==='student'){
      setSelected('login');
      navigate('/student/login');
    }
    
    if(auth==='login'&& type==='recruiter'){
      setSelected('signup');
      navigate('/recruiter/signup');
    }

    if(auth==='signup'&& type==='recruiter'){
      setSelected('login');
      navigate('/recruiter/login');
    }
   
  };

  return (
    <div className=" items-center inline-block justify-center">
      <div className="relative flex w-[232px] h-12 bg-gray-200 rounded-full p-1">
        <div
          className={`absolute top-1 left-1 w-28 h-10 rounded-full transition-transform duration-300 transform ${selected === 'login' ? 'translate-x-0' : 'translate-x-full'
            } bg-[rgb(129,41,217)]`}
        />
        <button
          className={`flex-1  text-center text-sm font-medium z-10 ${selected === 'login' ? 'text-white' : 'text-gray-500'
            }`}
          onClick={toggleSelection}
        >
          Login
        </button>
        <button
          className={`flex-1  text-center text-sm font-medium z-10 ${selected === 'signup' ? 'text-white' : 'text-gray-500'
            }`}
          onClick={toggleSelection}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default ToggleButtonSecond;
