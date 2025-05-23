import { useState } from 'react';
import { User, Calendar, Mail, Phone, MapPin, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';

const StudentProfile = () => {
  const { currentUser } = useAuth();
  const student = currentUser as Student;
  const navigate = useNavigate();
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
        <button
          onClick={() => navigate('/student/profile/edit')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Edit Profile
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-blue-50 p-8 flex flex-col items-center">
            {student.profileImage ? (
              <img 
                src={student.profileImage} 
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-md" 
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                <User className="h-20 w-20 text-blue-500" />
              </div>
            )}
            <h2 className="mt-4 text-xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-blue-600 font-medium">Student</p>
            <p className="text-gray-600 mt-1">{student.department}</p>
            
            <div className="mt-8 w-full space-y-3">
              <div className="flex items-center text-gray-700">
                <Mail className="h-5 w-5 mr-2 text-gray-500" />
                <span>{student.email}</span>
              </div>
              {student.phone && (
                <div className="flex items-center text-gray-700">
                  <Phone className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{student.phone}</span>
                </div>
              )}
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <span>Year: {student.enrollmentYear}, Semester: {student.semester}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                <span>Student ID: {student.id}</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Basic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="text-gray-900">{student.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Enrollment Year</p>
                  <p className="text-gray-900">{student.enrollmentYear}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Current Semester</p>
                  <p className="text-gray-900">{student.semester}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p className="text-gray-900">{student.dob || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-gray-900">{student.gender || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Blood Group</p>
                  <p className="text-gray-900">{student.bloodGroup || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nationality</p>
                  <p className="text-gray-900">{student.nationality || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-gray-900">{student.address || 'Not specified'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Educational Details
              </h3>
              
              <div className="space-y-4">
                {student.education?.highSchool && (
                  <div className="border-l-4 border-blue-200 pl-4 py-2">
                    <p className="font-medium text-gray-900">High School (10th)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-xs text-gray-500">Institution</p>
                        <p className="text-sm">{student.education.highSchool.institution}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Board</p>
                        <p className="text-sm">{student.education.highSchool.board}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Year of Passing</p>
                        <p className="text-sm">{student.education.highSchool.passingYear}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Percentage/CGPA</p>
                        <p className="text-sm">{student.education.highSchool.percentage}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {student.education?.intermediateOrDiploma && (
                  <div className="border-l-4 border-teal-200 pl-4 py-2">
                    <p className="font-medium text-gray-900">
                      {student.education.intermediateOrDiploma.type === 'intermediate' 
                        ? 'Intermediate (12th)' 
                        : 'Diploma'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-xs text-gray-500">Institution</p>
                        <p className="text-sm">{student.education.intermediateOrDiploma.institution}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Board/University</p>
                        <p className="text-sm">{student.education.intermediateOrDiploma.board}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Year of Passing</p>
                        <p className="text-sm">{student.education.intermediateOrDiploma.passingYear}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Percentage/CGPA</p>
                        <p className="text-sm">{student.education.intermediateOrDiploma.percentage}</p>
                      </div>
                      {student.education.intermediateOrDiploma.specialization && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-gray-500">Specialization</p>
                          <p className="text-sm">{student.education.intermediateOrDiploma.specialization}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {student.education?.college && (
                  <div className="border-l-4 border-orange-200 pl-4 py-2">
                    <p className="font-medium text-gray-900">College Education</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-xs text-gray-500">Degree</p>
                        <p className="text-sm">{student.education.college.degree}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Field of Study</p>
                        <p className="text-sm">{student.education.college.fieldOfStudy}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">Institution</p>
                        <p className="text-sm">{student.education.college.institution}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Starting Year</p>
                        <p className="text-sm">{student.education.college.startYear}</p>
                      </div>
                      {student.education.college.endYear && (
                        <div>
                          <p className="text-xs text-gray-500">End Year</p>
                          <p className="text-sm">{student.education.college.endYear}</p>
                        </div>
                      )}
                      {student.education.college.currentCGPA && (
                        <div>
                          <p className="text-xs text-gray-500">Current CGPA</p>
                          <p className="text-sm">{student.education.college.currentCGPA}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {!student.education?.highSchool && !student.education?.intermediateOrDiploma && !student.education?.college && (
                  <p className="text-gray-500">No educational details added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;