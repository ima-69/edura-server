// Mock data for the LMS application
export const courses = [{
  id: 'grade-10',
  title: 'Grade 10 Mathematics',
  description: 'Essential mathematics concepts for Grade 10 students including algebra, geometry, and statistics.',
  lessons: 24,
  duration: '32 hours',
  students: 342,
  image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  progress: 75,
  paid: true
}, {
  id: 'grade-11',
  title: 'Grade 11 Physics',
  description: 'Comprehensive physics course covering mechanics, waves, electricity and magnetism for Grade 11.',
  lessons: 18,
  duration: '24 hours',
  students: 287,
  image: 'https://images.unsplash.com/photo-1636466497217-26a42372455d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
  progress: 30,
  paid: true
}, {
  id: 'grade-12',
  title: 'Grade 12 Chemistry',
  description: 'Advanced chemistry concepts including organic chemistry, thermodynamics, and chemical kinetics.',
  lessons: 20,
  duration: '28 hours',
  students: 256,
  image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  progress: 10,
  paid: false
}, {
  id: 'grade-14',
  title: 'Grade 14 Computer Science',
  description: 'Introduction to programming, algorithms, data structures, and software development principles.',
  lessons: 30,
  duration: '40 hours',
  students: 198,
  image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  progress: 0,
  paid: false
}];
export const lessons = {
  'grade-10': [{
    id: 'g10-lesson1',
    title: 'Introduction to Algebra',
    duration: '45 min',
    isCompleted: true,
    isLocked: false,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'This lesson covers the basics of algebraic expressions, equations, and variables.',
    notes: 'Remember to practice the equations on page 15 of your textbook.',
    resources: [{
      name: 'Algebra Cheat Sheet',
      url: 'https://example.com/algebra-cheatsheet.pdf'
    }]
  }, {
    id: 'g10-lesson2',
    title: 'Linear Equations',
    duration: '50 min',
    isCompleted: true,
    isLocked: false,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Learn how to solve linear equations and apply them to real-world problems.',
    notes: 'Complete exercises 1-10 from Chapter 2.',
    resources: []
  }, {
    id: 'g10-lesson3',
    title: 'Quadratic Equations',
    duration: '55 min',
    isCompleted: false,
    isLocked: false,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'This lesson introduces quadratic equations and various methods to solve them.',
    notes: 'Focus on the quadratic formula and factoring methods.',
    resources: [{
      name: 'Quadratic Formula Calculator',
      url: 'https://example.com/quadratic-calculator'
    }]
  }, {
    id: 'g10-lesson4',
    title: 'Geometry Basics',
    duration: '40 min',
    isCompleted: false,
    isLocked: true,
    videoUrl: '',
    description: 'An overview of basic geometric concepts including points, lines, and angles.',
    notes: '',
    resources: []
  }, {
    id: 'g10-lesson5',
    title: 'Triangles and Circles',
    duration: '60 min',
    isCompleted: false,
    isLocked: true,
    videoUrl: '',
    description: 'Explore the properties of triangles and circles and how they relate to each other.',
    notes: '',
    resources: []
  }],
  'grade-11': [
    // Similar structure for Grade 11 lessons
  ],
  'grade-12': [
    // Similar structure for Grade 12 lessons
  ],
  'grade-14': [
    // Similar structure for Grade 14 lessons
  ]
};
export const userData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
};
// Mock users for admin panel
export const users = [{
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  role: 'student',
  status: 'active',
  registeredDate: '2023-01-15',
  assignedCourses: ['grade-10', 'grade-11'],
  paymentStatus: 'paid'
}, {
  id: 'user2',
  name: 'Sarah Williams',
  email: 'sarah.w@example.com',
  role: 'student',
  status: 'active',
  registeredDate: '2023-02-20',
  assignedCourses: ['grade-10'],
  paymentStatus: 'paid'
}, {
  id: 'user3',
  name: 'Michael Brown',
  email: 'michael.b@example.com',
  role: 'student',
  status: 'inactive',
  registeredDate: '2023-01-10',
  assignedCourses: ['grade-12', 'grade-14'],
  paymentStatus: 'unpaid'
}, {
  id: 'user4',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  status: 'active',
  registeredDate: '2022-12-01',
  assignedCourses: [],
  paymentStatus: 'n/a'
}];