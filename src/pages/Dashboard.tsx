
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '../components/Navbar';
import DashboardSummary from '../components/DashboardSummary';
import StudentCard from '../components/StudentCard';

// Mock data - in a real app, this would come from your API
const recentPayments = [
  {
    id: "1",
    studentName: "Arjun Sharma",
    class: "5th",
    amount: 2500,
    date: "2025-05-05"
  },
  {
    id: "2",
    studentName: "Priya Patel",
    class: "8th",
    amount: 3000,
    date: "2025-05-04"
  },
  {
    id: "3",
    studentName: "Rahul Singh",
    class: "3rd",
    amount: 1800,
    date: "2025-05-03"
  }
];

const pendingStudents = [
  {
    id: "4",
    name: "Sanya Gupta",
    guardianName: "Rajiv Gupta",
    rollNumber: "10A23",
    className: "10th",
    feeStatus: "unpaid",
    paidAmount: 0,
    totalAmount: 5000,
    lastPaymentDate: undefined
  },
  {
    id: "5",
    name: "Vikram Mehta",
    guardianName: "Sunita Mehta",
    rollNumber: "7B12",
    className: "7th",
    feeStatus: "partial",
    paidAmount: 1500,
    totalAmount: 3000,
    lastPaymentDate: "Apr 15, 2025"
  }
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">Overview of school fee collection</p>
        
        <DashboardSummary />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Class-wise Fee Status */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Fee Status by Class</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium">
                  <div>Class</div>
                  <div>Total Students</div>
                  <div>Paid</div>
                  <div>Pending</div>
                </div>
                
                <div className="divide-y">
                  {/* Class data rows */}
                  {['1st', '2nd', '3rd', '4th', '5th'].map((classLevel) => (
                    <div key={classLevel} className="grid grid-cols-4 gap-4 py-3 text-sm">
                      <div className="font-medium">Class {classLevel}</div>
                      <div>{Math.floor(Math.random() * 20) + 10}</div>
                      <div className="text-green-600">{Math.floor(Math.random() * 15) + 5}</div>
                      <div className="text-orange-600">{Math.floor(Math.random() * 5) + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments.map(payment => (
                  <div key={payment.id} className="flex justify-between items-start pb-4 border-b last:border-0">
                    <div>
                      <p className="font-medium">{payment.studentName}</p>
                      <p className="text-sm text-gray-500">Class {payment.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{payment.amount}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Students with Pending Fees */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Students With Pending Fees</h2>
          <div className="space-y-4">
            {pendingStudents.map(student => (
              <StudentCard 
                key={student.id}
                id={student.id}
                name={student.name}
                guardianName={student.guardianName}
                rollNumber={student.rollNumber}
                className={student.className}
                feeStatus={student.feeStatus as 'paid' | 'partial' | 'unpaid'}
                paidAmount={student.paidAmount}
                totalAmount={student.totalAmount}
                lastPaymentDate={student.lastPaymentDate}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
