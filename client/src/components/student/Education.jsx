import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import getUserIdFromToken from './auth/authUtils';
import { useStudent } from './context/studentContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import api from '../common/server_url';


const Education = () => {
  const [clicked, setClicked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [institution, setInstitution] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [score, setScore] = useState('');
  const [educationDetails, setEducationDetails] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const userId = getUserIdFromToken();


  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await axios.get(`${api}/student/profile/${userId}/education`);
        if (!response.data) {
          toast.error('sorry no details found');
          return;
        }
        setEducationDetails(response.data);

        console.log(degree);
        // console.log('useeffect');
        setClicked(false);
      } catch (error) {
        console.error('Error fetching education detailsvcc:', error);
      }
    }
    fetchEducation();
  }, [userId, clicked]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const educationData = {
      degree,
      fieldOfStudy,
      institution,
      startYear,
      endYear,
      score
    };

    if (!degree || !fieldOfStudy || !institution || !startYear || !endYear || !score) {
      toast.error('Please enter all fields');
      return;
    }

    try {
      if (editIndex !== null) {
        // Update existing education entry
        const response = await axios.put(`${api}/student/profile/${userId}/education/${editIndex}`, educationData);
        const updatedDetails = [...educationDetails];
        updatedDetails[editIndex] = response.data;
        setEducationDetails(updatedDetails);
        setIsEditing(false);
        toast.success('Details updated');
      } else {
        // Add new education entry
        const response = await axios.post(`${api}/student/profile/${userId}/education`, educationData);
        setEducationDetails([...educationDetails, response.data]);
        toast.success('Details added');
      }

      setClicked(true);
      setDegree('');
      setFieldOfStudy('');
      setInstitution('');
      setStartYear('');
      setEndYear('');
      setScore('');
      setEditIndex(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving the education details:', error);
      toast.error('Failed to update details');
    }
  };

  const handleDelete = async (index) => {
    try {
      console.log(educationDetails[index]);
      await axios.delete(`${api}/student/profile/${userId}/education/${index}`);
      setEducationDetails(educationDetails.filter((_, i) => i !== index));

      toast.success('Education details deleted');
    } catch (error) {
      console.error('Error deleting education details:', error);
      toast.error('Failed to delete details');
    }
  };

  const handleEdit = (index) => {
    const edu = educationDetails[index];
    setIsEditing(true);
    setDegree(edu.degree);
    setFieldOfStudy(edu.fieldOfStudy);
    setInstitution(edu.institution);
    setStartYear(edu.startYear);
    setEndYear(edu.endYear);
    setScore(edu.score);

    setEditIndex(index);
  };




  return (
    <div className="container mx-auto p-4 border-b shadow-lg mt-[68px] w-2/3">
      <h2 className="text-xl font-outfit font-semibold flex justify-between">
        Education
        <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-green-600 flex items-center space-x-1">
          <span>Add Education</span> <FontAwesomeIcon icon={faPlus} />
        </button>
      </h2>

      {isEditing ? (
        <form className="mt-4" onSubmit={handleSubmit}>
          {/* Form Fields for Education */}
          <select id="degree" value={degree} onChange={(e) => setDegree(e.target.value)} className="border p-2 mb-2 w-full">
            <option value="">Select your degree / Course</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
            <option value="B.Sc">B.Sc</option>
            <option value="M.Sc">M.Sc</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="BBA">BBA</option>
            <option value="MBA">MBA</option>
            <option value="PhD">PhD</option>
            <option value="X Standard">X Standard</option>
            <option value="XII Standard">XII Standard</option>
            <option value="Diploma">Diploma</option>
            {/* Add more degree options as needed */}
          </select>

          <input type="text" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} placeholder="Field of study" className="border p-2 mb-2 w-full" />

          <input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Institution" className="border p-2 mb-2 w-full" />

          <select value={startYear} onChange={(e) => setStartYear(e.target.value)} className="border p-2 mb-2 w-full">
            <option value="">Select Start Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select value={endYear} onChange={(e) => setEndYear(e.target.value)} className="border p-2 mb-2 w-full">
            <option value="">Select End Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <input type="text" placeholder='Enter Percentage/CGPA scored' value={score} onChange={(e) => setScore(e.target.value)} className="border p-2 mb-2 w-full" />

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4">Save</button>
          <button onClick={() => setIsEditing(false)} className="border ml-4 px-4 py-2 text-gray-500 hover:bg-red-500 hover:text-white">Cancel</button>
        </form>
      ) : (
        <div className='flex flex-col items-center mt-10'>
          {educationDetails.length > 0 ? (
            educationDetails.map((edu, index) => (
              <div key={index} className="border-2 shadow-lg p-5 mb-2 flex justify-between w-[70%]">
                <div>
                  <h3 className="text-lg font-semibold">{edu.degree}</h3>
                  <div className='text-gray-600'>
                    <p>{edu.fieldOfStudy} at {edu.institution}</p>
                    <p>Start Year: {edu.startYear}</p>
                    <p>Year of Completion: {edu.endYear}</p>
                    <p>Percentage/CGPA: {edu.score}</p>
                  </div>
                </div>
                <div className="space-x-5">
                  <FontAwesomeIcon icon={faPen} onClick={() => handleEdit(index)} className='hover:scale-125 duration-300 text-blue-500 hover:cursor-pointer' />
                  <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(index)} className='hover:scale-125 duration-300 text-red-600 hover:cursor-pointer' />
                </div>
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
