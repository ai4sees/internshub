import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import getUserIdFromToken from './auth/authUtils';
import { toast } from 'react-toastify';
import axios from 'axios';
import api from '../common/server_url';

const Portfolio = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [linkType, setLinkType] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [portfolioLinks, setPortfolioLinks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchPortfolioLinks = async () => {
      try {
        const response = await axios.get(`${api}/student/profile/${userId}/portfolioLinks`);
        if (!response.data) {
          toast.error('Sorry, no portfolio links found');
          return;
        }
        setPortfolioLinks(response.data);
        setIsEditing(false);
        setIsClicked(false);
      } catch (error) {
        console.error('Error fetching portfolio links:', error);
      }
    };
    fetchPortfolioLinks();
  }, [userId, isClicked]);
//hello
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!linkType || !linkUrl) {
      toast.error('Please enter all fields');
      return;
    }

    const portfolioData = {
      linkType,
      linkUrl
    };

    try {
      if (editIndex !== null) {
        // Update existing portfolio link
        const response = await axios.put(`${api}/student/profile/${userId}/portfolioLinks/${editIndex}`, portfolioData);
        const updatedPortfolioLinks = [...portfolioLinks];
        updatedPortfolioLinks[editIndex] = response.data;
        setPortfolioLinks(updatedPortfolioLinks);
        setIsEditing(false);
        toast.success('Portfolio link updated');
      } else {
        // Add new portfolio link
        const response = await axios.post(`${api}/student/profile/${userId}/portfolioLinks`, portfolioData);
        setPortfolioLinks([...portfolioLinks, response.data.portfolioLink]);
        toast.success('Portfolio link added');
      }

      setLinkType('');
      setLinkUrl('');
      setEditIndex(null);
      setIsEditing(false);
      setIsClicked(true);
    } catch (error) {
      console.error('Error saving the portfolio link:', error);
      toast.error('Failed to update details');
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`${api}/student/profile/${userId}/portfolioLinks/${index}`);
      setPortfolioLinks(portfolioLinks.filter((_, i) => i !== index));
      toast.success('Portfolio link deleted');
    } catch (error) {
      console.error('Error deleting portfolio link:', error);
      toast.error('Failed to delete details');
    }
  };

  const handleEdit = (index) => {
    const portfolioLink = portfolioLinks[index];
    setIsEditing(true);
    setLinkType(portfolioLink.linkType);
    setLinkUrl(portfolioLink.linkUrl);
    setEditIndex(index);
  };

  return (
    <div className="container mx-auto p-4 border-b shadow-lg mt-[68px] w-2/3">
      <h2 className="text-xl font-semibold flex justify-between font-outfit">
        Portfolio Links
        <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-green-600 flex items-center space-x-1">
          <span>Add Portfolio Link</span> <FontAwesomeIcon icon={faPlus} />
        </button>
      </h2>

      {isEditing ? (
        <form className="mt-4" onSubmit={handleSubmit}>
          {/* Form Fields for Portfolio Links */}
          <input
            type="text"
            value={linkType}
            onChange={(e) => setLinkType(e.target.value)}
            placeholder="Link Type (e.g., GitHub, LinkedIn)"
            className="border p-2 mb-2 w-full"
          />

          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Link URL"
            className="border p-2 mb-2 w-full"
          />

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4">Save</button>
          <button onClick={() => setIsEditing(false)} className="border ml-4 px-4 py-2 text-gray-500 hover:bg-red-500 hover:text-white">Cancel</button>
        </form>
      ) : (
        <div className='flex flex-col items-center mt-10'>
          {portfolioLinks.length > 0 ? (
            portfolioLinks.map((portfolioLink, index) => (
              <div key={index} className="border-2 shadow-lg p-5 mb-2 flex justify-between w-[70%]">
                <div>
                  <h3 className="text-lg font-semibold">{portfolioLink.linkType}</h3>
                  <p>URL: <a href={portfolioLink.linkUrl} className='text-blue-500' target="_blank" rel="noopener noreferrer">{portfolioLink.linkUrl}</a></p>
                </div>
                <div className="space-x-5">
                  <FontAwesomeIcon icon={faPen} onClick={() => handleEdit(index)} className='hover:scale-125 duration-300 text-blue-500 hover:cursor-pointer' />
                  <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(index)} className='hover:scale-125 duration-300 text-red-600 hover:cursor-pointer' />
                </div>
              </div>
            ))
          ) : (
            <p>No portfolio links added yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Portfolio;
