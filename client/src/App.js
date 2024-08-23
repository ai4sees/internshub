import React from "react";
import Home from './components/student/Home';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter as Router, Route, Routes ,useLocation } from 'react-router-dom';
import Navbar from "./components/student/Navbar";
import Locations from "./components/student/Locations";
import Category from "./components/student/Category";
import Courses from "./components/student/Courses";
import Chats from "./components/student/Chats";
import Alerts from "./components/student/Alerts";
import Profile from "./components/student/Profile";
import Resume from "./components/student/Resume";
import Login from './components/student/auth/Login';
import Main from "./components/common/Main";
import Signup from "./components/student/auth/Signup";
import SignupRecruit from "./components/recruiter/auth/Signup";
import LoginRecruit from "./components/recruiter/auth/Login"
import Spinner from "./components/common/Spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RecruiterDash from "./components/recruiter/RecruiterDash";


//import broswerRouter for different routes





function App() {
  const location = useLocation();
  return (
    <>
      { !location.pathname.endsWith('/signup') && !location.pathname.endsWith('/login') && location.pathname !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<Main />} />
        {/* <Route path="/spinner" element={<Spinner />} /> */}
        <Route path="/student/signup" element={<Signup />} />
        <Route path="/student/login" element={<Login />} />
        <Route path="/student/dashboard/:userId" element={<Home />} />
        <Route path="/student/resume/:userId" element={<Resume />} />
        <Route path="/student/locations" element={<Locations />} />
        <Route path="/student/category" element={<Category />} />
        <Route path="/student/courses" element={<Courses />} />
        <Route path="/student/chats" element={<Chats />} />
        <Route path="/student/alerts" element={<Alerts />} />
        <Route path="/student/Resume" element={<Resume />} />
        <Route path="/student/profile" element={<Profile />} />


        <Route path="/recruiter/signup" element={<SignupRecruit/>} />
        <Route path="/recruiter/login" element={<LoginRecruit/>} />
        <Route path="/recruiter/dashboard/:userId" element={<RecruiterDash/>} />
      </Routes>
      <ToastContainer
      autoClose={3000}
      position="top-center"

      />
      </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
      
    </Router>
  );
}
