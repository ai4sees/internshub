import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import getUserIdFromToken from './auth/authUtils';
import { toast } from 'react-toastify';
import axios from 'axios';
import api from '../common/server_url';

const Skills = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isClicked,setIsClicked] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState('');
  const [skills, setSkills] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${api}/student/profile/${userId}/skills`);
        if (!response.data) {
          toast.error('Sorry, no skills found');
          return;
        }
        setSkills(response.data);
        setIsEditing(false);
        setIsClicked(false);
        console.log('inside');
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };
    fetchSkills();
  }, [userId,isClicked]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!skillName || !proficiency) {
      toast.error('Please enter all fields');
      return;
    }

    const skillData = {
      skillName,
      proficiency
    };

    try {
      if (editIndex !== null) {
        // Update existing skill entry
        const response = await axios.put(`${api}/student/profile/${userId}/skills/${editIndex}`, skillData);
        const updatedSkills = [...skills];
        updatedSkills[editIndex] = response.data;
        setSkills(updatedSkills);
        setIsEditing(false);
        toast.success('Skill updated');
      } else {
        // Add new skill entry
        const response = await axios.post(`${api}/student/profile/${userId}/skills`, skillData);
        setSkills([...skills, response.data.skills]);
        toast.success('Skill added');
      }

      setSkillName('');
      setProficiency('');
      setEditIndex(null);
      setIsEditing(false);
      setIsClicked(true);
    } catch (error) {
      console.error('Error saving the skill details:', error);
      toast.error('Failed to update details');
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`${api}/student/profile/${userId}/skills/${index}`);
      setSkills(skills.filter((_, i) => i !== index));
      toast.success('Skill deleted');
    } catch (error) {
      console.error('Error deleting skill details:', error);
      toast.error('Failed to delete details');
    }
  };

  const handleEdit = (index) => {
    const skill = skills[index];
    setIsEditing(true);
    setSkillName(skill.skillName);
    setProficiency(skill.proficiency);
    setEditIndex(index);
  };

  return (
    <div className="container mx-auto p-4 border-b shadow-lg  mt-[68px] w-2/3">
      <h2 className="text-xl font-semibold flex justify-between font-outfit">
        Skills
        <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-green-600 flex items-center space-x-1">
          <span>Add Skill</span> <FontAwesomeIcon icon={faPlus} />
        </button>
      </h2>

      {isEditing ? (
        <form className="mt-4" onSubmit={handleSubmit}>
          {/* Form Fields for Skills */}
          <input type="text" value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="Skill Name" className="border p-2 mb-2 w-full" />

          <select type="text" value={proficiency} onChange={(e) => setProficiency(e.target.value)} placeholder="Proficiency" className="border p-2 mb-2 w-full" >
            <option value="">Select proficiency</option>
            <option value="Begineer">Begineer</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
            </select>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4">Save</button>
          <button onClick={() => setIsEditing(false)} className="border ml-4 px-4 py-2 text-gray-500 hover:bg-red-500 hover:text-white">Cancel</button>
        </form>
      ) : (
        <div className='flex space-x-2 flex-wrap mt-10 p-3'>
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <div key={index} className="border-2 shadow-lg hover:border-blue-500 rounded-2xl p-5 mb-2 flex justify-between w-[270px]">
                <div>
                  <h3 className="text-lg font-semibold">{skill.skillName}</h3>
                  <p>Proficiency: {skill.proficiency}</p>
                </div>
                <div className="space-x-5">
                  <FontAwesomeIcon icon={faPen} onClick={() => handleEdit(index)} className='hover:scale-125 duration-300 text-blue-500 hover:cursor-pointer' />
                  <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(index)} className='hover:scale-125 duration-300 text-red-600 hover:cursor-pointer' />
                </div>
              </div>
            ))
          ) : (
            <p>No skills added yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Skills;
