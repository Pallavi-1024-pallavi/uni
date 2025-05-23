import { User, Faculty, Student, Course, Assignment, Department } from '../types';

export const departments: Department[] = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration'
];

export const users: User[] = [
  {
    id: 'A1001',
    name: 'Admin User',
    email: 'admin@edu.com',
    password: 'password',
    role: 'admin',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'F1001',
    name: 'Dr. John Smith',
    email: 'faculty@edu.com',
    password: 'password',
    role: 'faculty',
    department: 'Computer Science',
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'S1001',
    name: 'Alice Johnson',
    email: 'student@edu.com',
    password: 'password',
    role: 'student',
    department: 'Computer Science',
    profileImage: 'https://images.pexels.com/photos/3772511/pexels-photo-3772511.jpeg?auto=compress&cs=tinysrgb&w=600',
  }
];

export const faculties: Faculty[] = [
  {
    id: 'F1001',
    name: 'Dr. John Smith',
    email: 'faculty@edu.com',
    password: 'password',
    role: 'faculty',
    department: 'Computer Science',
    position: 'Associate Professor',
    joinDate: '2018-07-15',
    phone: '555-123-4567',
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
    courses: ['C1001', 'C1002'],
    workExperience: [
      {
        organization: 'Tech University',
        startYear: '2015',
        endYear: '2018',
        description: 'Assistant Professor in the Department of Computer Science',
        research: 'Machine Learning, Artificial Intelligence'
      },
      {
        organization: 'Google Research',
        startYear: '2010',
        endYear: '2015',
        description: 'Research Scientist working on search algorithms',
        achievements: 'Published 5 papers in top conferences'
      }
    ]
  },
  {
    id: 'F1002',
    name: 'Prof. Emily Chen',
    email: 'chen@edu.com',
    password: 'password',
    role: 'faculty',
    department: 'Electrical Engineering',
    position: 'Professor',
    joinDate: '2015-08-20',
    phone: '555-987-6543',
    profileImage: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=600',
    courses: ['C1003'],
    workExperience: [
      {
        organization: 'MIT',
        startYear: '2008',
        endYear: '2015',
        description: 'Associate Professor of Electrical Engineering',
        research: 'VLSI Design, Embedded Systems'
      }
    ]
  },
  {
    id: 'F1003',
    name: 'Dr. Michael Rodriguez',
    email: 'rodriguez@edu.com',
    password: 'password',
    role: 'faculty',
    department: 'Mechanical Engineering',
    position: 'Assistant Professor',
    joinDate: '2020-01-10',
    phone: '555-456-7890',
    profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600',
    courses: ['C1004'],
    workExperience: [
      {
        organization: 'Ford Motors Research',
        startYear: '2016',
        endYear: '2020',
        description: 'Lead Engineer in Thermal Systems',
        achievements: 'Patented a new cooling system design'
      }
    ]
  }
];

export const students: Student[] = [
  {
    id: 'S1001',
    name: 'Alice Johnson',
    email: 'student@edu.com',
    password: 'password',
    role: 'student',
    department: 'Computer Science',
    enrollmentYear: '2021',
    semester: '4',
    phone: '555-234-5678',
    profileImage: 'https://images.pexels.com/photos/3772511/pexels-photo-3772511.jpeg?auto=compress&cs=tinysrgb&w=600',
    courses: ['C1001', 'C1002'],
    attendanceRecords: [
      {
        id: 'ATT1001',
        courseId: 'C1001',
        date: '2023-10-01',
        present: true
      },
      {
        id: 'ATT1002',
        courseId: 'C1001',
        date: '2023-10-03',
        present: true
      },
      {
        id: 'ATT1003',
        courseId: 'C1001',
        date: '2023-10-05',
        present: false
      },
      {
        id: 'ATT1004',
        courseId: 'C1002',
        date: '2023-10-02',
        present: true
      },
      {
        id: 'ATT1005',
        courseId: 'C1002',
        date: '2023-10-04',
        present: true
      }
    ],
    grades: [
      {
        id: 'G1001',
        assignmentId: 'A1001',
        marks: 85,
        comments: 'Good work on the theory portion, but implementation needs improvement.',
        submittedOn: '2023-10-10T15:30:00'
      }
    ],
    education: {
      highSchool: {
        institution: 'Lincoln High School',
        board: 'State Board of Education',
        passingYear: '2019',
        percentage: '92%'
      },
      intermediateOrDiploma: {
        type: 'intermediate',
        institution: 'City College',
        board: 'State Board of Education',
        passingYear: '2021',
        percentage: '88%'
      },
      college: {
        degree: 'Bachelor of Technology',
        fieldOfStudy: 'Computer Science',
        institution: 'University of Technology',
        startYear: '2021',
        currentCGPA: '3.8'
      }
    }
  },
  {
    id: 'S1002',
    name: 'Bob Williams',
    email: 'bob@edu.com',
    password: 'password',
    role: 'student',
    department: 'Computer Science',
    enrollmentYear: '2021',
    semester: '4',
    phone: '555-345-6789',
    profileImage: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600',
    courses: ['C1001'],
    attendanceRecords: [
      {
        id: 'ATT2001',
        courseId: 'C1001',
        date: '2023-10-01',
        present: true
      },
      {
        id: 'ATT2002',
        courseId: 'C1001',
        date: '2023-10-03',
        present: false
      },
      {
        id: 'ATT2003',
        courseId: 'C1001',
        date: '2023-10-05',
        present: true
      }
    ],
    grades: [
      {
        id: 'G2001',
        assignmentId: 'A1001',
        marks: 92,
        comments: 'Excellent work! Your implementation was very efficient.',
        submittedOn: '2023-10-09T14:20:00'
      }
    ]
  },
  {
    id: 'S1003',
    name: 'Charlie Davis',
    email: 'charlie@edu.com',
    password: 'password',
    role: 'student',
    department: 'Electrical Engineering',
    enrollmentYear: '2020',
    semester: '6',
    phone: '555-456-7890',
    profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600',
    courses: ['C1003'],
    attendanceRecords: [
      {
        id: 'ATT3001',
        courseId: 'C1003',
        date: '2023-10-02',
        present: true
      },
      {
        id: 'ATT3002',
        courseId: 'C1003',
        date: '2023-10-04',
        present: true
      }
    ],
    grades: []
  },
  {
    id: 'S1004',
    name: 'Diana Miller',
    email: 'diana@edu.com',
    password: 'password',
    role: 'student',
    department: 'Mechanical Engineering',
    enrollmentYear: '2022',
    semester: '2',
    phone: '555-567-8901',
    profileImage: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=600',
    courses: ['C1004'],
    attendanceRecords: [
      {
        id: 'ATT4001',
        courseId: 'C1004',
        date: '2023-10-02',
        present: true
      },
      {
        id: 'ATT4002',
        courseId: 'C1004',
        date: '2023-10-04',
        present: false
      }
    ],
    grades: []
  }
];

export const courses: Course[] = [
  {
    id: 'C1001',
    name: 'Data Structures and Algorithms',
    code: 'CS301',
    department: 'Computer Science',
    semester: '3',
    credits: 4,
    description: 'This course covers fundamental data structures (arrays, linked lists, stacks, queues, trees, graphs) and algorithms (sorting, searching, recursion, dynamic programming) with analysis of time and space complexity.',
    faculty: 'Dr. John Smith',
    enrolledStudents: ['S1001', 'S1002']
  },
  {
    id: 'C1002',
    name: 'Database Management Systems',
    code: 'CS401',
    department: 'Computer Science',
    semester: '4',
    credits: 3,
    description: 'Introduction to database concepts, relational model, SQL, normalization, transaction processing, recovery, and basic database design principles.',
    faculty: 'Dr. John Smith',
    enrolledStudents: ['S1001']
  },
  {
    id: 'C1003',
    name: 'Digital Signal Processing',
    code: 'EE401',
    department: 'Electrical Engineering',
    semester: '4',
    credits: 4,
    description: 'Fundamentals of digital signal processing, sampling, quantization, Z-transforms, digital filters, and discrete Fourier transforms.',
    faculty: 'Prof. Emily Chen',
    enrolledStudents: ['S1003']
  },
  {
    id: 'C1004',
    name: 'Thermodynamics',
    code: 'ME201',
    department: 'Mechanical Engineering',
    semester: '2',
    credits: 4,
    description: 'Introduction to the fundamental principles of thermodynamics, including energy, heat, work, entropy, and the laws of thermodynamics.',
    faculty: 'Dr. Michael Rodriguez',
    enrolledStudents: ['S1004']
  }
];

export const assignments: Assignment[] = [
  {
    id: 'A1001',
    title: 'Implement Sorting Algorithms',
    description: 'Implement Quick Sort, Merge Sort, and Heap Sort algorithms and compare their performance on different input sizes.',
    courseId: 'C1001',
    dueDate: '2023-10-15',
    maxMarks: 100,
    createdAt: '2023-10-01T10:00:00'
  },
  {
    id: 'A1002',
    title: 'Database Design Project',
    description: 'Design a database schema for a library management system, including tables for books, members, loans, and fines.',
    courseId: 'C1002',
    dueDate: '2023-11-05',
    maxMarks: 100,
    createdAt: '2023-10-05T14:30:00'
  },
  {
    id: 'A1003',
    title: 'FIR Filter Design',
    description: 'Design and implement a low-pass FIR filter with specified cutoff frequency and transition bandwidth.',
    courseId: 'C1003',
    dueDate: '2023-10-20',
    maxMarks: 100,
    createdAt: '2023-10-02T09:15:00'
  },
  {
    id: 'A1004',
    title: 'Thermodynamic Cycle Analysis',
    description: 'Analyze the efficiency of a Rankine cycle for a steam power plant with given operating parameters.',
    courseId: 'C1004',
    dueDate: '2023-10-25',
    maxMarks: 100,
    createdAt: '2023-10-04T11:45:00'
  }
];