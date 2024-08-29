import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from '@fortawesome/free-solid-svg-icons'; "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import getUserIdFromToken from './auth/authUtilsRecr'
import {toast} from 'react-toastify'

const RecPosting = () => {
  const [formData, setFormData] = useState({
    internshipName: '',
    internshipType: '',
    numberOfOpenings: '',
    stipend: '',
    description: '',
    skills: [],
  });

  const [skill, setSkill] = useState('');
  const userId=getUserIdFromToken();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSkillChange = (e) => {
    setSkill(e.target.value);
  };

 const removeSkill = (indexToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, index) => index !== indexToRemove),
    });
  };

  const addSkill = () => {
    if (skill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill.trim()],
      });
      setSkill(''); // Clear the skill input field after adding
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const postData={
      internshipName: formData.internshipName,
      internshipType: formData.internshipType,
      numberOfOpenings: formData.numberOfOpenings,
      stipend: formData.stipend,
      description: formData.description,
      skills: formData.skills,
      
    }
    console.log('sending this data',postData)
    try {
      // Make the POST request to your backend
      const response = await axios.post(`http://localhost:4000/recruiter/internship/post/${userId}`, postData);
  
      if(response.data.success){
        toast.success('Internship posted successfully');
        console.log('Response:', response.data);
        setFormData({
          internshipName: '',
          internshipType: '',
          numberOfOpenings: '',
          stipend: '',
          description: '',
          skills: [],
        });
        return;
      }
      else{
      toast.error('some error occured');
      return;
      }
     
  
    
      

  
    } catch (error) {
      // Handle errors
      console.error('There was an error posting the internship:', error);
    }
  };



  return (
    <div className="border border-gray-300 mt-24 w-[45%]  mx-auto bg-gray-100 p-6 rounded-lg shadow-lg ">
      <h2 className="text-2xl font-bold mb-6 text-center">Post an Internship</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="flex flex-col">
          {/* <label className="mb-2 font-medium">Internship Name:</label> */}
          <input
            type="text"
            name="internshipName"
            value={formData.internshipName}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded-md"
            placeholder='Internship Title'
          />
        </div>

        <div className="flex flex-col">
          {/* <label className="mb-2 font-medium">Internship Type:</label> */}
          <select
            name="internshipType"
            value={formData.internshipType}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md"

          >
            <option value="">Type of Internship</option>
            <option value="Remote">Remote</option>
            <option value="Office">Office</option>
          </select>
        </div>

        <div className="flex flex-col">
          {/* <label className="mb-2 font-medium"></label> */}
          <input
            type="number"
            name="numberOfOpenings"
            value={formData.numberOfOpenings}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded-md"
            placeholder='Number of Openings'
          />
        </div>

        <div className="flex flex-col">
          {/* <label className="mb-2 font-medium">Stipend</label> */}
          <input
            type="number"
            name="stipend"
            value={formData.stipend}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md"
            placeholder='Stipend'
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-medium">Skills:</label>
          <div className="flex items-center">
            <input
              type="text"
              value={skill}
              onChange={handleSkillChange}
              className="p-2 border border-gray-300 rounded-md mr-2"
              placeholder="Add a skill"
            />
            <button
              type="button"
              onClick={addSkill}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Skill
            </button>
          </div>
          <div className="mt-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-block group bg-gray-200 text-gray-700 px-7 py-2 rounded-full text-sm mx-2 mb-2 relative"
              >
                {skill}
                <span
                  className="absolute w-7 h-7 items-center justify-center top-0 right-0 -mt-1 -mr-1 bg-white rounded-full p-1 hidden group-hover:flex"
                  onClick={()=>removeSkill(index)}
                >
                  <FontAwesomeIcon
                    icon={faClose}
                    className="text-red-600 cursor-pointer"
                  />
                </span>
              </span>

            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-medium">Requirements</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded-md"
            rows='10'
          />
        </div>



        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Post Internship
        </button>
      </form>
    </div>
  );
};

export default RecPosting;
