import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProfile from './pages/admin/Profile';
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyProfile from './pages/faculty/Profile';
import FacultyEditProfile from './pages/faculty/EditProfile';
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentEditProfile from './pages/student/EditProfile';
import FacultyManagement from './pages/admin/FacultyManagement';
import StudentManagement from './pages/admin/StudentManagement';
import CourseManagement from './pages/admin/CourseManagement';
import AssignStudents from './pages/admin/AssignStudents';
import FacultyCourses from './pages/faculty/Courses';
import FacultyStudents from './pages/faculty/Students';
import CourseDetails from './pages/student/CourseDetails';
import GradeDetails from './pages/student/GradeDetails';
import AvailableCourses from './pages/student/AvailableCourses';
import EnrolledCourses from './pages/student/EnrolledCourses';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleSelection from './pages/RoleSelection';

function App() {
  const [showLoginPage, setShowLoginPage] = useState(false);
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={showLoginPage ? <LoginPage /> : <RoleSelection onLogin={() => setShowLoginPage(true)} />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute role="admin"><AdminProfile /></ProtectedRoute>} />
          <Route path="/admin/faculty" element={<ProtectedRoute role="admin"><FacultyManagement /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute role="admin"><StudentManagement /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute role="admin"><CourseManagement /></ProtectedRoute>} />
          <Route path="/admin/assign-students" element={<ProtectedRoute role="admin"><AssignStudents /></ProtectedRoute>} />
          
          {/* Faculty Routes */}
          <Route path="/faculty" element={<ProtectedRoute role="faculty"><FacultyDashboard /></ProtectedRoute>} />
          <Route path="/faculty/profile" element={<ProtectedRoute role="faculty"><FacultyProfile /></ProtectedRoute>} />
          <Route path="/faculty/profile/edit" element={<ProtectedRoute role="faculty"><FacultyEditProfile /></ProtectedRoute>} />
          <Route path="/faculty/courses" element={<ProtectedRoute role="faculty"><FacultyCourses /></ProtectedRoute>} />
          <Route path="/faculty/students" element={<ProtectedRoute role="faculty"><FacultyStudents /></ProtectedRoute>} />
          
          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
          <Route path="/student/profile/edit" element={<ProtectedRoute role="student"><StudentEditProfile /></ProtectedRoute>} />
          <Route path="/student/courses" element={<ProtectedRoute role="student"><AvailableCourses /></ProtectedRoute>} />
          <Route path="/student/enrolled-courses" element={<ProtectedRoute role="student"><EnrolledCourses /></ProtectedRoute>} />
          <Route path="/student/course/:id" element={<ProtectedRoute role="student"><CourseDetails /></ProtectedRoute>} />
          <Route path="/student/grades/:id" element={<ProtectedRoute role="student"><GradeDetails /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;