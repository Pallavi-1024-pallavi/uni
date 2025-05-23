import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Student, Education } from '../../types';
import MediaPicker from '../../components/common/MediaPicker';

const StudentEditProfile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const student = currentUser as Student;
  const navigate = useNavigate();
  
  const [name, setName] = useState(student.name);
  const [dob, setDob] = useState(student.dob || '');
  const [gender, setGender] = useState(student.gender || '');
  const [bloodGroup, setBloodGroup] = useState(student.bloodGroup || '');
  const [phone, setPhone] = useState(student.phone || '');
  const [nationality, setNationality] = useState(student.nationality || '');
  const [address, setAddress] = useState(student.address || '');
  const [profileImage, setProfileImage] = useState(student.profileImage);
  const [education, setEducation] = useState<Education>(
    student.education || {}
  );

  const handleEducationChange = (
    level: 'highSchool' | 'intermediateOrDiploma' | 'college', 
    field: string, 
    value: string
  ) => {
    setEducation(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUserProfile({
      name,
      dob,
      gender,
      bloodGroup,
      phone,
      nationality,
      address,
      profileImage,
      education
    });
    
    navigate('/student/profile');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Student Profile</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Profile Image</h2>
            <div className="mt-4 flex justify-center">
              <MediaPicker 
                currentImage={profileImage} 
                onImageSelected={setProfileImage} 
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Basic Details</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name*
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email (Read Only)
                </label>
                <input
                  type="email"
                  id="email"
                  value={student.email}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="student-id" className="block text-sm font-medium text-gray-700">
                  Student ID (Read Only)
                </label>
                <input
                  type="text"
                  id="student-id"
                  value={student.id}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department (Read Only)
                </label>
                <input
                  type="text"
                  id="department"
                  value={student.department}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="blood-group" className="block text-sm font-medium text-gray-700">
                  Blood Group
                </label>
                <select
                  id="blood-group"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                  Nationality
                </label>
                <input
                  type="text"
                  id="nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  id="address"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Educational Details</h2>
            <div className="mt-4 space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="text-md font-medium text-gray-800 mb-3">High School (10th)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hs-institution" className="block text-sm font-medium text-gray-700">
                      Institution*
                    </label>
                    <input
                      type="text"
                      id="hs-institution"
                      value={education.highSchool?.institution || ''}
                      onChange={(e) => handleEducationChange('highSchool', 'institution', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="hs-board" className="block text-sm font-medium text-gray-700">
                      Board*
                    </label>
                    <input
                      type="text"
                      id="hs-board"
                      value={education.highSchool?.board || ''}
                      onChange={(e) => handleEducationChange('highSchool', 'board', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="hs-passing-year" className="block text-sm font-medium text-gray-700">
                      Year of Passing*
                    </label>
                    <input
                      type="text"
                      id="hs-passing-year"
                      value={education.highSchool?.passingYear || ''}
                      onChange={(e) => handleEducationChange('highSchool', 'passingYear', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="YYYY"
                    />
                  </div>
                  <div>
                    <label htmlFor="hs-percentage" className="block text-sm font-medium text-gray-700">
                      Percentage/CGPA*
                    </label>
                    <input
                      type="text"
                      id="hs-percentage"
                      value={education.highSchool?.percentage || ''}
                      onChange={(e) => handleEducationChange('highSchool', 'percentage', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-md font-medium text-gray-800 mb-3">Intermediate (12th) / Diploma</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="intermediate"
                        checked={education.intermediateOrDiploma?.type === 'intermediate'}
                        onChange={() => handleEducationChange('intermediateOrDiploma', 'type', 'intermediate')}
                        className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Intermediate (12th)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="diploma"
                        checked={education.intermediateOrDiploma?.type === 'diploma'}
                        onChange={() => handleEducationChange('intermediateOrDiploma', 'type', 'diploma')}
                        className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Diploma</span>
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="int-institution" className="block text-sm font-medium text-gray-700">
                      Institution*
                    </label>
                    <input
                      type="text"
                      id="int-institution"
                      value={education.intermediateOrDiploma?.institution || ''}
                      onChange={(e) => handleEducationChange('intermediateOrDiploma', 'institution', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="int-board" className="block text-sm font-medium text-gray-700">
                      Board/University*
                    </label>
                    <input
                      type="text"
                      id="int-board"
                      value={education.intermediateOrDiploma?.board || ''}
                      onChange={(e) => handleEducationChange('intermediateOrDiploma', 'board', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  {education.intermediateOrDiploma?.type === 'diploma' && (
                    <div>
                      <label htmlFor="int-specialization" className="block text-sm font-medium text-gray-700">
                        Specialization
                      </label>
                      <input
                        type="text"
                        id="int-specialization"
                        value={education.intermediateOrDiploma?.specialization || ''}
                        onChange={(e) => handleEducationChange('intermediateOrDiploma', 'specialization', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="int-passing-year" className="block text-sm font-medium text-gray-700">
                      Year of Passing*
                    </label>
                    <input
                      type="text"
                      id="int-passing-year"
                      value={education.intermediateOrDiploma?.passingYear || ''}
                      onChange={(e) => handleEducationChange('intermediateOrDiploma', 'passingYear', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="YYYY"
                    />
                  </div>
                  <div>
                    <label htmlFor="int-percentage" className="block text-sm font-medium text-gray-700">
                      Percentage/CGPA*
                    </label>
                    <input
                      type="text"
                      id="int-percentage"
                      value={education.intermediateOrDiploma?.percentage || ''}
                      onChange={(e) => handleEducationChange('intermediateOrDiploma', 'percentage', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-md font-medium text-gray-800 mb-3">College Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="college-degree" className="block text-sm font-medium text-gray-700">
                      Degree*
                    </label>
                    <input
                      type="text"
                      id="college-degree"
                      value={education.college?.degree || ''}
                      onChange={(e) => handleEducationChange('college', 'degree', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="college-field" className="block text-sm font-medium text-gray-700">
                      Field of Study*
                    </label>
                    <input
                      type="text"
                      id="college-field"
                      value={education.college?.fieldOfStudy || ''}
                      onChange={(e) => handleEducationChange('college', 'fieldOfStudy', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="college-institution" className="block text-sm font-medium text-gray-700">
                      Institution*
                    </label>
                    <input
                      type="text"
                      id="college-institution"
                      value={education.college?.institution || ''}
                      onChange={(e) => handleEducationChange('college', 'institution', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="college-start-year" className="block text-sm font-medium text-gray-700">
                      Starting Year*
                    </label>
                    <input
                      type="text"
                      id="college-start-year"
                      value={education.college?.startYear || ''}
                      onChange={(e) => handleEducationChange('college', 'startYear', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="YYYY"
                    />
                  </div>
                  <div>
                    <label htmlFor="college-end-year" className="block text-sm font-medium text-gray-700">
                      End Year (or Expected)
                    </label>
                    <input
                      type="text"
                      id="college-end-year"
                      value={education.college?.endYear || ''}
                      onChange={(e) => handleEducationChange('college', 'endYear', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="YYYY or 'Present'"
                    />
                  </div>
                  <div>
                    <label htmlFor="college-cgpa" className="block text-sm font-medium text-gray-700">
                      Current CGPA
                    </label>
                    <input
                      type="text"
                      id="college-cgpa"
                      value={education.college?.currentCGPA || ''}
                      onChange={(e) => handleEducationChange('college', 'currentCGPA', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/student/profile')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentEditProfile;