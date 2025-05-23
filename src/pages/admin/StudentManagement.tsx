import { useState, useRef } from 'react';
import { Search, UserPlus, Edit, Trash2, User, Upload } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import { Student, Department } from '../../types';
import { departments } from '../../data/mockData';
import Papa from 'papaparse';

const StudentManagement = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    id: '',
    name: '',
    email: '',
    department: departments[0],
    enrollmentYear: new Date().getFullYear().toString(),
    semester: '1',
    phone: '',
    profileImage: '',
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const headers = results.data[0] as string[];
          const rows = results.data.slice(1) as string[][];
          
          rows.forEach(row => {
            if (row.length === headers.length) {
              const studentData: Partial<Student> = {
                id: `S${Math.floor(1000 + Math.random() * 9000)}`,
                name: row[headers.indexOf('name')],
                email: row[headers.indexOf('email')],
                department: row[headers.indexOf('department')] as Department,
                enrollmentYear: row[headers.indexOf('enrollmentYear')] || new Date().getFullYear().toString(),
                semester: row[headers.indexOf('semester')] || '1',
                phone: row[headers.indexOf('phone')],
                password: 'password',
                role: 'student',
                courses: [],
                attendanceRecords: [],
                grades: [],
              };
              
              if (studentData.name && studentData.email && studentData.department) {
                addStudent(studentData as Student);
              }
            }
          });
        },
        header: true,
        skipEmptyLines: true
      });
    }
  };

  const filteredStudents = students
    .filter(student => 
      (filterDepartment === 'All' || student.department === filterDepartment) &&
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       student.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.email && newStudent.department) {
      const student: Student = {
        id: `S${Math.floor(1000 + Math.random() * 9000)}`,
        name: newStudent.name,
        email: newStudent.email,
        department: newStudent.department as Department,
        enrollmentYear: newStudent.enrollmentYear || new Date().getFullYear().toString(),
        semester: newStudent.semester || '1',
        phone: newStudent.phone || '',
        profileImage: newStudent.profileImage || '',
        password: 'password',
        role: 'student',
        courses: [],
        attendanceRecords: [],
        grades: [],
      };
      
      addStudent(student);
      setNewStudent({
        id: '',
        name: '',
        email: '',
        department: departments[0],
        enrollmentYear: new Date().getFullYear().toString(),
        semester: '1',
        phone: '',
        profileImage: '',
      });
      setShowAddModal(false);
    }
  };

  const handleEditStudent = () => {
    if (currentStudent && currentStudent.name && currentStudent.email && currentStudent.department) {
      updateStudent(currentStudent.id, currentStudent);
      setShowEditModal(false);
    }
  };

  const openEditModal = (student: Student) => {
    setCurrentStudent({ ...student });
    setShowEditModal(true);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Upload className="h-5 w-5 mr-1" />
            Import CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-5 w-5 mr-1" />
            Add Student
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or ID..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:w-64">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                <option value="All">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {student.profileImage ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={student.profileImage}
                              alt={student.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.enrollmentYear}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.semester}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(student)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Student</h3>
              <div className="mt-4">
                <div className="space-y-4">
                  <div className="text-left">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newStudent.name || ''}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newStudent.email || ''}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      Department*
                    </label>
                    <select
                      id="department"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newStudent.department || departments[0]}
                      onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value as Department })}
                      required
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-left">
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                      Enrollment Year
                    </label>
                    <input
                      type="text"
                      id="year"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newStudent.enrollmentYear || new Date().getFullYear().toString()}
                      onChange={(e) => setNewStudent({ ...newStudent, enrollmentYear: e.target.value })}
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                      Semester
                    </label>
                    <select
                      id="semester"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newStudent.semester || '1'}
                      onChange={(e) => setNewStudent({ ...newStudent, semester: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem.toString()}>{sem}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-left">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="text"
                      id="phone"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newStudent.phone || ''}
                      onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="mr-2 px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && currentStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Student</h3>
              <div className="mt-4">
                <div className="space-y-4">
                  <div className="text-left">
                    <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                      Name*
                    </label>
                    <input
                      type="text"
                      id="edit-name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentStudent.name}
                      onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                      Email*
                    </label>
                    <input
                      type="email"
                      id="edit-email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentStudent.email}
                      onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="edit-department" className="block text-sm font-medium text-gray-700">
                      Department*
                    </label>
                    <select
                      id="edit-department"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentStudent.department}
                      onChange={(e) => setCurrentStudent({ ...currentStudent, department: e.target.value as Department })}
                      required
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-left">
                    <label htmlFor="edit-year" className="block text-sm font-medium text-gray-700">
                      Enrollment Year
                    </label>
                    <input
                      type="text"
                      id="edit-year"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentStudent.enrollmentYear}
                      onChange={(e) => setCurrentStudent({ ...currentStudent, enrollmentYear: e.target.value })}
                    />
                  </div>
                  <div className="text-left">
                    <label htmlFor="edit-semester" className="block text-sm font-medium text-gray-700">
                      Semester
                    </label>
                    <select
                      id="edit-semester"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentStudent.semester}
                      onChange={(e) => setCurrentStudent({ ...currentStudent, semester: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem.toString()}>{sem}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-left">
                    <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="text"
                      id="edit-phone"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={currentStudent.phone}
                      onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="mr-2 px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleEditStudent}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;