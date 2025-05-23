import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Faculty, Student, Course, Assignment, Grade, AttendanceRecord } from '../types';
import { faculties as initialFaculties, students as initialStudents, courses as initialCourses, assignments as initialAssignments } from '../data/mockData';

interface DataContextType {
  faculties: Faculty[];
  students: Student[];
  courses: Course[];
  assignments: Assignment[];
  
  // Faculty operations
  addFaculty: (faculty: Faculty) => void;
  updateFaculty: (id: string, updatedFaculty: Faculty) => void;
  deleteFaculty: (id: string) => void;
  
  // Student operations
  addStudent: (student: Student) => void;
  updateStudent: (id: string, updatedStudent: Student) => void;
  deleteStudent: (id: string) => void;
  
  // Course operations
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updatedCourse: Course) => void;
  deleteCourse: (id: string) => void;
  
  // Assignment operations
  addAssignment: (assignment: Assignment) => void;
  updateAssignment: (id: string, updatedAssignment: Assignment) => void;
  deleteAssignment: (id: string) => void;
  
  // Student enrollment
  enrollStudentInCourse: (studentId: string, courseId: string) => void;
  removeStudentFromCourse: (studentId: string, courseId: string) => void;
  
  // Attendance operations
  markAttendance: (studentId: string, record: AttendanceRecord) => void;
  
  // Grading operations
  addGrade: (studentId: string, grade: Grade) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  // Load data from localStorage on initial render or use initial data
  useEffect(() => {
    const savedFaculties = localStorage.getItem('faculties');
    const savedStudents = localStorage.getItem('students');
    const savedCourses = localStorage.getItem('courses');
    const savedAssignments = localStorage.getItem('assignments');
    
    setFaculties(savedFaculties ? JSON.parse(savedFaculties) : initialFaculties);
    setStudents(savedStudents ? JSON.parse(savedStudents) : initialStudents);
    setCourses(savedCourses ? JSON.parse(savedCourses) : initialCourses);
    setAssignments(savedAssignments ? JSON.parse(savedAssignments) : initialAssignments);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('faculties', JSON.stringify(faculties));
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('courses', JSON.stringify(courses));
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [faculties, students, courses, assignments]);

  // Faculty operations
  const addFaculty = (faculty: Faculty) => {
    setFaculties(prev => [...prev, faculty]);
  };

  const updateFaculty = (id: string, updatedFaculty: Faculty) => {
    setFaculties(prev => prev.map(faculty => 
      faculty.id === id ? updatedFaculty : faculty
    ));
    
    // Update faculty name in courses
    setCourses(prev => prev.map(course => 
      course.faculty === faculties.find(f => f.id === id)?.name
        ? { ...course, faculty: updatedFaculty.name }
        : course
    ));
  };

  const deleteFaculty = (id: string) => {
    // Get faculty name before deletion
    const facultyName = faculties.find(f => f.id === id)?.name;
    
    setFaculties(prev => prev.filter(faculty => faculty.id !== id));
    
    // Remove faculty's courses
    const facultyCourseIds = courses
      .filter(course => course.faculty === facultyName)
      .map(course => course.id);
    
    // Remove these courses
    setCourses(prev => prev.filter(course => course.faculty !== facultyName));
    
    // Remove assignments for these courses
    setAssignments(prev => prev.filter(assignment => 
      !facultyCourseIds.includes(assignment.courseId)
    ));
    
    // Update student enrollments
    setStudents(prev => prev.map(student => ({
      ...student,
      courses: student.courses.filter(courseId => !facultyCourseIds.includes(courseId)),
      attendanceRecords: student.attendanceRecords.filter(record => 
        !facultyCourseIds.includes(record.courseId)
      ),
      grades: student.grades.filter(grade => {
        const assignment = assignments.find(a => a.id === grade.assignmentId);
        return assignment ? !facultyCourseIds.includes(assignment.courseId) : true;
      })
    })));
  };

  // Student operations
  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const updateStudent = (id: string, updatedStudent: Student) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? updatedStudent : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
    
    // Remove student from course enrollments
    setCourses(prev => prev.map(course => ({
      ...course,
      enrolledStudents: course.enrolledStudents 
        ? course.enrolledStudents.filter(studentId => studentId !== id)
        : []
    })));
  };

  // Course operations
  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
    
    // Add course to faculty's courses
    setFaculties(prev => prev.map(faculty => 
      faculty.name === course.faculty
        ? { ...faculty, courses: [...faculty.courses, course.id] }
        : faculty
    ));
  };

  const updateCourse = (id: string, updatedCourse: Course) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? updatedCourse : course
    ));
  };

  const deleteCourse = (id: string) => {
    // Remove course
    setCourses(prev => prev.filter(course => course.id !== id));
    
    // Remove course from faculty's courses
    setFaculties(prev => prev.map(faculty => ({
      ...faculty,
      courses: faculty.courses.filter(courseId => courseId !== id)
    })));
    
    // Remove course from student enrollments
    setStudents(prev => prev.map(student => ({
      ...student,
      courses: student.courses.filter(courseId => courseId !== id),
      attendanceRecords: student.attendanceRecords.filter(record => record.courseId !== id)
    })));
    
    // Remove assignments for this course
    setAssignments(prev => prev.filter(assignment => assignment.courseId !== id));
  };

  // Assignment operations
  const addAssignment = (assignment: Assignment) => {
    setAssignments(prev => [...prev, assignment]);
  };

  const updateAssignment = (id: string, updatedAssignment: Assignment) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === id ? updatedAssignment : assignment
    ));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    
    // Remove grades for this assignment
    setStudents(prev => prev.map(student => ({
      ...student,
      grades: student.grades.filter(grade => grade.assignmentId !== id)
    })));
  };

  // Student enrollment
  const enrollStudentInCourse = (studentId: string, courseId: string) => {
    // Add course to student's courses
    setStudents(prev => prev.map(student => 
      student.id === studentId
        ? { ...student, courses: [...student.courses, courseId] }
        : student
    ));
    
    // Add student to course's enrolled students
    setCourses(prev => prev.map(course => 
      course.id === courseId
        ? { 
            ...course, 
            enrolledStudents: course.enrolledStudents 
              ? [...course.enrolledStudents, studentId]
              : [studentId] 
          }
        : course
    ));
  };

  const removeStudentFromCourse = (studentId: string, courseId: string) => {
    // Remove course from student's courses
    setStudents(prev => prev.map(student => 
      student.id === studentId
        ? { 
            ...student, 
            courses: student.courses.filter(id => id !== courseId),
            attendanceRecords: student.attendanceRecords.filter(record => record.courseId !== courseId),
            grades: student.grades.filter(grade => {
              const assignment = assignments.find(a => a.id === grade.assignmentId);
              return assignment ? assignment.courseId !== courseId : true;
            })
          }
        : student
    ));
    
    // Remove student from course's enrolled students
    setCourses(prev => prev.map(course => 
      course.id === courseId
        ? { 
            ...course, 
            enrolledStudents: course.enrolledStudents 
              ? course.enrolledStudents.filter(id => id !== studentId)
              : [] 
          }
        : course
    ));
  };

  // Attendance operations
  const markAttendance = (studentId: string, record: AttendanceRecord) => {
    setStudents(prev => prev.map(student => {
      if (student.id !== studentId) return student;
      
      // Check if attendance record already exists
      const existingIndex = student.attendanceRecords.findIndex(
        r => r.courseId === record.courseId && r.date === record.date
      );
      
      if (existingIndex >= 0) {
        // Update existing record
        const updatedRecords = [...student.attendanceRecords];
        updatedRecords[existingIndex] = record;
        return { ...student, attendanceRecords: updatedRecords };
      } else {
        // Add new record
        return { 
          ...student, 
          attendanceRecords: [...student.attendanceRecords, record]
        };
      }
    }));
  };

  // Grading operations
  const addGrade = (studentId: string, grade: Grade) => {
    setStudents(prev => prev.map(student => {
      if (student.id !== studentId) return student;
      
      // Check if grade already exists
      const existingIndex = student.grades.findIndex(
        g => g.assignmentId === grade.assignmentId
      );
      
      if (existingIndex >= 0) {
        // Update existing grade
        const updatedGrades = [...student.grades];
        updatedGrades[existingIndex] = grade;
        return { ...student, grades: updatedGrades };
      } else {
        // Add new grade
        return { 
          ...student, 
          grades: [...student.grades, grade]
        };
      }
    }));
  };

  const value = {
    faculties,
    students,
    courses,
    assignments,
    addFaculty,
    updateFaculty,
    deleteFaculty,
    addStudent,
    updateStudent,
    deleteStudent,
    addCourse,
    updateCourse,
    deleteCourse,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    enrollStudentInCourse,
    removeStudentFromCourse,
    markAttendance,
    addGrade
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};