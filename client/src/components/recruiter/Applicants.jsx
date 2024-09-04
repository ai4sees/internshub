import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../common/Spinner';
import api from '../common/server_url';
import { FaTimes } from 'react-icons/fa';

const Applicants = () => {
  const { recruiterId, internshipId } = useParams(); // Get recruiterId and internshipId from URL
  const [applicants, setApplicants] = useState([]);
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchApplicantsAndInternship = async () => {
      try {
        // Fetch the internship details
        const internshipResponse = await axios.get(`${api}/recruiter/internship/${recruiterId}/getDetails/${internshipId}`);
        setInternship(internshipResponse.data);

        // Fetch the applicants
        const applicantsResponse = await axios.get(`${api}/recruiter/internship/${recruiterId}/applicants/${internshipId}`);
        setApplicants(applicantsResponse.data);

        setLoading(false);
        console.log(applicantsResponse.data);
      } catch (err) {
        console.error('Error fetching applicants or internship details:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchApplicantsAndInternship();
  }, [recruiterId, internshipId]);

  const calculateMatchPercentage = (studentSkills, requiredSkills) => {
    if (!requiredSkills || requiredSkills.length === 0) return 0;

    const sanitizeSkill = (skill) => {
      return skill
        .toLowerCase()
        .replace(/[\.\-]/g, '') // Remove dots and hyphens
        .split(/\s+/); // Split into words
    };

    const matchingSkills = studentSkills.filter(studentSkill => {
      return requiredSkills.some(requiredSkill => {
        const studentSkillWords = sanitizeSkill(studentSkill.skillName);
        const requiredSkillWords = sanitizeSkill(requiredSkill);

        // Check if all words in requiredSkill match any word in studentSkill
        return requiredSkillWords.every(word =>
          studentSkillWords.includes(word)
        );
      });
    });

    const matchPercentage = (matchingSkills.length / requiredSkills.length) * 100;
    return Math.round(matchPercentage);
  };



  console.log(internship);

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
      <h1 className="text-3xl font-bold text-center mb-8">Applicants for {internship.internshipName}</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-[90%] my-3 mx-auto">
        {applicants.length === 0 ? (
          <p className="text-center text-gray-500">No applicants for this internship yet.</p>
        ) : (
          <div className="space-y-4">
            {applicants.map((student) => (
              <div key={student._id} className="p-4 border rounded-lg shadow-sm bg-gray-50 relative">
                <h2 className="text-2xl font-semibold mb-2 capitalize">
                  {student.firstname} {student.lastname}
                </h2>

                {/* Skills */}
                <div className="mb-2">
                  <h3 className="font-semibold">Skills:</h3>
                  <div className='flex space-x-3'>
                    {student.skills.map((skill, index) => (
                      <p key={index} className='bg-blue-300 rounded-lg px-3 py-2 capitalize'>{skill.skillName} </p>
                    ))}
                  </div>
                </div>

                {/* Match Percentage */}
                <div className="mb-2">
                  <p className={`font-semibold ${calculateMatchPercentage(student.skills, internship?.skills) < 20
                    ? 'text-red-500'
                    : calculateMatchPercentage(student.skills, internship?.skills) >= 20 &&
                      calculateMatchPercentage(student.skills, internship?.skills) <= 60
                      ? 'text-orange-300'
                      : calculateMatchPercentage(student.skills, internship?.skills) > 60 &&
                        calculateMatchPercentage(student.skills, internship?.skills) <= 90
                        ? 'text-yellow-500'
                        : 'text-green-500'
                    }`}>
                    {calculateMatchPercentage(student.skills, internship?.skills)}% Matched
                  </p>
                </div>

                {!isOpen && <button onClick={() => setIsOpen(true)} className='absolute right-3 top-4 underline text-blue-400'>View Profile</button>}
                {isOpen && <button onClick={() => setIsOpen(false)} className='absolute right-3 top-4 underline text-blue-400'>Hide Profile</button>}

                {isOpen &&
                  <div className='relative'>
                    {/* Education */}
                    <div className="mb-2">
                      <h3 className="font-semibold">Education:</h3>
                      {student.education.map((edu, index) => (
                        <p key={index}>
                          {edu.degree} in {edu.fieldOfStudy} from {edu.institution} ({edu.startYear} - {edu.endYear})
                        </p>
                      ))}
                    </div>


                    {/* Work Experience */}
                    <div className="mb-2">
                      <h3 className="font-semibold">Work Experience:</h3>
                      {student.workExperience.map((work, index) => (
                        <p key={index}>
                          {work.role} at {work.company} ({work.startDate} - {work.endDate})
                        </p>
                      ))}
                    </div>



                    {/* Certificates */}
                    <div className="mb-2">
                      <h3 className="font-semibold">Certificates:</h3>
                      {student.certificates.map((cert, index) => (
                        <p key={index}>
                          {cert.title} - {cert.issuingOrganization} ({cert.issueDate})
                        </p>
                      ))}
                    </div>

                    {/* Personal Projects */}
                    <div className="mb-2">
                      <h3 className="font-semibold">Personal Projects:</h3>
                      {student.personalProjects.map((project, index) => (
                        <p key={index}>
                          {project.title} - {project.description}
                        </p>
                      ))}
                    </div>

                    {/* Portfolio Links */}
                    <div className="mb-2">
                      <h3 className="font-semibold">Portfolio Links:</h3>
                      {student.portfolioLink.map((link, index) => (
                        <p key={index}>
                          {link.linkType}: <a href={link.linkUrl} className="text-blue-500 hover:underline">{link.linkUrl}</a>
                        </p>
                      ))}
                      <p className="text-gray-700 mb-1"><strong>Email:</strong> {student.email}</p>
                    </div>
                    {/* Resume Link */}
                    <div className="mb-2">
                      <h3 className="font-semibold">Resume:</h3>
                      <a
                        href={`data:${student.resume.contentType};base64,${btoa(
                          String.fromCharCode(...new Uint8Array(student.resume.data.data))
                        )}`}
                        download={student.resume.filename}
                        className="text-blue-500 hover:underline"
                      >
                        Download Resume
                      </a>
                    </div>
                  </div>
                }
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
