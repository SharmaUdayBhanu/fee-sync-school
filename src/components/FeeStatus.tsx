
import React from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';

type FeeStatusProps = {
  status: 'paid' | 'partial' | 'unpaid';
  paidAmount?: number;
  totalAmount?: number;
};

const FeeStatus: React.FC<FeeStatusProps> = ({ 
  status, 
  paidAmount = 0, 
  totalAmount = 0 
}) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'paid':
        return {
          icon: <Check className="h-4 w-4" />,
          text: 'Paid',
          className: 'status-paid',
          percentage: 100
        };
      case 'partial':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          text: 'Partial',
          className: 'status-partial',
          percentage: totalAmount ? Math.round((paidAmount / totalAmount) * 100) : 50
        };
      case 'unpaid':
        return {
          icon: <X className="h-4 w-4" />,
          text: 'Unpaid',
          className: 'status-unpaid',
          percentage: 0
        };
      default:
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          text: 'Unknown',
          className: 'bg-gray-200',
          percentage: 0
        };
    }
  };

  const { icon, text, className, percentage } = getStatusDetails();

  return (
    <div className="w-full">
      <div className="flex items-center mb-1">
        <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${className}`}>
          {icon}
          <span className="ml-1">{text}</span>
        </div>
        {totalAmount > 0 && (
          <span className="ml-2 text-xs text-gray-500">
            ₹{paidAmount.toLocaleString()} / ₹{totalAmount.toLocaleString()}
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${
            status === 'paid' ? 'bg-green-500' : 
            status === 'partial' ? 'bg-yellow-500' : 
            'bg-orange-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FeeStatus;
