
import React from 'react';
import { Card } from '@/components/ui/card';
import FeeStatus from './FeeStatus';
import QRCodeGenerator from './QRCodeGenerator';

type StudentCardProps = {
  id: string;
  name: string;
  guardianName: string;
  rollNumber: string;
  className: string;
  feeStatus: 'paid' | 'partial' | 'unpaid';
  paidAmount: number;
  totalAmount: number;
  lastPaymentDate?: string;
};

const StudentCard: React.FC<StudentCardProps> = ({
  id,
  name,
  guardianName,
  rollNumber,
  className,
  feeStatus,
  paidAmount,
  totalAmount,
  lastPaymentDate
}) => {
  return (
    <Card className={`p-4 border-l-4 ${
      feeStatus === 'paid' ? 'border-l-green-500' : 
      feeStatus === 'partial' ? 'border-l-yellow-500' : 
      'border-l-orange-500'
    }`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-lg">{name}</h3>
          <div className="text-sm text-gray-500 mt-1">
            <p>Guardian: {guardianName}</p>
            <div className="flex gap-3 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                Roll #{rollNumber}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary-foreground">
                Class {className}
              </span>
            </div>
          </div>
          {lastPaymentDate && (
            <p className="text-xs text-gray-500 mt-2">
              Last payment: {lastPaymentDate}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full sm:w-48">
            <FeeStatus 
              status={feeStatus} 
              paidAmount={paidAmount} 
              totalAmount={totalAmount} 
            />
          </div>
          
          <div className="flex-shrink-0">
            <QRCodeGenerator
              studentName={name}
              amount={totalAmount - paidAmount}
              purpose={`Fee for Class ${className}`}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StudentCard;
