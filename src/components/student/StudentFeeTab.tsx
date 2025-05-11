
import React from 'react';
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";

type StudentFeeTabProps = {
  month: string;
  feeStatus: 'paid' | 'unpaid';
  lastPaymentDate?: string;
  onUpdateFeeStatus: (month: string, status: 'paid' | 'unpaid') => void;
};

const StudentFeeTab: React.FC<StudentFeeTabProps> = ({ 
  month, 
  feeStatus, 
  lastPaymentDate, 
  onUpdateFeeStatus 
}) => {
  return (
    <TabsContent value={month} className="mt-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h3 className="text-xl font-medium mb-2">{month} Fee</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              feeStatus === 'paid' ? 'bg-green-500' : 'bg-orange-500'
            }`}></div>
            <span className="text-sm">
              Status: <span className="font-medium">{feeStatus === 'paid' ? 'Paid' : 'Unpaid'}</span>
            </span>
          </div>
          {feeStatus === 'paid' && lastPaymentDate && (
            <p className="text-sm text-muted-foreground mt-1">
              Paid on {lastPaymentDate}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          {feeStatus === 'unpaid' ? (
            <Button 
              onClick={() => onUpdateFeeStatus(month, 'paid')}
              className="bg-green-500 hover:bg-green-600"
            >
              Mark as Paid
            </Button>
          ) : (
            <Button 
              variant="outline"
              onClick={() => onUpdateFeeStatus(month, 'unpaid')}
            >
              Mark as Unpaid
            </Button>
          )}
        </div>
      </div>
    </TabsContent>
  );
};

export default StudentFeeTab;
