import { useState, useRef } from 'react';
import { useDataContext } from '../../context/DataContext';
import { ArrowRight, ArrowLeft, Search, Upload } from 'lucide-react';
import Papa from 'papaparse';

const AssignStudents = () => {
  const { courses, students, faculties, addStudent } = useDataContext();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignedStudents, setAssignedStudents] = useState<{[courseId: string]: string[]}>({});
  const [assignedFaculty, setAssignedFaculty] = useState<{[courseId: string]: string[]}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          
          // Reset file input
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

  const handleAssignStudent = (studentId: string) => {
    if (selectedCourse) {
      setAssignedStudents(prev => ({
        ...prev,
        [selectedCourse]: [...(prev[selectedCourse] || []), studentId]
      }));
    }
  };

  const handleUnassignStudent = (studentId: string) => {
    if (selectedCourse) {
      setAssignedStudents(prev => ({
        ...prev,
        [selectedCourse]: prev[selectedCourse].filter(id => id !== studentId)
      }));
    }
  };

  const handleAssignFaculty = (facultyId: string) => {
    if (selectedCourse) {
      setAssignedFaculty(prev => ({
        ...prev,
        [selectedCourse]: [...(prev[selectedCourse] || []), facultyId]
      }));
    }
  };

  const handleUnassignFaculty = (facultyId: string) => {
    if (selectedCourse) {
      setAssignedFaculty(prev => ({
        ...prev,
        [selectedCourse]: prev[selectedCourse].filter(id => id !== facultyId)
      }));
    }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Available Students</h3>
                <div className="space-y-2">
                  {filteredStudents
                    .filter(student => !assignedStudents[selectedCourse]?.includes(student.id))
                    .map(student => (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.id}</p>
                        </div>
                        <button
                          onClick={() => handleAssignStudent(student.id)}
                          className="p-2 text-blue-600 hover:text-blue-800"
                        >
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Assigned Students</h3>
                <div className="space-y-2">
                  {assignedStudents[selectedCourse]?.map(studentId => {
                    const student = students.find(s => s.id === studentId);
                    if (!student) return null;
                    
                    return (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.id}</p>
                        </div>
                        <button
                          onClick={() => handleUnassignStudent(student.id)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Faculty</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {faculties.map(faculty => (
                  <div key={faculty.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{faculty.name}</p>
                        <p className="text-sm text-gray-500">{faculty.department}</p>
                      </div>
                      <button
                        onClick={() => 
                          assignedFaculty[selectedCourse]?.includes(faculty.id)
                            ? handleUnassignFaculty(faculty.id)
                            : handleAssignFaculty(faculty.id)
                        }
                        className={`px-3 py-1 rounded-full text-sm ${
                          assignedFaculty[selectedCourse]?.includes(faculty.id)
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }`}
                      >
                        {assignedFaculty[selectedCourse]?.includes(faculty.id)
                          ? 'Unassign'
                          : 'Assign'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignStudents;