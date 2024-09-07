import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaMoneyBillWave, FaUsers, FaClipboardList, FaTimes, FaClock, FaCheck } from 'react-icons/fa';
import Spinner from '../common/Spinner';
import getUserIdFromToken from './auth/authUtils';
import TimeAgo from '../common/TimeAgo';
import api from '../common/server_url';
import { toast } from 'react-toastify';
// import CustomDropdown from './utils/CustomDropdown';
import Select from 'react-select';
import CustomRadio from './utils/CustomRadio';
import StipendSlider from './utils/StipendSlider';
// import CustomRadio from './utils/CustomRadio';


const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const userId = getUserIdFromToken();
  const statesAndUTs = [
    { value: 'All Locations', label: 'All Locations' },
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
    { value: 'Assam', label: 'Assam' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh' },
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Manipur', label: 'Manipur' },
    { value: 'Meghalaya', label: 'Meghalaya' },
    { value: 'Mizoram', label: 'Mizoram' },
    { value: 'Nagaland', label: 'Nagaland' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Sikkim', label: 'Sikkim' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Tripura', label: 'Tripura' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Uttarakhand', label: 'Uttarakhand' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands' },
    { value: 'Chandigarh', label: 'Chandigarh' },
    { value: 'Dadra and Nagar Haveli and Daman and Diu', label: 'Dadra and Nagar Haveli and Daman and Diu' },
    { value: 'Lakshadweep', label: 'Lakshadweep' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Puducherry', label: 'Puducherry' },
    { value: 'Jammu and Kashmir', label: 'Jammu and Kashmir' },
    { value: 'Ladakh', label: 'Ladakh' }
  ];
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [workType, setWorkType] = useState('');
  const [selectedStipend, setSelectedStipend] = useState(0);
  console.log(workType);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        console.log('LocationName', selectedLocation);
        console.log('WorkType:', workType);
        let queryParam = '';
        if (workType === 'Work from Home') {
          queryParam = '?workType=Work from Home';
          setSelectedLocation(null);
        } else if (workType === 'Work from Office' && selectedLocation) {
          queryParam = `?workType=Work from Office&locationName=${selectedLocation.value}`;
        } else if (workType === 'Work from Office' && !selectedLocation) {
          queryParam = '?workType=Work from Office';
        }

        if (selectedStipend > 0) {
          queryParam += queryParam ? `&minStipend=${selectedStipend}` : `?minStipend=${selectedStipend}`;
        }


        const response = await axios.get(`${api}/student/${userId}/internships${queryParam}`);
        const sortedInternships = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setInternships(sortedInternships);
        // console.log('response',sortedInternships);

        const appliedResponse = await axios.get(`${api}/student/internship/${userId}/applied-internships`);
        setAppliedInternships(appliedResponse.data);
        console.log('response', appliedResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching internships:', err);
        setError('Failed to fetch internships. Please try again later.');
        setLoading(false);
      }
    };

    fetchInternships();
  }, [userId, workType, selectedLocation, selectedStipend]);

  const openModal = async (internship) => {
    setSelectedInternship(internship);
    try {
      const response = await axios.put(`${api}/student/internship/${internship._id}/view`);
      // console.log(response.data);
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
        if (response.data.success) {
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

  const handleChange = (value) => {
    setSelectedLocation(value);
  }

  const handleReset = () => {
    setSelectedLocation(null);
    setWorkType('');
    setSelectedStipend(0);
  }

  const isAlreadyApplied = (internshipId) => {
    return appliedInternships.some((applied) => applied.internship._id === internshipId);
  };

  // const handleStipendChange = (stipend) => {
  //   setSelectedStipend(stipend);

  // };
  console.log(selectedStipend);


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
      
    <div className="py-10 px-5 mt-10 relative  bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 mt-8 absolute left-1/2 transform-translate-x-1/2 translate-x-14">{internships.length} Total Internships</h1>

      <div className='flex justify-end '>
        <div className=' w-[20%] mt-12 px-6 h-screen fixed left-28 shadow-xl border-t py-6 overflow-y-hidden bg-white'>
          <h1 className='text-center font-extrabold text-xl tracking-widest'>Filters</h1>

          <p className='mb-4 mt-6'>Type of Internship:</p>
          <button onClick={handleReset} className='absolute right-4 top-20 text-blue-400 underline'>Reset filters</button>
          <div className="flex flex-col space-y-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="work-type"
                value=""
                checked={workType === ''}
                onChange={(e) => setWorkType(e.target.value)}
                className="form-radio text-blue-600 h-6 w-6 "
              />
              <span className="text-[17px]">All Internships</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="work-type"
                value="Work from Home"
                checked={workType === 'Work from Home'}
                onChange={(e) => setWorkType(e.target.value)}
                className="form-radio text-green-600 h-6 w-6"
              />
              <span className="">Work from Home</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="work-type"
                value="Work from Office"
                checked={workType === 'Work from Office'}
                onChange={(e) => setWorkType(e.target.value)}
                className="form-radio text-blue-600 h-6 w-6"
              />
              <span className="">Work from Office</span>
            </label>
          </div>

          <StipendSlider selectedStipend={selectedStipend}
            setSelectedStipend={setSelectedStipend} />


          {
            workType === 'Work from Office' &&
            <div className='mt-20'>
              <p className='mt-6 mb-2 font-bold'>Location</p>
              <Select
                options={statesAndUTs}
                values={selectedLocation}
                onChange={handleChange}
                placeholder="Select a location"
                searchable={true}
                className=''
              />
            </div>

          }

        </div>


        <div className="w-[60%] mr-32 mt-28 ">

          <div className="flex flex-col justify-center bg-gray-100">
            {internships.map((internship) => (
              <div key={internship._id} className="bg-white shadow-md rounded-lg p-6 w-[95%] my-3 mx-auto relative">
                <h2 className="text-2xl font-semibold mb-2">{internship.internshipName}</h2>
                <button
                  onClick={() => openModal(internship)}
                  className="absolute right-4 top-8 w-auto py-2 px-4 rounded-md text-blue-500 hover:scale-125 duration-300"
                >
                  View details
                </button>
                {/* <p className="text-gray-600 mb-4">Posted by: {internship.recruiter.firstname} {internship.recruiter.lastname}</p> */}
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

                {isAlreadyApplied(internship._id) && (
                  <p className="text-green-600 inline-flex rounded-xl border border-green-600 px-2 py-1">Applied<FaCheck className='ml-2 mt-1' /></p>
                )}
                <div className='text-gray-500 my-2'>{internship.studentCount} Applicants</div>

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
      </div>

    </div>
  );
};

export default Internships;
