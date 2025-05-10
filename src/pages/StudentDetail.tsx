
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, User, Calendar, FileText, Trash2 } from 'lucide-react';
import { getStudentById, deleteStudent, updateStudent } from '../services/students';
import type { Student } from '../services/students';
import FeeStatus from '../components/FeeStatus';

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchedStudent = getStudentById(id);
      
      if (fetchedStudent) {
        setStudent(fetchedStudent);
        // Set active month to current month or first month
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        if (fetchedStudent.monthlyFeeStatus[currentMonth]) {
          setActiveMonth(currentMonth);
        } else {
          setActiveMonth(Object.keys(fetchedStudent.monthlyFeeStatus)[0]);
        }
      } else {
        toast({
          title: "Student Not Found",
          description: "The requested student could not be found.",
          variant: "destructive",
        });
        navigate('/students');
      }
      
      setLoading(false);
    }
  }, [id, navigate, toast]);

  const handleDelete = () => {
    if (!student) return;
    
    const deleted = deleteStudent(student.id);
    
    if (deleted) {
      toast({
        title: "Student Deleted",
        description: `${student.name} has been removed from the system.`,
      });
      navigate('/students');
    } else {
      toast({
        title: "Error",
        description: "Failed to delete student.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFeeStatus = (month: string, status: 'paid' | 'unpaid') => {
    if (!student) return;
    
    // Create a copy of the student's monthly fee status
    const updatedMonthlyStatus = { ...student.monthlyFeeStatus };
    updatedMonthlyStatus[month] = status;
    
    // Count paid months
    const paidMonths = Object.values(updatedMonthlyStatus).filter(s => s === 'paid').length;
    
    // Calculate fee status and amounts
    let feeStatus: 'paid' | 'partial' | 'unpaid';
    let paidAmount: number;
    
    if (paidMonths === 0) {
      feeStatus = 'unpaid';
      paidAmount = 0;
    } else if (paidMonths === 12) {
      feeStatus = 'paid';
      paidAmount = student.totalAmount;
    } else {
      feeStatus = 'partial';
      paidAmount = Math.round((paidMonths / 12) * student.totalAmount);
    }
    
    // Update student
    const updatedStudent: Student = {
      ...student,
      feeStatus,
      paidAmount,
      monthlyFeeStatus: updatedMonthlyStatus,
      lastPaymentDate: status === 'paid' ? new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }) : student.lastPaymentDate
    };
    
    updateStudent(updatedStudent);
    setStudent(updatedStudent);
    
    toast({
      title: status === 'paid' ? "Fee Marked as Paid" : "Fee Marked as Unpaid",
      description: `${month} fee for ${student.name} has been updated.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="outline" size="sm" onClick={() => navigate('/students')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </div>
          <div className="flex justify-center items-center h-64">
            <p>Loading student details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button variant="outline" size="sm" onClick={() => navigate('/students')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </div>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
            <p className="text-muted-foreground">The student you are looking for does not exist.</p>
          </div>
        </main>
      </div>
    );
  }

  // Get months array and current fee status
  const months = Object.keys(student.monthlyFeeStatus);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/students')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">{student.name}</h1>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Student
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Student</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {student.name}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Roll Number</span>
                <span className="font-medium">{student.rollNumber}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Class</span>
                <span className="font-medium">{student.className}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Guardian's Name</span>
                <span className="font-medium">{student.guardianName}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Admission Date</span>
                <span className="font-medium">
                  {new Date(student.admissionDate).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
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
                  <TabsContent key={month} value={month} className="mt-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                      <div>
                        <h3 className="text-xl font-medium mb-2">{month} Fee</h3>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            student.monthlyFeeStatus[month] === 'paid' ? 'bg-green-500' : 'bg-orange-500'
                          }`}></div>
                          <span className="text-sm">
                            Status: <span className="font-medium">{student.monthlyFeeStatus[month] === 'paid' ? 'Paid' : 'Unpaid'}</span>
                          </span>
                        </div>
                        {student.monthlyFeeStatus[month] === 'paid' && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Paid on {student.lastPaymentDate || 'N/A'}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {student.monthlyFeeStatus[month] === 'unpaid' ? (
                          <Button 
                            onClick={() => handleUpdateFeeStatus(month, 'paid')}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Mark as Paid
                          </Button>
                        ) : (
                          <Button 
                            variant="outline"
                            onClick={() => handleUpdateFeeStatus(month, 'unpaid')}
                          >
                            Mark as Unpaid
                          </Button>
                        )}
                      </div>
                    </div>
                  </TabsContent>
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
        </div>
      </main>
    </div>
  );
};

export default StudentDetail;
