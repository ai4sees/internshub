import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import getUserIdFromToken from './auth/authUtils';
import { useStudent } from './context/studentContext';
import { toast } from 'react-toastify';
import axios from 'axios';


const Education = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [institution, setInstitution] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [educationDetails, setEducationDetails] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const userId = getUserIdFromToken();


  useEffect(() => {
    const fetchEducation=async()=>{
    try {
      const response = await axios.get(`http://localhost:4000/student/profile/${userId}/education`);
      if(!response.data) {
        toast.error('sorry no details found');
        return;
      }
      setEducationDetails(response.data);
    } catch (error) {
      console.error('Error fetching education detailsvcc:', error);
    }
  } 
  fetchEducation();
  }, [userId,educationDetails]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const educationData = {
      degree,
      fieldOfStudy,
      institution,
      startYear,
      endYear,
    };
    if(!degree || !fieldOfStudy|| !institution || !startYear || !endYear){
      toast.error('Please Enter all fields');
      return;
    }

    // Send the data to the backend API
    try {

      const response = await axios.post(`http://localhost:4000/student/profile/${userId}/education`, educationData)
      setEducationDetails([...educationDetails, response.data]);
      setIsEditing(false);
      toast.success('Details updated');

    } catch (error) {
      console.error('Error saving the education details:', error);
      toast.error('Failed to update details');
    }


  };




  return (
    <div className="container mx-auto p-4 border border-black mt-[68px]">

      <h2 className="text-xl font-semibold flex justify-between">
        Education
        <button onClick={() => setIsEditing(true)} className="text-blue-500">
          <FontAwesomeIcon icon={faPen} />
        </button>
      </h2>

      {isEditing ? (
        <form className="mt-4" onSubmit={handleSubmit} value={degree} onChange={(e) => setDegree(e.target.value)}>
          {/* Form Fields for Education */}
          <select id="degree" className="border p-2 mb-2 w-full">
            <option value="">Select your degree</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
            <option value="B.Sc">B.Sc</option>
            <option value="M.Sc">M.Sc</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="BBA">BBA</option>
            <option value="MBA">MBA</option>
            <option value="PhD">PhD</option>
            {/* Add more degree options as needed */}
          </select>

          <input type="text" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} placeholder="Field of study" className="border p-2 mb-2 w-full" />

          <input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Institution" className="border p-2 mb-2 w-full" />

          <select
            value={startYear}
            onChange={(e)=>setStartYear(e.target.value)}
            className="border p-2 mb-2 w-full"
          >
            <option value="">Select Start Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={endYear}
            onChange={(e)=>setEndYear(e.target.value)}
            className="border p-2 mb-2 w-full"
          >
            <option value="">Select End Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4">Save</button>
          <button onClick={() => setIsEditing(false)} className="border ml-4 px-4 py-2 text-gray-500 hover:bg-red-500 hover:text-white">Cancel</button>
        </form>
      ) : (
        <div>
          {/* Display Education Details */}
          {educationDetails.length > 0 ? (
            educationDetails.map((edu, index) => (
              <div key={index} className="border p-2 mb-2">
                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                <p>{edu.fieldOfStudy} at {edu.institution}</p>
                <p>{edu.startYear} - {edu.endYear}</p>
              </div>
            ))
          ) : (
            <p>No details added yet.</p>
          )}
        </div>
      )}



    </div>
  );
};

export default Education;
