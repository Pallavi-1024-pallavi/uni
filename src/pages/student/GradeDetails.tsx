import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Award, AlertCircle, CheckCircle, BookOpen } from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';

const GradeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses, assignments } = useDataContext();
  const { currentUser } = useAuth();
  const student = currentUser as Student;
  
  // Find the assignment
  const assignment = assignments.find(a => a.id === id);
  
  if (!assignment) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">Assignment not found</p>
        <button
          onClick={() => navigate('/student')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Return to Dashboard
        </button>
      </div>
    );
  }
  
  // Find the course
  const course = courses.find(c => c.id === assignment.courseId);
  
  // Find the grade for this assignment
  const grade = student.grades.find(g => g.assignmentId === assignment.id);
  
  // Calculate due status
  const dueDate = new Date(assignment.dueDate);
  const isPastDue = dueDate < new Date();
  const isCloseToDue = !isPastDue && (dueDate.getTime() - new Date().getTime()) < (3 * 24 * 60 * 60 * 1000); // 3 days
  
  // Calculate grade percentage if available
  const gradePercentage = grade ? Math.round((grade.marks / assignment.maxMarks) * 100) : null;
  
  // Determine grade status
  let gradeStatus = '';
  let gradeStatusColor = '';
  
  if (gradePercentage !== null) {
    if (gradePercentage >= 90) {
      gradeStatus = 'Excellent';
      gradeStatusColor = 'text-green-600';
    } else if (gradePercentage >= 80) {
      gradeStatus = 'Very Good';
      gradeStatusColor = 'text-blue-600';
    } else if (gradePercentage >= 70) {
      gradeStatus = 'Good';
      gradeStatusColor = 'text-teal-600';
    } else if (gradePercentage >= 60) {
      gradeStatus = 'Satisfactory';
      gradeStatusColor = 'text-yellow-600';
    } else if (gradePercentage >= 50) {
      gradeStatus = 'Pass';
      gradeStatusColor = 'text-orange-600';
    } else {
      gradeStatus = 'Needs Improvement';
      gradeStatusColor = 'text-red-600';
    }
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </button>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">{assignment.title}</h1>
          <div className="flex items-center mt-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
              Assignment
            </span>
            {course && (
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                {course.name} ({course.code})
              </span>
            )}
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
              isPastDue 
                ? 'bg-red-100 text-red-800' 
                : isCloseToDue 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
            }`}>
              {isPastDue ? 'Past Due' : 'Due: ' + dueDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Assignment Details</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-gray-700 mt-1">
                    {assignment.description || 'No description provided.'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Maximum Marks</p>
                  <p className="text-gray-700 mt-1">{assignment.maxMarks}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Due Date</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                    <p className="text-gray-700">{dueDate.toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Created On</p>
                  <p className="text-gray-700 mt-1">{new Date(assignment.createdAt).toLocaleDateString()}</p>
                </div>
                
                {course && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Course</p>
                    <p className="text-gray-700 mt-1">{course.name} ({course.code})</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-4">
                <Award className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Grade Information</h3>
              </div>
              
              {grade ? (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-lg font-medium text-gray-900">Graded</span>
                    </div>
                    <span className="text-2xl font-bold">{grade.marks}/{assignment.maxMarks}</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-500">Score</span>
                      <span className={`text-sm font-medium ${gradeStatusColor}`}>{gradeStatus}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          gradePercentage! < 50 ? 'bg-red-600' : 
                          gradePercentage! < 70 ? 'bg-yellow-500' : 
                          'bg-green-600'
                        }`}
                        style={{ width: `${gradePercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-gray-500 mt-1">{gradePercentage}%</div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Feedback</p>
                    <div className="bg-white p-3 rounded border border-gray-200">
                      <p className="text-gray-700">
                        {grade.comments || 'No feedback provided.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    Graded on: {new Date(grade.submittedOn).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center">
                  <AlertCircle className="h-12 w-12 text-yellow-500 mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Not Graded Yet</h4>
                  <p className="text-gray-600">
                    Your assignment has not been graded yet. Check back later for your results.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeDetails;