
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '../components/Navbar';
import DashboardSummary from '../components/DashboardSummary';
import StudentCard from '../components/StudentCard';
import { useNavigate } from 'react-router-dom';

// Mock data for class-wise fees
const classFeeData = [
  { class: 'Pre-Nursery', totalStudents: 15, paidStudents: 10, partialStudents: 3, unpaidStudents: 2, feeCollected: 18500 },
  { class: 'Nursery', totalStudents: 18, paidStudents: 12, partialStudents: 4, unpaidStudents: 2, feeCollected: 22800 },
  { class: 'Lower KG', totalStudents: 20, paidStudents: 15, partialStudents: 3, unpaidStudents: 2, feeCollected: 27000 },
  { class: 'Upper KG', totalStudents: 22, paidStudents: 16, partialStudents: 4, unpaidStudents: 2, feeCollected: 29400 },
  { class: '1st', totalStudents: 25, paidStudents: 18, partialStudents: 5, unpaidStudents: 2, feeCollected: 32500 },
  { class: '2nd', totalStudents: 24, paidStudents: 19, partialStudents: 3, unpaidStudents: 2, feeCollected: 31200 },
  { class: '3rd', totalStudents: 26, paidStudents: 20, partialStudents: 4, unpaidStudents: 2, feeCollected: 33800 },
  { class: '4th', totalStudents: 28, paidStudents: 22, partialStudents: 4, unpaidStudents: 2, feeCollected: 36400 },
  { class: '5th', totalStudents: 30, paidStudents: 25, partialStudents: 3, unpaidStudents: 2, feeCollected: 42000 },
];

// Recent payments mock data
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
  const navigate = useNavigate();
  
  const handleClassRowClick = (className: string) => {
    navigate(`/students?class=${className}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Overview of school fee collection</p>
        
        <DashboardSummary />
        
        {/* Class-wise Fee Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Fee Collection by Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Class</th>
                    <th className="pb-2">Total Students</th>
                    <th className="pb-2">Paid</th>
                    <th className="pb-2">Partial</th>
                    <th className="pb-2">Unpaid</th>
                    <th className="pb-2 text-right">Fee Collected</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {classFeeData.map((item, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-accent/50 cursor-pointer" 
                      onClick={() => handleClassRowClick(item.class)}
                    >
                      <td className="py-3 font-medium">{item.class}</td>
                      <td className="py-3">{item.totalStudents}</td>
                      <td className="py-3 text-green-600">{item.paidStudents}</td>
                      <td className="py-3 text-yellow-600">{item.partialStudents}</td>
                      <td className="py-3 text-red-600">{item.unpaidStudents}</td>
                      <td className="py-3 text-right font-medium">₹{item.feeCollected.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Class-wise Fee Collection */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Fee Collection Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classFeeData.slice(0, 5).map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Class {item.class}</span>
                      <span className="text-sm">{Math.round((item.paidStudents / item.totalStudents) * 100)}% Collected</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(item.paidStudents / item.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
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
                      <p className="text-sm text-muted-foreground">Class {payment.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{payment.amount}</p>
                      <p className="text-xs text-muted-foreground">
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
