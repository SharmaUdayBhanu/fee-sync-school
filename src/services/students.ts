
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
  address?: string;
  phone?: string;
  email?: string;
  gender?: 'male' | 'female' | 'other';
  dob?: string;
};

// Define the class names used in the system
export type ClassInfo = {
  id: string;
  name: string;
  teacher: string;
  studentsCount: number;
  totalFees: number;
  collectedFees: number;
};

export const classList = [
  'Pre-Nursery', 'Nursery', 'Lower KG', 'Upper KG',
  '1st', '2nd', '3rd', '4th', '5th',
  '6th', '7th', '8th', '9th', '10th'
];

let classInfoData: ClassInfo[] = classList.map((className, index) => ({
  id: (index + 1).toString(),
  name: className,
  teacher: `Teacher ${index + 1}`,
  studentsCount: 0,
  totalFees: 0,
  collectedFees: 0
}));

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
      
      // Generate gender randomly
      const genders = ['male', 'female', 'other'] as const;
      const gender = genders[Math.floor(Math.random() * 2)] as 'male' | 'female' | 'other';
      
      // Generate random date of birth between 5-18 years ago
      const currentDate = new Date();
      const age = Math.floor(Math.random() * 13) + 5; // 5-18 years
      const dobDate = new Date(currentDate.getFullYear() - age, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const dob = dobDate.toISOString().split('T')[0];
      
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
        monthlyFeeStatus,
        address: `${Math.floor(Math.random() * 1000) + 1} Main Street, City`,
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        email: `student${id}@example.com`,
        gender,
        dob
      });
    }
  });
  
  // Update class info data with actual counts
  classList.forEach((className, index) => {
    const classStudents = students.filter(student => student.className === className);
    const totalFees = classStudents.length * 3000;
    const collectedFees = classStudents.reduce((sum, student) => sum + student.paidAmount, 0);
    
    classInfoData[index].studentsCount = classStudents.length;
    classInfoData[index].totalFees = totalFees;
    classInfoData[index].collectedFees = collectedFees;
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
  
  // Update class info when adding a student
  const classIndex = classList.indexOf(newStudent.className);
  if (classIndex !== -1) {
    classInfoData[classIndex].studentsCount++;
    classInfoData[classIndex].totalFees += newStudent.totalAmount;
    classInfoData[classIndex].collectedFees += newStudent.paidAmount;
  }
  
  return newStudent;
};

export const deleteStudent = (id: string): boolean => {
  const studentToDelete = mockStudents.find(student => student.id === id);
  const initialLength = mockStudents.length;
  mockStudents = mockStudents.filter(student => student.id !== id);
  
  // Update class info when deleting a student
  if (studentToDelete) {
    const classIndex = classList.indexOf(studentToDelete.className);
    if (classIndex !== -1) {
      classInfoData[classIndex].studentsCount--;
      classInfoData[classIndex].totalFees -= studentToDelete.totalAmount;
      classInfoData[classIndex].collectedFees -= studentToDelete.paidAmount;
    }
  }
  
  return mockStudents.length !== initialLength;
};

export const updateStudent = (updatedStudent: Student): Student => {
  const originalStudent = mockStudents.find(student => student.id === updatedStudent.id);
  
  mockStudents = mockStudents.map(student => 
    student.id === updatedStudent.id ? updatedStudent : student
  );
  
  // Update class info for changes in class or fees
  if (originalStudent) {
    // Handle class change
    if (originalStudent.className !== updatedStudent.className) {
      // Decrement count in old class
      const oldClassIndex = classList.indexOf(originalStudent.className);
      if (oldClassIndex !== -1) {
        classInfoData[oldClassIndex].studentsCount--;
        classInfoData[oldClassIndex].totalFees -= originalStudent.totalAmount;
        classInfoData[oldClassIndex].collectedFees -= originalStudent.paidAmount;
      }
      
      // Increment count in new class
      const newClassIndex = classList.indexOf(updatedStudent.className);
      if (newClassIndex !== -1) {
        classInfoData[newClassIndex].studentsCount++;
        classInfoData[newClassIndex].totalFees += updatedStudent.totalAmount;
        classInfoData[newClassIndex].collectedFees += updatedStudent.paidAmount;
      }
    }
    // Handle fee status change
    else if (originalStudent.paidAmount !== updatedStudent.paidAmount) {
      const classIndex = classList.indexOf(updatedStudent.className);
      if (classIndex !== -1) {
        const feeDifference = updatedStudent.paidAmount - originalStudent.paidAmount;
        classInfoData[classIndex].collectedFees += feeDifference;
      }
    }
  }
  
  return updatedStudent;
};

// Get students by class
export const getStudentsByClass = (className: string): Student[] => {
  return mockStudents.filter(student => student.className === className);
};

// Get all class info
export const getAllClassInfo = (): ClassInfo[] => {
  return classInfoData;
};

// Get class info by class name
export const getClassInfoByName = (className: string): ClassInfo | undefined => {
  return classInfoData.find(classInfo => classInfo.name === className);
};

// Add new class
export const addClass = (classInfo: Omit<ClassInfo, 'id'>): ClassInfo => {
  const newId = (classInfoData.length + 1).toString();
  
  const newClass = {
    id: newId,
    ...classInfo
  };
  
  classInfoData = [...classInfoData, newClass];
  
  // Add the new class name to the classList if it doesn't exist
  if (!classList.includes(newClass.name)) {
    classList.push(newClass.name);
  }
  
  return newClass;
};

// Update class info
export const updateClassInfo = (updatedClass: ClassInfo): ClassInfo => {
  classInfoData = classInfoData.map(classInfo => 
    classInfo.id === updatedClass.id ? updatedClass : classInfo
  );
  
  return updatedClass;
};

// Delete class (only if no students are assigned to it)
export const deleteClass = (id: string): boolean => {
  const classToDelete = classInfoData.find(classInfo => classInfo.id === id);
  
  if (classToDelete) {
    // Check if any students are assigned to this class
    const studentsInClass = mockStudents.filter(student => student.className === classToDelete.name);
    
    if (studentsInClass.length > 0) {
      return false; // Cannot delete class with students
    }
    
    // Remove from classList
    const classIndex = classList.indexOf(classToDelete.name);
    if (classIndex !== -1) {
      classList.splice(classIndex, 1);
    }
    
    // Remove from classInfoData
    classInfoData = classInfoData.filter(classInfo => classInfo.id !== id);
    return true;
  }
  
  return false;
};

// Get summary statistics
export const getStudentStatistics = () => {
  const totalStudents = mockStudents.length;
  const paidStudents = mockStudents.filter(student => student.feeStatus === 'paid').length;
  const partialStudents = mockStudents.filter(student => student.feeStatus === 'partial').length;
  const unpaidStudents = mockStudents.filter(student => student.feeStatus === 'unpaid').length;
  
  const totalFees = mockStudents.reduce((sum, student) => sum + student.totalAmount, 0);
  const collectedFees = mockStudents.reduce((sum, student) => sum + student.paidAmount, 0);
  const pendingFees = totalFees - collectedFees;
  
  return {
    totalStudents,
    paidStudents,
    partialStudents,
    unpaidStudents,
    totalFees,
    collectedFees,
    pendingFees
  };
};

// Update student payment
export const updateStudentPayment = (studentId: string, amount: number): Student | undefined => {
  const studentIndex = mockStudents.findIndex(student => student.id === studentId);
  
  if (studentIndex === -1) {
    return undefined;
  }
  
  const student = mockStudents[studentIndex];
  const newPaidAmount = student.paidAmount + amount;
  
  // Update fee status based on payment
  let feeStatus: 'paid' | 'partial' | 'unpaid' = student.feeStatus;
  
  if (newPaidAmount >= student.totalAmount) {
    feeStatus = 'paid';
  } else if (newPaidAmount > 0) {
    feeStatus = 'partial';
  } else {
    feeStatus = 'unpaid';
  }
  
  const updatedStudent = {
    ...student,
    paidAmount: newPaidAmount > student.totalAmount ? student.totalAmount : newPaidAmount,
    feeStatus,
    lastPaymentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  };
  
  mockStudents[studentIndex] = updatedStudent;
  
  // Update class info
  const classIndex = classList.indexOf(student.className);
  if (classIndex !== -1) {
    classInfoData[classIndex].collectedFees += amount;
    if (classInfoData[classIndex].collectedFees > classInfoData[classIndex].totalFees) {
      classInfoData[classIndex].collectedFees = classInfoData[classIndex].totalFees;
    }
  }
  
  return updatedStudent;
};

// Utility function to reset data (for testing)
export const resetStudentData = () => {
  mockStudents = generateMockStudents();
};
