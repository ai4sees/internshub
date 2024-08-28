import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ToggleButton = ({type,auth}) => {
  const [selected, setSelected] = useState(type);
  const navigate = useNavigate();

  const toggleSelection = () => {
    if(type==='student' && auth==='login'){
      setSelected('recruiter');
      navigate('/recruiter/login');
    }
    if(type==='student' && auth==='signup'){
      setSelected('recruiter');
      navigate('/recruiter/signup');
    }
    if(type==='recruiter' && auth==='login'){
      setSelected('student');
      navigate('/student/login');
    }
    if(type==='recruiter' && auth==='signup'){
      setSelected('student');
      navigate('/student/signup')
    }
   
  };

  return (
    <div className=" items-center inline-block justify-center">
      <div className="relative flex w-[232px] h-12 bg-gray-200 rounded-full p-1">
        <div
          className={`absolute top-1 left-1 w-28 h-10 rounded-full transition-transform duration-300 transform ${selected === 'student' ? 'translate-x-0' : 'translate-x-full'
            } bg-[rgb(129,41,217)]`}
        />
        <button
          className={`flex-1  text-center text-sm font-medium z-10 ${selected === 'student' ? 'text-white' : 'text-gray-500'
            }`}
          onClick={toggleSelection}
        >
          Student
        </button>
        <button
          className={`flex-1  text-center text-sm font-medium z-10 ${selected === 'recruiter' ? 'text-white' : 'text-gray-500'
            }`}
          onClick={toggleSelection}
        >
          Recruiter
        </button>
      </div>
    </div>
  );
};

export default ToggleButton;
