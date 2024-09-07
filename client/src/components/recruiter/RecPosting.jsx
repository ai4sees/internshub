import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import getUserIdFromToken from './auth/authUtilsRecr'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../common/server_url'

const RecPosting = () => {
  const [formData, setFormData] = useState({
    internshipName: '',
    internshipType: '',
    internLocation: '',
    numberOfOpenings: '',
    stipend: '',
    duration:'',
    description: '',
    skills: [],
  });
  // const [Location,setLocation]=useState('');
  // const [mode, setMode]=useState('');

  const [skill, setSkill] = useState('');
  const userId = getUserIdFromToken();
  const [formKey, setFormKey] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDescriptionChange = (value) => {
    setFormData({
      ...formData,
      description: value, // This will capture the HTML content from React Quill
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

  // const handleLocation=(e)=>{
  //   setLocation(e.target.value);
  // }

  const addSkill = () => {
    if (skill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill.trim()],
      });
      setSkill(''); // Clear the skill input field after adding
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      internshipName: formData.internshipName,
      internshipType: formData.internshipType,
      internLocation: formData.internLocation,
      numberOfOpenings: formData.numberOfOpenings,
      stipend: formData.stipend,
      duration:formData.duration, 
      description: formData.description,
      skills: formData.skills,

    }
    console.log(postData);
    if (!postData.internshipName || !postData.internshipType || !postData.stipend || !postData.duration || !postData.numberOfOpenings || !postData.description || postData.skills.length == 0) {
      toast.error('Please enter all fields');
      return;
    }

    if (postData.internshipType === 'Remote') {
      // setFormData({...formData,internshipType: 'Work from Home'})
      postData.internshipType = 'Work from Home';
    }
    else if (postData.internshipType === 'Office') {
      postData.internshipType = 'Work from Office';
    }

    console.log('sending this data', postData)
    try {
      // Make the POST request to your backend
      const response = await axios.post(`${api}/recruiter/internship/post/${userId}`, postData);

      if (response.data.success) {
        toast.success('Internship posted successfully');
        console.log('Response:', response.data);
        setFormData({
          internshipName: '',
          internshipType: '',
          internLocation: '', // Reset internLocation
          numberOfOpenings: '',
          stipend: '',
          duration:'',
          description: '',
          skills: [],
        });
        setSkill('');
        setFormKey(formKey + 1);
        console.log(formData);
        return;
      }
      else {
        toast.error('some error occured');
        return;
      }






    } catch (error) {
      // Handle errors
      console.error('There was an error posting the internship:', error);
    }
  };



  return (
    <div className="border border-gray-300 mt-24 w-[45%]  mx-auto bg-gray-100 p-6 rounded-lg shadow-lg mb-7 ">
      <h2 className="text-2xl font-bold mb-6 text-center">Post an Internship</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="flex flex-col">
          {/* <label className="mb-2 font-medium">Internship Name:</label> */}
          <input
            type="text"
            name="internshipName"
            value={formData.internshipName}
            onChange={handleChange}
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

        {
          formData.internshipType === 'Office' && <div className='flex flex-col'>
            <input type="text"
              name="internLocation"
              value={formData.internLocation}
              onChange={handleChange}
              className='p-2 border border-gray-300 rounded-md'
              placeholder='Enter Location e.g Delhi or Mumbai' />

          </div>
        }

        <div className="flex flex-col">
          {/* <label className="mb-2 font-medium"></label> */}
          <input
            type="number"
            name="numberOfOpenings"
            value={formData.numberOfOpenings}
            onChange={handleChange}

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
          {/* <label className="mb-2 font-medium">Stipend</label> */}
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md"
            placeholder='Enter duration in months'
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
                className="inline-block group bg-blue-300 px-7 py-2 rounded-full text-sm mx-2 mb-2 relative"
              >
                {skill}
                <span
                  className="absolute w-7 h-7 items-center justify-center top-0 right-0 -mt-1 -mr-1 bg-white rounded-full p-1 hidden group-hover:flex"
                  onClick={() => removeSkill(index)}
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

        <div className="flex flex-col   h-[400px]">
          <label className="mb-2 font-medium">Requirements</label>
          <ReactQuill
            value={formData.description}
            onChange={handleDescriptionChange}
            className="p-2   rounded-md h-[200px]"
            theme="snow"
            
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
