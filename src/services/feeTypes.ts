
// Define fee types used in the system
export type FeeType = {
  id: string;
  name: string;
  description: string;
  amount: number;
  frequency: 'annual' | 'monthly' | 'one-time';
};

// Mock fee types with the requested structure (removed lab and sports fee, added exam fee)
export const feeTypes: FeeType[] = [
  {
    id: "1",
    name: "Tuition Fee",
    description: "Regular monthly academic fee",
    amount: 2000,
    frequency: "monthly"
  },
  {
    id: "2",
    name: "Exam Fee",
    description: "Fee for term examinations",
    amount: 1500,
    frequency: "annual"
  },
  {
    id: "3",
    name: "Computer Fee",
    description: "Computer lab access and training",
    amount: 500,
    frequency: "monthly"
  },
  {
    id: "4",
    name: "Development Fee",
    description: "School infrastructure development",
    amount: 3000,
    frequency: "annual"
  }
];

// Get the total monthly fee amount
export const getMonthlyFeeAmount = (): number => {
  return feeTypes
    .filter(fee => fee.frequency === 'monthly')
    .reduce((total, fee) => total + fee.amount, 0);
};

// Get the total annual fee amount
export const getAnnualFeeAmount = (): number => {
  return feeTypes
    .filter(fee => fee.frequency === 'annual')
    .reduce((total, fee) => total + fee.amount, 0);
};

// Get the total fee amount for the year (monthly fees × 12 + annual fees)
export const getTotalYearlyFee = (): number => {
  const monthlyTotal = getMonthlyFeeAmount() * 12;
  const annualTotal = getAnnualFeeAmount();
  
  return monthlyTotal + annualTotal;
};
