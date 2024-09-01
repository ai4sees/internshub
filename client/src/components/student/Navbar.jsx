import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import logo from "../../images/nav_logo.png";
import getUserIdFromToken from "./auth/authUtils.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretUp,
  faCaretDown,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStudent } from "./context/studentContext.js";

const Navbar = () => {
  const navigate=useNavigate();
  const userId = getUserIdFromToken();
  const {logout}=useStudent();
  const handleLogout = () => {
    // Clear the token from localStorage
    logout(); 
    toast.success('You are logged out');

    // Navigate to the login page
    navigate('/student/login');
  };


  return (
    <nav className="bg-white fixed top-0 w-[100vw] shadow-md z-20">
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
            <Link to={`/student/internships/${userId}`} className=" hover:bg-purple-300 p-5 ">
              Internship
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
            </Link>

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

          {/* <div className="relative mt-5 group">
            <a href="#" className=" hover:bg-purple-300 p-5">
              Courses
              <span className="ml-1 relative">
                <FontAwesomeIcon
                  icon={faCaretDown}
                  className="group-hover:invisible absolute top-1 left-0"
                />
                <FontAwesomeIcon
                  icon={faCaretUp}
                  className="invisible group-hover:visible absolute top-1 left-0 "
                />
              </span>
            </a>

            <div className="absolute left-0 mt-5 w-52 bg-white shadow-lg border border-gray-200 rounded-md hidden group-hover:block duration-300">
              <ul className="list-none p-2 m-0">
                <li className="py-2 px-4 hover:bg-gray-100">
                  <a href="#">Machine Learning</a>
                </li>

                <li className="py-2 px-4 hover:bg-gray-100">
                  <a href="#">Web development</a>
                </li>

                <li className="py-2 px-4 hover:bg-gray-100">
                  <a href="#">Artificial Intelligence</a>
                </li>
                <li className="py-2 px-4 hover:bg-gray-100">
                  <a href="#">Generative AI</a>
                </li>
              </ul>
            </div>
          </div> */}
          <a href="/student/chats" className=" hover:bg-purple-300 p-5">
            Messages
          </a>
          <a href="/student/alerts" className=" hover:bg-purple-300 p-5">
            Alerts
          </a>
          <Link to={`/student/myApplications/${userId}`} className=" hover:bg-purple-300 p-5">
            My Applications
          </Link>


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
                  <Link to={`/student/profile/${userId}`}>Profile</Link>
                </li>
                <li className="py-2 px-4 hover:bg-purple-300">
                  <Link to={`/student/resume/${userId}`}>Resume</Link>
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

export default Navbar;
