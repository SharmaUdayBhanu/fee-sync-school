
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import FeeStatus from '../FeeStatus';
import StudentFeeTab from './StudentFeeTab';

type StudentFeeManagerProps = {
  student: {
    feeStatus: 'paid' | 'partial' | 'unpaid';
    paidAmount: number;
    totalAmount: number;
    lastPaymentDate?: string;
    monthlyFeeStatus: {
      [month: string]: 'paid' | 'unpaid';
    };
  };
  activeMonth: string | null;
  onUpdateFeeStatus: (month: string, status: 'paid' | 'unpaid') => void;
};

const StudentFeeManager: React.FC<StudentFeeManagerProps> = ({ 
  student, 
  activeMonth,
  onUpdateFeeStatus
}) => {
  const months = Object.keys(student.monthlyFeeStatus);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Status</CardTitle>
        <CardDescription>View and manage monthly fee payments</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeMonth || months[0]} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex w-auto">
              {months.map(month => (
                <TabsTrigger 
                  key={month} 
                  value={month}
                  className={`${
                    student.monthlyFeeStatus[month] === 'paid' ? 'data-[state=active]:bg-green-500 data-[state=active]:text-white' : 
                    'data-[state=active]:bg-primary'
                  }`}
                >
                  {month}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {months.map(month => (
            <StudentFeeTab 
              key={month}
              month={month}
              feeStatus={student.monthlyFeeStatus[month]}
              lastPaymentDate={student.monthlyFeeStatus[month] === 'paid' ? student.lastPaymentDate : undefined}
              onUpdateFeeStatus={onUpdateFeeStatus}
            />
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6 flex flex-col items-start">
        <h3 className="font-medium mb-3">Overall Fee Status</h3>
        <div className="w-full max-w-md">
          <FeeStatus 
            status={student.feeStatus} 
            paidAmount={student.paidAmount} 
            totalAmount={student.totalAmount}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default StudentFeeManager;
