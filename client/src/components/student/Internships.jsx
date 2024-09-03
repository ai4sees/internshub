import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaMoneyBillWave, FaUsers, FaClipboardList, FaTimes, FaFontAwesome } from 'react-icons/fa';
import Spinner from '../common/Spinner';
import getUserIdFromToken from './auth/authUtils';
import TimeAgo from '../common/TimeAgo';
import api from '../common/server_url';
import { toast } from 'react-toastify';

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get(`${api}/student/${userId}/internships`);
        const sortedInternships = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setInternships(sortedInternships);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching internships:', err);
        setError('Failed to fetch internships. Please try again later.');
        setLoading(false);
      }
    };

    fetchInternships();
  }, [userId]);

  const openModal = async(internship) => {
    setSelectedInternship(internship);
    try {
      const response=await axios.put(`${api}/student/internship/${internship._id}/view`);
      console.log(response.data);
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  const closeModal = () => {
    setSelectedInternship(null);
  };

  const applyToInternship = async (internshipId) => {
    try {
      const response = await axios.post(`${api}/student/internship/${userId}/apply/${internshipId}`);
      if (response.status === 200) {
        if(response.data.success){
          toast.success('You have already applied for this Internship');
          return;
        }
        toast.success('Successfully applied to the internship');
      } else {
        toast.error('Failed to apply');
      }
    } catch (error) {
      toast.error('Error applying to internship');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-10 px-5 mt-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Internships</h1>
      <div className="flex flex-col justify-center">
        {internships.map((internship) => (
          <div key={internship._id} className="bg-white shadow-md rounded-lg p-6 w-[60%] my-3 mx-auto relative">
            <h2 className="text-2xl font-semibold mb-2">{internship.internshipName}</h2>
            <button
              onClick={() => openModal(internship)}
              className="absolute right-4 top-8 w-auto py-2 px-4 rounded-md text-blue-500 hover:scale-125 duration-300"
            >
              View details
            </button>
            <p className="text-gray-600 mb-4">Posted by: {internship.recruiter.firstname} {internship.recruiter.lastname}</p>
            <p className='text-gray-600 mb-4'>Posted: {TimeAgo(internship.createdAt)}</p>

            <div className="flex items-center text-gray-700 mb-2">
              <FaMapMarkerAlt className="mr-2" />
              <span>{internship.internLocation ? `${internship.internLocation}` : 'Remote'}</span>
            </div>

            <div className="flex items-center text-gray-700 mb-2">
              <FaMoneyBillWave className="mr-2" />
              <span>₹ {internship.stipend}</span>
            </div>


            {internship.internLocation &&
              <div className="flex items-center text-gray-700 mb-4">
                <FaClipboardList className="mr-2" />
                <span>{internship.internshipType}</span>
              </div>
            }

            <h3 className="text-lg font-medium mb-2">Skills Required:</h3>
            <div className="flex flex-wrap mb-4">
              {internship.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* <h3 className="text-lg font-medium mb-2">Description:</h3>
            <p className="text-gray-700 mb-4">
              {internship.description.length > 300 ? `${internship.description.substring(0, 300)}...` : internship.description}
            </p> */}
          </div>
        ))}

        {selectedInternship && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40  " onClick={closeModal}></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white border-2 border-gray-600 rounded-lg shadow-3xl w-[60%] h-[90%] p-6 relative overflow-auto">
                <h2 className="text-2xl font-semibold mb-4">{selectedInternship.internshipName}</h2>
                <button
                  onClick={closeModal}
                  className="absolute top-7 right-4 text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  <FaTimes />
                </button>
                <p className="text-gray-600 mb-4">Posted by: {selectedInternship.recruiter.firstname} {selectedInternship.recruiter.lastname}</p>
                <p className='text-gray-600 mb-4'>Posted: {TimeAgo(selectedInternship.createdAt)}</p>
                <button onClick={() => applyToInternship(selectedInternship._id)} className='absolute bg-blue-300 hover:bg-blue-400 py-2 px-5 rounded-xl right-5 top-[100px]'>Apply</button>

                <div className="flex items-center text-gray-700 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{selectedInternship.internLocation ? `${selectedInternship.internLocation}` : 'Remote'}</span>
                </div>

                <div className="flex items-center text-gray-700 mb-2">
                  <FaMoneyBillWave className="mr-2" />
                  <span>₹ {selectedInternship.stipend}</span>
                </div>

                <div className="flex items-center text-gray-700 mb-2">
                  <FaUsers className="mr-2" />
                  <span>{selectedInternship.numberOfOpenings} Openings</span>
                </div>

                {selectedInternship.internLocation &&
                  <div className="flex items-center text-gray-700 mb-4">
                    <FaClipboardList className="mr-2" />
                    <span>{selectedInternship.internshipType}</span>
                  </div>
                }

                <h3 className="text-lg font-medium mb-2">Skills Required:</h3>
                <div className="flex flex-wrap mb-4">
                  {selectedInternship.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <h3 className="text-lg font-medium mb-2">Description:</h3>
                <div
                  className="text-gray-700 mb-4"
                  dangerouslySetInnerHTML={{ __html: selectedInternship.description }}
                ></div>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Internships;
