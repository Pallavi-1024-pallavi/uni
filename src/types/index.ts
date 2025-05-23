export type UserRole = 'admin' | 'faculty' | 'student';

export type Department = 'Computer Science' | 'Electrical Engineering' | 'Mechanical Engineering' | 'Civil Engineering' | 'Business Administration';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  profileImage?: string;
  department?: Department;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  phone?: string;
  nationality?: string;
  address?: string;
}

export interface WorkExperience {
  organization: string;
  startYear: string;
  endYear?: string;
  description?: string;
  achievements?: string;
  research?: string;
}

export interface Faculty extends User {
  department: Department;
  position: string;
  joinDate: string;
  courses: string[];
  workExperience?: WorkExperience[];
}

export interface HighSchool {
  institution: string;
  board: string;
  passingYear: string;
  percentage: string;
}

export interface IntermediateOrDiploma {
  type: 'intermediate' | 'diploma';
  institution: string;
  board: string;
  passingYear: string;
  percentage: string;
  specialization?: string;
}

export interface College {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  startYear: string;
  endYear?: string;
  currentCGPA?: string;
}

export interface Education {
  highSchool?: HighSchool;
  intermediateOrDiploma?: IntermediateOrDiploma;
  college?: College;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  date: string;
  present: boolean;
}

export interface Grade {
  id: string;
  assignmentId: string;
  marks: number;
  comments: string;
  submittedOn: string;
}

export interface Student extends User {
  department: Department;
  enrollmentYear: string;
  semester: string;
  courses: string[];
  attendanceRecords: AttendanceRecord[];
  grades: Grade[];
  education?: Education;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  department: Department;
  semester: string;
  credits: number;
  description: string;
  faculty: string;
  enrolledStudents?: string[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  dueDate: string;
  maxMarks: number;
  createdAt: string;
}