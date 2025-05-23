import { useState } from 'react';
import { User, Calendar, Mail, Phone, MapPin, Award, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Faculty } from '../../types';

const FacultyProfile = () => {
  const { currentUser } = useAuth();
  const faculty = currentUser as Faculty;
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Faculty Profile</h1>
        <button
          onClick={() => navigate('/faculty/profile/edit')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit Profile
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-blue-50 p-8 flex flex-col items-center">
            {faculty.profileImage ? (
              <img 
                src={faculty.profileImage} 
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md" 
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                <User className="h-20 w-20 text-blue-500" />
              </div>
            )}
            <h2 className="mt-4 text-xl font-bold text-gray-900">{faculty.name}</h2>
            <p className="text-blue-600 font-medium">{faculty.position}</p>
            <p className="text-gray-600 mt-1">{faculty.department}</p>
            
            <div className="mt-8 w-full space-y-3">
              <div className="flex items-center text-gray-700">
                <Mail className="h-5 w-5 mr-2 text-gray-500" />
                <span>{faculty.email}</span>
              </div>
              {faculty.phone && (
                <div className="flex items-center text-gray-700">
                  <Phone className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{faculty.phone}</span>
                </div>
              )}
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <span>Joined on {faculty.joinDate}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                <span>Faculty ID: {faculty.id}</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-600" />
                Basic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="text-gray-900">{faculty.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Position</p>
                  <p className="text-gray-900">{faculty.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-gray-900">{faculty.dob || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-gray-900">{faculty.gender || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{faculty.phone || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Blood Group</p>
                  <p className="text-gray-900">{faculty.bloodGroup || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nationality</p>
                  <p className="text-gray-900">{faculty.nationality || 'Not specified'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                Work Experience
              </h3>
              
              {faculty.workExperience && faculty.workExperience.length > 0 ? (
                <div className="space-y-4">
                  {faculty.workExperience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                      <p className="font-medium text-gray-900">{exp.organization}</p>
                      <p className="text-sm text-gray-600">{exp.startYear} - {exp.endYear || 'Present'}</p>
                      {exp.description && <p className="text-sm text-gray-700 mt-1">{exp.description}</p>}
                      {exp.achievements && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Achievements:</p>
                          <p className="text-sm text-gray-700">{exp.achievements}</p>
                        </div>
                      )}
                      {exp.research && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Research:</p>
                          <p className="text-sm text-gray-700">{exp.research}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No work experience added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfile;