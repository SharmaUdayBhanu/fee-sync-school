
// Define the student interface
export type Student = {
  id: string;
  name: string;
  guardianName: string;
  rollNumber: string;
  className: string;
  admissionDate: string;
  feeStatus: 'paid' | 'partial' | 'unpaid';
  paidAmount: number;
  totalAmount: number;
  lastPaymentDate?: string;
  monthlyFeeStatus: {
    [month: string]: 'paid' | 'unpaid';
  };
};

// Define the class names used in the system
export const classList = [
  'Pre-Nursery', 'Nursery', 'Lower KG', 'Upper KG',
  '1st', '2nd', '3rd', '4th', '5th',
  '6th', '7th', '8th', '9th', '10th'
];

// Function to generate mock students per class
const generateMockStudents = (): Student[] => {
  const students: Student[] = [];
  let idCounter = 1;
  
  // Generate 5 students for each class
  classList.forEach((className) => {
    for (let i = 0; i < 5; i++) {
      const id = idCounter.toString();
      idCounter++;
      
      // Generate status randomly
      const statusOptions = ['paid', 'partial', 'unpaid'] as const;
      const feeStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      
      // Generate monthly fee status
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
      const monthlyFeeStatus: {[month: string]: 'paid' | 'unpaid'} = {};
      
      months.forEach((month, idx) => {
        // Students with paid status have all months paid
        if (feeStatus === 'paid') {
          monthlyFeeStatus[month] = 'paid';
        } 
        // Students with partial status have some months paid
        else if (feeStatus === 'partial') {
          monthlyFeeStatus[month] = idx < 6 ? 'paid' : 'unpaid';
        }
        // Students with unpaid status have all months unpaid
        else {
          monthlyFeeStatus[month] = 'unpaid';
        }
      });
      
      // Calculate amounts
      const totalAmount = 3000;
      const paidAmount = feeStatus === 'paid' ? 3000 : (feeStatus === 'partial' ? 1500 : 0);
      
      // Create a sample student
      students.push({
        id,
        name: `Student ${id}-${className}`,
        guardianName: `Guardian ${id}`,
        rollNumber: `${className}-${100+i}`,
        className,
        admissionDate: "2025-01-01",
        feeStatus,
        paidAmount,
        totalAmount,
        lastPaymentDate: feeStatus !== 'unpaid' ? 'May 01, 2025' : undefined,
        monthlyFeeStatus
      });
    }
  });
  
  return students;
};

// Generate initial mock data
let mockStudents = generateMockStudents();

// CRUD operations for students
export const getAllStudents = (): Student[] => {
  return mockStudents;
};

export const getStudentById = (id: string): Student | undefined => {
  return mockStudents.find(student => student.id === id);
};

export const addStudent = (student: Omit<Student, 'id'>): Student => {
  const newId = (mockStudents.length + 1).toString();
  
  const newStudent = {
    id: newId,
    ...student
  };
  
  mockStudents = [...mockStudents, newStudent];
  return newStudent;
};

export const deleteStudent = (id: string): boolean => {
  const initialLength = mockStudents.length;
  mockStudents = mockStudents.filter(student => student.id !== id);
  
  return mockStudents.length !== initialLength;
};

export const updateStudent = (updatedStudent: Student): Student => {
  mockStudents = mockStudents.map(student => 
    student.id === updatedStudent.id ? updatedStudent : student
  );
  
  return updatedStudent;
};

// Get students by class
export const getStudentsByClass = (className: string): Student[] => {
  return mockStudents.filter(student => student.className === className);
};
