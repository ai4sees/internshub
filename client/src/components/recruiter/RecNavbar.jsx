import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import logo from "../../images/nav_logo.png";
import getUserIdFromToken from "./auth/authUtilsRecr.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretUp,
  faCaretDown,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRecruiter } from "./context/recruiterContext.js";

const RecNavbar = () => {
  const navigate=useNavigate();
  const userId = getUserIdFromToken();
  const {logout}=useRecruiter();
  const handleLogout = () => {
    // Clear the token from localStorage
    logout(); 
    toast.success('You are logged out');

    // Navigate to the login page
    navigate('/recruiter/login');
  };


  return (
    <nav className="bg-white fixed top-0 w-[100vw] shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to='/'><div className="inline-flex items-center">
          <h1>AI4SEES</h1>
          <img src={logo} alt="" className="h-10 " />
        </div></Link>
        {/* Navigation Links */}
        <div className="flex space-x-8">
          {/* Links starts from here */}
          <div className="relative mt-5 group ">
            <a href="#" className=" hover:bg-purple-300 p-5 ">
              Plans and Pricing
              {/* <span className="ml-1 relative">
                <FontAwesomeIcon
                  icon={faCaretDown}
                  className="group-hover:invisible absolute top-1 left-0 h-4"
                />
                <FontAwesomeIcon
                  icon={faCaretUp}
                  className="invisible group-hover:visible absolute top-1 left-0 "
                />
              </span> */}
            </a>

            {/* <div className="absolute left-0 mt-5 w-48 bg-white shadow-lg border border-gray-200 rounded-md hidden group-hover:block duration-300">
              <ul className="list-none p-2 m-0">
                <li className="py-2 px-4 hover:bg-purple-300">
                  <Link to='/student/locations'>Locations</Link>
                </li>

                <li className="py-2 px-4 hover:bg-purple-300">
                  <Link to='/student/category'>Category</Link>
                </li>

                <li className="py-2 px-4 hover:bg-purple-300">
                  <Link to='/student/courses'>Courses</Link>
                </li>
              </ul>
            </div> */}
          </div>

        
          <Link to={`/recruiter/dashboard/:userId`} className=" hover:bg-purple-300 p-5">
            My Dashboard
          </Link>
          <a href={`/recruiter/posting/${userId}`} className=" hover:bg-purple-300 p-5">
            Post Internship
          </a>

          <div className="group px-0 mx-0">
            <div className="p-0 absolute right-7 top-3 border border-black rounded-full h-10 w-10 flex items-center justify-center hover:bg-purple-300  ">
              <FontAwesomeIcon icon={faUser} size="1x" className="w-10" />
              

            </div>
            

            <div className="absolute right-0 top-12 w-48 bg-white shadow-lg border border-gray-200 rounded-md hidden group-hover:block">
              <ul className="list-none p-2 m-0">
                <li className="py-2 px-4 hover:bg-purple-300">
                  <a href="/">Home</a>
                </li>
                <li className="py-2 px-4 hover:bg-purple-300">
                  <Link to={`/recruiter/profile/${userId}`}>Profile</Link>
                </li>
                
                <li className="py-2 px-4 hover:bg-purple-300">
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RecNavbar;
