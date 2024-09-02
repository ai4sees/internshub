import React, { useState,useRef,useEffect, useId } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCloudArrowUp,faCheck,faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import getUserIdFromToken from "./auth/authUtils.js"
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../common/server_url.js';


const Resume = () => {

  const fileInputRef=useRef(null);
  const [file, setFile] = useState(null);
  const { userId } = useParams();
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFilename, setResumeFilename] = useState('resume.pdf');
  const idFromToken=getUserIdFromToken();

  useEffect(() => {
    const token =localStorage.getItem('token');
    if(!token){
      navigate('/student/login');
      return;
    }
    if(idFromToken!==userId){
      localStorage.removeItem('token');
      return;
    }
  }, [userId,idFromToken])
  

  useEffect(() => {
    // Fetch the resume from the backend
    const fetchResume = async () => {
      try {
        const response = await axios.get(`${api}/student/resume/${userId}`, {
          responseType: 'blob', // Set response type to blob for binary data
        });
        
      
        // Create a URL for the blob data
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setResumeUrl(url);
        console.log(resumeUrl);

        const contentDisposition = response.headers['content-disposition'];
        // console.log('contentDisposition:', contentDisposition);
        // console.log(Object.keys(response.headers));
        // console.log('response.headers:', response.headers);
        if (contentDisposition) {
          console.log('yattttaaa');
          const matches = /filename="([^"]*)"/.exec(contentDisposition);
          if (matches) setResumeFilename(matches[1]);
        }

        // setResumeCreatedAt(createdAt);
      } catch (error) {
        console.error('Error fetching resume:', error);
      }
    };

    fetchResume();
  },[userId]);
  


  const navigate = useNavigate();

  const handleFileClick=()=>{
    fileInputRef.current.click();
  }
  const handleFileReupload=()=>{
    setFile(null);
    setResumeUrl('');
    fileInputRef.current.click();
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    if ( !userId) {
      alert('Please ensure you are logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await axios.post(`${api}/student/upload-resume/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    
      toast.success('Resume Uploaded Successfully');
      
      navigate(`/student/dashboard/${userId}`);
    } catch (error) {
      console.error('There was an error uploading the resume:', error);
      alert('Failed to upload the resume.');
    }
  }

  return (
    <div className="text-black w-full h-screen bg-gradient-to-b from-white to-blue-500">
      <div className='w-1/2 h-1/2 mt-[140px] flex flex-col items-center justify-center mx-auto border-4 border-red-600 border-dotted '>

        <form onSubmit={handleSubmit} className='flex flex-col items-center'>
        <h2 className='text-center my-7 text-4xl font-bold mt-0'>Upload Your Resume</h2>
      <div className='w-[70px] h-[70px] '>
        {!file?
          <FontAwesomeIcon onClick={handleFileClick} icon={faCloudArrowUp} className='w-full h-full hover:cursor-pointer hover:scale-125 duration-300'/>
          :<FontAwesomeIcon icon={faCheck} className='w-full h-full'/>
        }
      </div>
      <input ref={fileInputRef} type="file" onChange={handleFileChange} className='hidden my-4 hover:cursor-pointer'/>
      <button type='submit' className={`text-xl  font-bold mt-10 ${file?`hover:scale-105  duration-300 text-black border-2 border-black p-2 hover:bg-green-400`:`text-gray-400`} `} disabled={!file}>UPLOAD</button>
      {(file|| resumeUrl) &&
      <>
      <button className=' text-red-500 text-xl font-bold mt-10 hover:scale-105 duration-300' onClick={handleFileReupload}>RE-UPLOAD</button>
      <a href={resumeUrl} download={resumeFilename} className='text-red-500 text-xl font-bold mt-4 hover:scale-105 duration-300'>Download Resume-{resumeFilename}</a>
        </>

      }
      </form>
      
      


      </div>

      <div className=' mt-[80px]'>
      <Link to={`/student/dashboard/${userId}`} > <div className='border-2 border-black rounded-full w-[60px] h-[60px] mx-auto p-2 hover:bg-green-400 hover:cursor-pointer'>
         <FontAwesomeIcon icon={faArrowLeft} className='w-full h-full'/>
        </div></Link>
        <div className='text-center text-lg font-bold'>
         Go back
        </div>
      </div>
    </div>
  )
}

export default Resume