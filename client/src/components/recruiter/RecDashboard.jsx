import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../common/Spinner'; // Assuming you have a spinner component
import getUserIdFromToken from './auth/authUtilsRecr'; // Utility to get user ID from token
import api from '../common/server_url'; // Your server URL

const RecDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const recruiterId = getUserIdFromToken();

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await axios.get(`${api}/recruiter/internship/${recruiterId}/getInternships`);
        setInternships(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching internships:', err);
        setError('Failed to fetch internships. Please try again later.');
        setLoading(false);
      }
    };

    fetchInternships();
  }, [recruiterId]);

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
           <div className='inline-flex justify-center w-[90px] ml-40'>Active<span className=' ml-2 mt-2 w-2 h-2 rounded-full bg-green-500'></span></div>
           <div className='w-[80px] mx-auto text-center my-3'>{internship.views}</div>
           <div className='text-center'>No details Right Now</div>
           <div className='text-center'>
             <button className="text-blue-500 hover:underline">View Details</button>
           </div>
         </div>
        ))}
      </div>
    </div>
  );
};

export default RecDashboard;
