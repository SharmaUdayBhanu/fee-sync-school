
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Check, AlertTriangle, X } from 'lucide-react';

type SummaryCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, description, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

const DashboardSummary = () => {
  // In a real app, these would be fetched from your API
  const summaryData = {
    feesCollected: 128500,
    unpaidBalance: 45000,
    studentsPaid: 42,
    studentsUnpaid: 15,
    studentsPartial: 8
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard 
        title="Total Fees Collected" 
        value={`₹${summaryData.feesCollected.toLocaleString()}`}
        description="Current academic session"
        icon={<Check className="h-4 w-4 text-green-500" />}
      />
      
      <SummaryCard 
        title="Unpaid Balance" 
        value={`₹${summaryData.unpaidBalance.toLocaleString()}`}
        description="Pending collections"
        icon={<X className="h-4 w-4 text-orange-500" />}
      />
      
      <SummaryCard 
        title="Students Paid" 
        value={summaryData.studentsPaid}
        description={`${Math.round((summaryData.studentsPaid / (summaryData.studentsPaid + summaryData.studentsUnpaid + summaryData.studentsPartial)) * 100)}% of total students`}
        icon={<Check className="h-4 w-4 text-green-500" />}
      />
      
      <SummaryCard 
        title="Students with Pending Fees" 
        value={summaryData.studentsUnpaid + summaryData.studentsPartial}
        description={`${summaryData.studentsUnpaid} unpaid, ${summaryData.studentsPartial} partial`}
        icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
      />
    </div>
  );
};

export default DashboardSummary;
