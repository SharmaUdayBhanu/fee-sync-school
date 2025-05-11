
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { getStudentById, deleteStudent, updateStudent } from '../services/students';
import type { Student } from '../services/students';
import { getPaymentsByStudentId } from '../services/payments';
import StudentProfile from '../components/student/StudentProfile';
import StudentFeeManager from '../components/student/StudentFeeManager';
import DeleteStudentDialog from '../components/student/DeleteStudentDialog';

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      console.log("Fetching student with ID:", id);
      const fetchedStudent = getStudentById(id);
      console.log("Fetched student:", fetchedStudent);
      
      if (fetchedStudent) {
        setStudent(fetchedStudent);
        
        // Get student payments
        const payments = getPaymentsByStudentId(id);
        console.log("Student payments:", payments);
        
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
          
          <DeleteStudentDialog 
            studentName={student.name}
            onDelete={handleDelete}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <StudentProfile student={student} />
          </div>
          
          <div className="md:col-span-2">
            <StudentFeeManager
              student={student}
              activeMonth={activeMonth}
              onUpdateFeeStatus={handleUpdateFeeStatus}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDetail;
