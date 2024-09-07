import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../common/Spinner'; // Assuming you have a spinner component
import getUserIdFromToken from './auth/authUtilsRecr'; // Utility to get user ID from token
import api from '../common/server_url'; // Your server URL
import { FaMapMarkerAlt, FaMoneyBillWave, FaUsers, FaClipboardList, FaTimes, FaClock } from 'react-icons/fa';
import TimeAgo
  from '../common/TimeAgo';
import {Link} from 'react-router-dom'



const RecDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const recruiterId = getUserIdFromToken();
  const [selectedInternship, setSelectedInternship] = useState(null);


  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/internship/${recruiterId}/getInternships`);
        const sortedInternships = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        const fetchedInternships = sortedInternships

        // Map over internships and fetch applicant count for each
        const internshipsWithApplicants = await Promise.all(fetchedInternships.map(async (internship) => {
          const applicantsResponse = await axios.get(`${api}/recruiter/internship/${recruiterId}/applicants/${internship._id}`);
          return {
            ...internship,
            applicantCount: applicantsResponse.data.length,
          };
        }));

        // Update state with internships and their respective applicant counts
        setInternships(internshipsWithApplicants);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching internships:', err);
        setError('Failed to fetch internships. Please try again later.');
        setLoading(false);
      }
    };


    fetchInternships();
  }, [recruiterId]);


  const openModal = (internship) => {
    setSelectedInternship(internship);

  }

  const closeModal = () => {
    setSelectedInternship(null);
  }

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
      <h1 className="text-3xl font-bold text-center mb-8">My Posted Internships</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-[90%] my-3 mx-auto">
        {/* Column Headings */}
        <div className="grid grid-cols-5 gap-1 font-semibold mb-2 border-b-2 pb-2 text-center">
          <div className='w-[290px]'>Post</div>
          <div className='w-[90px] ml-40'>Status</div>
          <div className='w-[80px] mx-auto'>Views</div>
          <div>View Applicants</div>
          <div>View Details</div>
        </div>
        {internships.map((internship) => (
          <div key={internship._id} className="grid grid-cols-5 gap-5 py-2 border-b-2">
            <div className='text-center mx-0 my-3 w-[290px]'>{internship.internshipName}</div>
            <div className='inline-flex justify-center h-8 my-auto w-[90px] ml-40'>Active<span className=' ml-2 mt-2 w-2 h-2 rounded-full bg-green-500'></span></div>
            <div className='w-[80px] mx-auto text-center my-3'>{internship.views}</div>
            <Link to={`/recruiter/dashboard/${recruiterId}/applicants/${internship._id}`} className='text-center my-auto leading-5 w-32 h-6 hover:underline text-blue-500 hover:cursor-pointer mx-auto py-0'>{internship.applicantCount} Applicants</Link>
            <div className='text-center h-8 w-36 mx-auto my-auto'>
              <button onClick={() => openModal(internship)} className="text-blue-500 hover:underline ">View</button>
            </div>
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
                {/* <p className="text-gray-600 mb-4">Posted by: {selectedInternship.recruiter.firstname} {selectedInternship.recruiter.lastname}</p> */}
                <p className='text-gray-600 mb-4'>Posted: {TimeAgo(selectedInternship.createdAt)}</p>


                <div className="flex items-center text-gray-700 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{selectedInternship.internLocation ? `${selectedInternship.internLocation}` : 'Remote'}</span>
                </div>

                <div className="flex items-center text-gray-700 mb-2">
                  <FaMoneyBillWave className="mr-2" />
                  <span>₹ {selectedInternship.stipend}</span>
                </div>
                <div className="flex items-center text-gray-700 mb-2">
                  <FaClock className="mr-2" />
                  <span>{selectedInternship.duration} Months</span>
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

export default RecDashboard;
