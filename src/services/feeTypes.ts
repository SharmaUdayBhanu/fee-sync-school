
// Define fee types used in the system
export type FeeType = {
  id: string;
  name: string;
  description: string;
  amount: number;
  frequency: 'annual' | 'monthly' | 'one-time';
  applicable: string[]; // List of class names where this fee is applicable
  isOptional: boolean;
  appliedDate: string;
};

// Mock fee types with enhanced structure
let feeTypes: FeeType[] = [
  {
    id: "1",
    name: "Tuition Fee",
    description: "Regular monthly academic fee",
    amount: 2000,
    frequency: "monthly",
    applicable: ['Pre-Nursery', 'Nursery', 'Lower KG', 'Upper KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
    isOptional: false,
    appliedDate: "2025-01-01"
  },
  {
    id: "2",
    name: "Exam Fee",
    description: "Fee for term examinations",
    amount: 1500,
    frequency: "annual",
    applicable: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
    isOptional: false,
    appliedDate: "2025-01-01"
  },
  {
    id: "3",
    name: "Computer Fee",
    description: "Computer lab access and training",
    amount: 500,
    frequency: "monthly",
    applicable: ['3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
    isOptional: false,
    appliedDate: "2025-01-01"
  },
  {
    id: "4",
    name: "Development Fee",
    description: "School infrastructure development",
    amount: 3000,
    frequency: "annual",
    applicable: ['Pre-Nursery', 'Nursery', 'Lower KG', 'Upper KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
    isOptional: false,
    appliedDate: "2025-01-01"
  },
  {
    id: "5",
    name: "Transport Fee",
    description: "School bus transportation service",
    amount: 1200,
    frequency: "monthly",
    applicable: ['Pre-Nursery', 'Nursery', 'Lower KG', 'Upper KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
    isOptional: true,
    appliedDate: "2025-01-01"
  },
  {
    id: "6",
    name: "Library Fee",
    description: "Library resources and maintenance",
    amount: 800,
    frequency: "annual",
    applicable: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
    isOptional: false,
    appliedDate: "2025-01-01"
  }
];

// CRUD operations for fee types
export const getAllFeeTypes = (): FeeType[] => {
  return feeTypes;
};

export const getFeeTypeById = (id: string): FeeType | undefined => {
  return feeTypes.find(fee => fee.id === id);
};

export const addFeeType = (feeType: Omit<FeeType, 'id'>): FeeType => {
  const newId = (feeTypes.length + 1).toString();
  
  const newFeeType = {
    id: newId,
    ...feeType
  };
  
  feeTypes = [...feeTypes, newFeeType];
  return newFeeType;
};

export const updateFeeType = (updatedFeeType: FeeType): FeeType => {
  feeTypes = feeTypes.map(feeType => 
    feeType.id === updatedFeeType.id ? updatedFeeType : feeType
  );
  
  return updatedFeeType;
};

export const deleteFeeType = (id: string): boolean => {
  const initialLength = feeTypes.length;
  feeTypes = feeTypes.filter(feeType => feeType.id !== id);
  
  return feeTypes.length !== initialLength;
};

// Get fee types applicable to a specific class
export const getFeeTypesForClass = (className: string): FeeType[] => {
  return feeTypes.filter(fee => fee.applicable.includes(className));
};

// Get the total monthly fee amount for a specific class
export const getMonthlyFeeAmountForClass = (className: string): number => {
  return feeTypes
    .filter(fee => fee.frequency === 'monthly' && fee.applicable.includes(className) && !fee.isOptional)
    .reduce((total, fee) => total + fee.amount, 0);
};

// Get the total annual fee amount for a specific class
export const getAnnualFeeAmountForClass = (className: string): number => {
  return feeTypes
    .filter(fee => fee.frequency === 'annual' && fee.applicable.includes(className) && !fee.isOptional)
    .reduce((total, fee) => total + fee.amount, 0);
};

// Get the total monthly fee amount
export const getMonthlyFeeAmount = (): number => {
  return feeTypes
    .filter(fee => fee.frequency === 'monthly' && !fee.isOptional)
    .reduce((total, fee) => total + fee.amount, 0);
};

// Get the total annual fee amount
export const getAnnualFeeAmount = (): number => {
  return feeTypes
    .filter(fee => fee.frequency === 'annual' && !fee.isOptional)
    .reduce((total, fee) => total + fee.amount, 0);
};

// Get the total fee amount for the year (monthly fees × 12 + annual fees)
export const getTotalYearlyFee = (): number => {
  const monthlyTotal = getMonthlyFeeAmount() * 12;
  const annualTotal = getAnnualFeeAmount();
  
  return monthlyTotal + annualTotal;
};

// Get the total fee for a specific class for the year
export const getTotalYearlyFeeForClass = (className: string): number => {
  const monthlyTotal = getMonthlyFeeAmountForClass(className) * 12;
  const annualTotal = getAnnualFeeAmountForClass(className);
  
  return monthlyTotal + annualTotal;
};

// Utility function to reset data (for testing)
export const resetFeeTypeData = () => {
  feeTypes = [
    {
      id: "1",
      name: "Tuition Fee",
      description: "Regular monthly academic fee",
      amount: 2000,
      frequency: "monthly",
      applicable: ['Pre-Nursery', 'Nursery', 'Lower KG', 'Upper KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
      isOptional: false,
      appliedDate: "2025-01-01"
    },
    {
      id: "2",
      name: "Exam Fee",
      description: "Fee for term examinations",
      amount: 1500,
      frequency: "annual",
      applicable: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
      isOptional: false,
      appliedDate: "2025-01-01"
    },
    {
      id: "3",
      name: "Computer Fee",
      description: "Computer lab access and training",
      amount: 500,
      frequency: "monthly",
      applicable: ['3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
      isOptional: false,
      appliedDate: "2025-01-01"
    },
    {
      id: "4",
      name: "Development Fee",
      description: "School infrastructure development",
      amount: 3000,
      frequency: "annual",
      applicable: ['Pre-Nursery', 'Nursery', 'Lower KG', 'Upper KG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'],
      isOptional: false,
      appliedDate: "2025-01-01"
    }
  ];
};
