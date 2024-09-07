import React, { useEffect, useState } from 'react';
import axios from 'axios';
import getUserIdFromToken from './auth/authUtils';
import Spinner from '../common/Spinner';
import api from '../common/server_url';
import TimeAgo from '../common/TimeAgo';

const MyApplications = () => {
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = getUserIdFromToken();

  useEffect(() => {
    // console.log('insideeeeeeeeeeeee')
    const fetchAppliedInternships = async () => {
      try {
        const response = await axios.get(`${api}/student/internship/${userId}/applied-internships`);
        
        // const updatedAppliedInternships = response.data.map(application => ({
        //   internship: application.internship,
        //   recruiter: application.recruiter,
        //   appliedAt: application.appliedAt,
        // }));
        // console.log('inside applicants',updatedAppliedInternships);
        setAppliedInternships(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applied internships:', err);
        setError('Failed to fetch applied internships. Please try again later.');
        setLoading(false);
      }
    };

    fetchAppliedInternships();
  }, [userId]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p className="text-xl font-semibold text-red-500">{error}</p>;
  }

  return (
    <div className="py-10 px-5 mt-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">My Applications</h1>
      <div className="flex flex-col justify-center">
        {appliedInternships.map((applied) => (
          <div key={applied.internship._id} className="bg-white shadow-md rounded-lg p-6 w-[60%] my-3 mx-auto relative">
            <h2 className="text-2xl font-semibold mb-2">{applied.internship.internshipName}</h2>
            <p className="text-gray-600 mb-4">Posted by: {applied.recruiter.firstname} {applied.recruiter.lastname}</p>
            <p className='text-gray-600 mb-4'>Posted: {TimeAgo(applied.internship.createdAt)}</p>
            <p className="text-gray-600 mb-4">Status: Applied</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
