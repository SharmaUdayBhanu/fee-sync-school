
import { getAllStudents, updateStudentPayment } from './students';

// Define payment interface
export type Payment = {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: 'cash' | 'card' | 'upi' | 'cheque' | 'bank transfer';
  description: string;
  receiptNumber: string;
  status: 'success' | 'pending' | 'failed';
  processedBy: string;
};

// Generate random payment method
const getRandomPaymentMethod = (): Payment['method'] => {
  const methods: Payment['method'][] = ['cash', 'card', 'upi', 'cheque', 'bank transfer'];
  return methods[Math.floor(Math.random() * methods.length)];
};

// Generate mock payments
const generateMockPayments = (): Payment[] => {
  const payments: Payment[] = [];
  let idCounter = 1;
  const students = getAllStudents();
  
  // Generate payments for students with paid or partial status
  students.forEach(student => {
    if (student.feeStatus === 'unpaid') {
      return;
    }
    
    // Generate random number of payments between 1-3
    const paymentsCount = student.feeStatus === 'paid' ? 
      Math.floor(Math.random() * 2) + 2 : // 2-3 payments for fully paid
      Math.floor(Math.random() * 1) + 1;  // 1-2 payments for partially paid
    
    // Calculate payment amounts based on paid amount
    let remainingAmount = student.paidAmount;
    
    for (let i = 0; i < paymentsCount; i++) {
      const isLastPayment = i === paymentsCount - 1;
      const amount = isLastPayment ? remainingAmount : Math.min(Math.round(remainingAmount / 2), remainingAmount);
      remainingAmount -= amount;
      
      // Random date in last 6 months
      const currentDate = new Date();
      const monthsAgo = Math.floor(Math.random() * 6);
      const daysAgo = Math.floor(Math.random() * 30);
      const paymentDate = new Date(currentDate);
      paymentDate.setMonth(paymentDate.getMonth() - monthsAgo);
      paymentDate.setDate(paymentDate.getDate() - daysAgo);
      
      const method = getRandomPaymentMethod();
      
      const payment: Payment = {
        id: idCounter.toString(),
        studentId: student.id,
        amount,
        date: paymentDate.toISOString().split('T')[0],
        method,
        description: `Fee payment for ${student.className} class`,
        receiptNumber: `RCPT-${student.rollNumber}-${idCounter}`,
        status: 'success',
        processedBy: 'Admin'
      };
      
      payments.push(payment);
      idCounter++;
    }
  });
  
  return payments;
};

// Generate initial mock data
let mockPayments = generateMockPayments();

// CRUD operations for payments
export const getAllPayments = (): Payment[] => {
  return mockPayments;
};

export const getPaymentById = (id: string): Payment | undefined => {
  return mockPayments.find(payment => payment.id === id);
};

export const getPaymentsByStudentId = (studentId: string): Payment[] => {
  return mockPayments.filter(payment => payment.studentId === studentId);
};

export const addPayment = (payment: Omit<Payment, 'id'>): Payment => {
  const newId = (mockPayments.length + 1).toString();
  
  const newPayment = {
    id: newId,
    ...payment
  };
  
  mockPayments = [...mockPayments, newPayment];
  
  // Update student's payment status
  if (payment.status === 'success') {
    updateStudentPayment(payment.studentId, payment.amount);
  }
  
  return newPayment;
};

export const updatePayment = (updatedPayment: Payment): Payment => {
  const originalPayment = mockPayments.find(payment => payment.id === updatedPayment.id);
  
  mockPayments = mockPayments.map(payment => 
    payment.id === updatedPayment.id ? updatedPayment : payment
  );
  
  // Update student's payment status if amount changed
  if (originalPayment && 
      originalPayment.amount !== updatedPayment.amount &&
      originalPayment.studentId === updatedPayment.studentId) {
    const amountDifference = updatedPayment.amount - originalPayment.amount;
    updateStudentPayment(updatedPayment.studentId, amountDifference);
  }
  
  return updatedPayment;
};

export const deletePayment = (id: string): boolean => {
  const payment = mockPayments.find(payment => payment.id === id);
  const initialLength = mockPayments.length;
  
  mockPayments = mockPayments.filter(payment => payment.id !== id);
  
  // Revert student's payment if deleting a successful payment
  if (payment && payment.status === 'success') {
    updateStudentPayment(payment.studentId, -payment.amount);
  }
  
  return mockPayments.length !== initialLength;
};

// Get payment statistics 
export const getPaymentStatistics = () => {
  // Calculate total collections by month for current year
  const currentYear = new Date().getFullYear();
  const monthlyCollections: {[month: string]: number} = {};
  
  // Initialize months
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'];
                 
  months.forEach(month => {
    monthlyCollections[month] = 0;
  });
  
  // Sum payments by month
  mockPayments.forEach(payment => {
    const paymentDate = new Date(payment.date);
    const paymentYear = paymentDate.getFullYear();
    
    if (paymentYear === currentYear) {
      const monthIndex = paymentDate.getMonth();
      const monthName = months[monthIndex];
      monthlyCollections[monthName] += payment.amount;
    }
  });
  
  // Calculate totals
  const totalCollected = mockPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Calculate payment methods distribution
  const paymentMethods: {[method: string]: number} = {
    'cash': 0,
    'card': 0,
    'upi': 0,
    'cheque': 0,
    'bank transfer': 0
  };
  
  mockPayments.forEach(payment => {
    paymentMethods[payment.method] += payment.amount;
  });
  
  return {
    totalCollected,
    monthlyCollections,
    paymentMethods
  };
};

// Utility function to reset data (for testing)
export const resetPaymentData = () => {
  mockPayments = generateMockPayments();
};
