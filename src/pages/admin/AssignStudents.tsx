import { useState, useRef } from 'react';
import { useDataContext } from '../../context/DataContext';
import { ArrowRight, ArrowLeft, Search, Upload, UserPlus, X } from 'lucide-react';
import Papa from 'papaparse';

const AssignStudents = () => {
  const { courses, students, faculties, addStudent } = useDataContext();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignedStudents, setAssignedStudents] = useState<{[facultyId: string]: string[]}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const headers = results.data[0] as string[];
          const rows = results.data.slice(1) as string[][];
          
          rows.forEach(row => {
            if (row.length === headers.length) {
              const studentData = {
                id: `S${Math.floor(1000 + Math.random() * 9000)}`,
                name: row[headers.indexOf('name')],
                email: row[headers.indexOf('email')],
                department: row[headers.indexOf('department')],
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
                addStudent(studentData);
              }
            }
          });
          
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          alert('Students imported successfully!');
        },
        header: true,
        skipEmptyLines: true
      });
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enrolledStudents = selectedCourse
    ? students.filter(student => student.courses.includes(selectedCourse))
    : [];

  const handleAssignToFaculty = () => {
    if (selectedFaculty && selectedStudents.length > 0) {
      setAssignedStudents(prev => ({
        ...prev,
        [selectedFaculty]: [...(prev[selectedFaculty] || []), ...selectedStudents]
      }));
      setSelectedStudents([]);
      setShowAssignModal(false);
    }
  };

  const handleUnassignFromFaculty = (facultyId: string, studentId: string) => {
    setAssignedStudents(prev => ({
      ...prev,
      [facultyId]: prev[facultyId].filter(id => id !== studentId)
    }));
  };

  const getStudentsByFaculty = (facultyId: string) => {
    return assignedStudents[facultyId] || [];
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Assign Students</h1>
          <div>
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
              Import Students (CSV)
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                Select Course
              </label>
              <select
                id="course"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Select a Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search Students
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by name or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {selectedCourse && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Enrolled Students</h2>
              <button
                onClick={() => setShowAssignModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={enrolledStudents.length === 0}
              >
                <UserPlus className="h-5 w-5 mr-1" />
                Assign to Faculty
              </button>
            </div>

            <div className="space-y-6">
              {faculties.map(faculty => {
                const assignedStudentIds = getStudentsByFaculty(faculty.id);
                const assignedStudentDetails = students.filter(student => 
                  assignedStudentIds.includes(student.id)
                );

                return (
                  <div key={faculty.id} className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {faculty.name} - {assignedStudentDetails.length} students
                    </h3>
                    <div className="space-y-2">
                      {assignedStudentDetails.map(student => (
                        <div key={student.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.id}</p>
                          </div>
                          <button
                            onClick={() => handleUnassignFromFaculty(faculty.id, student.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Assign to Faculty Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Students to Faculty</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Faculty
                </label>
                <select
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                >
                  <option value="">Choose a faculty member</option>
                  {faculties.map(faculty => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name} - {faculty.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Students
                </label>
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {enrolledStudents.map(student => (
                    <div key={student.id} className="flex items-center p-3 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents([...selectedStudents, student.id]);
                          } else {
                            setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedStudents([]);
                    setSelectedFaculty('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignToFaculty}
                  disabled={!selectedFaculty || selectedStudents.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Assign Students
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignStudents;