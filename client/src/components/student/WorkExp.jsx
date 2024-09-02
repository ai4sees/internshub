import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import axios from 'axios';
import getUserIdFromToken from './auth/authUtils';
import api from '../common/server_url';

const WorkExp = () => {
  const [workExperiences, setWorkExperiences] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [typeofwork, setTypeOfWork] = useState('');
  const [description, setDescription] = useState('');
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [clicked,setClicked]=useState(false);

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchWorkExperiences = async () => {
      try {
        const response = await axios.get(`${api}/student/profile/${userId}/work-experience`);
        setWorkExperiences(response.data);
        setClicked(false);
      } catch (error) {
        console.error('Error fetching work experiences:', error);
      }
    };
    fetchWorkExperiences();
  }, [userId,clicked]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workExpData = {
      company,
      role,
      startDate,
      endDate,
      typeofwork,
      description,
    };

    if (!company || !role || !startDate || !endDate || !typeofwork || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (currentEditIndex !== null) {
        // Edit existing experience
        await axios.put(`${api}/student/profile/${userId}/work-experience/${currentEditIndex}`, workExpData);
        const updatedExperiences = [...workExperiences];
        updatedExperiences[currentEditIndex] = workExpData;
        setWorkExperiences(updatedExperiences);
        toast.success('Experience updated successfully');
      } else {
        console.log(workExpData);    
        // Add new experience
        const response = await axios.post(`${api}/student/profile/${userId}/work-experience`, workExpData);
        setWorkExperiences([...workExperiences, response.data.workExperience]);
        toast.success('Experience added successfully');
      }
      setIsEditing(false);
      resetForm();
      setClicked(true);
    } catch (error) {
      console.error('Error saving work experience:', error);
      toast.error('Failed to save experience');
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`${api}/student/profile/${userId}/work-experience/${index}`);
      const updatedExperiences = workExperiences.filter((_, i) => i !== index);
      setWorkExperiences(updatedExperiences);
      toast.success('Experience deleted successfully');
    } catch (error) {
      console.error('Error deleting work experience:', error);
      toast.error('Failed to delete experience');
    }
  };

  const handleEdit = (index) => {
    const experienceToEdit = workExperiences[index];
    setCompany(experienceToEdit.company);
    setRole(experienceToEdit.role);
    setStartDate(experienceToEdit.startDate);
    setEndDate(experienceToEdit.endDate);
    setTypeOfWork(experienceToEdit.typeofwork);
    setDescription(experienceToEdit.description);
    setCurrentEditIndex(index);
    setIsEditing(true);
  };

  const resetForm = () => {
    setCompany('');
    setRole('');
    setStartDate('');
    setEndDate('');
    setTypeOfWork('');
    setDescription('');
    setCurrentEditIndex(null);
  };

  const formatDate=(givenDate)=>{
  const [year,month,day]=givenDate?givenDate.split('-'):'';
  return `${day}-${month}-${year}`;
  }



  return (
    <div className="container mx-auto p-4 border-b shadow-lg mt-[68px] w-2/3">

      <h2 className="text-xl font-semibold flex justify-between font-outfit">
        Work Experience / Internship
        <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-green-600 flex items-center space-x-1">
          <span>Add Experience</span> <FontAwesomeIcon icon={faPlus} />
        </button>
      </h2>

      {isEditing ? (
        <form className="mt-4" onSubmit={handleSubmit}>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="border p-2 mb-2 w-full" />
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" className="border p-2 mb-2 w-full" />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" className="border p-2 mb-2 w-full" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" className="border p-2 mb-2 w-full" />

          {/* <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type (e.g., Internship, Job)" className="border p-2 mb-2 w-full" /> */}
          <select type='text' value={typeofwork} onChange={(e)=>setTypeOfWork(e.target.value)} placeholder="Type (e.g., Internship, Job)" className="border p-2 mb-2 w-full">
            <option value="">Select Type</option>
            <option value="job">Job</option>
            <option value="internship">Internship</option>
          </select>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="border p-2 mb-2 w-full"></textarea>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4">{currentEditIndex !== null ? 'Update' : 'Save'}</button>
          <button onClick={() => { setIsEditing(false); resetForm(); }} className="border ml-4 px-4 py-2 text-gray-500 hover:bg-red-500 hover:text-white">Cancel</button>
        </form>
      ) : (
        <div className='flex flex-col items-center mt-10'>
          {workExperiences.length > 0 ? (
            workExperiences.map((work, index) => (
              <div key={index} className="border-2 shadow-lg p-5 mb-2 flex justify-between w-[70%]">
                <div>
                  <h3 className="text-lg font-semibold">{work.role} at : {work.company}</h3>
                  <div className='text-gray-600'>
                  <p> ({work.typeofwork})</p>
                  <p>Duration: {formatDate(work.startDate)} - {formatDate(work.endDate)}</p>
                  <p>Details: {work.description}</p>
                  </div>
                </div>
                <div className='space-x-5'>
                  <FontAwesomeIcon icon={faPen} onClick={() => handleEdit(index)} className='hover:scale-125 duration-300 text-blue-500 hover:cursor-pointer'/>
                  <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(index)} className='hover:scale-125 duration-300 text-red-500 hover:cursor-pointer'/>
                </div>
              </div>
            ))
          ) : (
            <p>No work experience added yet.</p>
          )}
        </div>
      )}

    </div>
  );
}

export default WorkExp;
