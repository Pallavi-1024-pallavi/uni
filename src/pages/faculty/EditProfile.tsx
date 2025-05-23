import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Faculty, WorkExperience } from '../../types';
import MediaPicker from '../../components/common/MediaPicker';

const FacultyEditProfile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const faculty = currentUser as Faculty;
  const navigate = useNavigate();
  
  const [name, setName] = useState(faculty.name);
  const [dob, setDob] = useState(faculty.dob || '');
  const [gender, setGender] = useState(faculty.gender || '');
  const [bloodGroup, setBloodGroup] = useState(faculty.bloodGroup || '');
  const [phone, setPhone] = useState(faculty.phone || '');
  const [nationality, setNationality] = useState(faculty.nationality || '');
  const [profileImage, setProfileImage] = useState(faculty.profileImage);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>(
    faculty.workExperience || []
  );

  const handleAddExperience = () => {
    setWorkExperience([
      ...workExperience,
      {
        organization: '',
        startYear: '',
        endYear: '',
        description: '',
        achievements: '',
        research: ''
      }
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    const newExperience = [...workExperience];
    newExperience.splice(index, 1);
    setWorkExperience(newExperience);
  };

  const handleExperienceChange = (index: number, field: keyof WorkExperience, value: string) => {
    const newExperience = [...workExperience];
    newExperience[index] = {
      ...newExperience[index],
      [field]: value
    };
    setWorkExperience(newExperience);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields in work experience
    const validExperience = workExperience.filter(exp => 
      exp.organization && exp.startYear
    );
    
    updateUserProfile({
      name,
      dob,
      gender,
      bloodGroup,
      phone,
      nationality,
      profileImage,
      workExperience: validExperience
    });
    
    navigate('/faculty/profile');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Faculty Profile</h1>
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
                  value={faculty.email}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="faculty-id" className="block text-sm font-medium text-gray-700">
                  Faculty ID (Read Only)
                </label>
                <input
                  type="text"
                  id="faculty-id"
                  value={faculty.id}
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
                  value={faculty.department}
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
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Work Experience</h2>
            <button
              type="button"
              onClick={handleAddExperience}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Experience
            </button>
          </div>
          
          <div className="p-6">
            {workExperience.length === 0 ? (
              <p className="text-gray-500">No work experience added. Click the button above to add your work history.</p>
            ) : (
              <div className="space-y-6">
                {workExperience.map((exp, index) => (
                  <div key={index} className="border p-4 rounded-md relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Organization/Institution*
                        </label>
                        <input
                          type="text"
                          value={exp.organization}
                          onChange={(e) => handleExperienceChange(index, 'organization', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Start Year*
                          </label>
                          <input
                            type="text"
                            value={exp.startYear}
                            onChange={(e) => handleExperienceChange(index, 'startYear', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                            placeholder="YYYY"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            End Year
                          </label>
                          <input
                            type="text"
                            value={exp.endYear || ''}
                            onChange={(e) => handleExperienceChange(index, 'endYear', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="YYYY or 'Present'"
                          />
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          value={exp.description || ''}
                          onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Achievements
                        </label>
                        <textarea
                          value={exp.achievements || ''}
                          onChange={(e) => handleExperienceChange(index, 'achievements', e.target.value)}
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Research Work
                        </label>
                        <textarea
                          value={exp.research || ''}
                          onChange={(e) => handleExperienceChange(index, 'research', e.target.value)}
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/faculty/profile')}
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

export default FacultyEditProfile;