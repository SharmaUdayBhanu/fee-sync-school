
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import StudentCard from '../components/StudentCard';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Users } from 'lucide-react';

// List of available classes
const classList = [
  'Pre-Nursery', 'Nursery', 'Lower KG', 'Upper KG',
  '1st', '2nd', '3rd', '4th', '5th',
  '6th', '7th', '8th', '9th', '10th'
];

// Mock student data
const mockStudents = [
  {
    id: '1',
    name: 'Aarav Kumar',
    guardianName: 'Rajesh Kumar',
    rollNumber: '101',
    className: '5th',
    feeStatus: 'paid',
    paidAmount: 3000,
    totalAmount: 3000,
    lastPaymentDate: 'May 02, 2025'
  },
  {
    id: '2',
    name: 'Diya Sharma',
    guardianName: 'Anita Sharma',
    rollNumber: '102',
    className: '5th',
    feeStatus: 'unpaid',
    paidAmount: 0,
    totalAmount: 3000,
    lastPaymentDate: undefined
  },
  {
    id: '3',
    name: 'Vihaan Patel',
    guardianName: 'Suresh Patel',
    rollNumber: '103',
    className: '5th',
    feeStatus: 'partial',
    paidAmount: 1500,
    totalAmount: 3000,
    lastPaymentDate: 'Apr 20, 2025'
  },
  {
    id: '4',
    name: 'Ananya Singh',
    guardianName: 'Vikram Singh',
    rollNumber: '201',
    className: '8th',
    feeStatus: 'paid',
    paidAmount: 4500,
    totalAmount: 4500,
    lastPaymentDate: 'May 05, 2025'
  },
  {
    id: '5',
    name: 'Rehan Malik',
    guardianName: 'Faisal Malik',
    rollNumber: '202',
    className: '8th',
    feeStatus: 'unpaid',
    paidAmount: 0,
    totalAmount: 4500,
    lastPaymentDate: undefined
  }
];

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    guardianName: '',
    rollNumber: '',
    className: ''
  });
  const { toast } = useToast();

  // Filter students based on search term and selected class
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === '' || student.className === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  // Sort students: unpaid first, then partial, then paid
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const statusOrder = { unpaid: 0, partial: 1, paid: 2 };
    return statusOrder[a.feeStatus as keyof typeof statusOrder] - statusOrder[b.feeStatus as keyof typeof statusOrder];
  });

  const handleAddStudent = () => {
    // Validation
    if (!newStudent.name || !newStudent.guardianName || !newStudent.className) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Generate roll number if not provided
    const rollNumber = newStudent.rollNumber || 
                       `${Math.floor(Math.random() * 900) + 100}`;

    // In a real app, this would be an API call
    toast({
      title: "Student Added",
      description: `${newStudent.name} has been added to Class ${newStudent.className}.`,
    });
    
    setIsDialogOpen(false);
    setNewStudent({ name: '', guardianName: '', rollNumber: '', className: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-gray-500">Manage and view student records</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the student details below to add them to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="studentName" className="text-sm font-medium">
                    Student Name *
                  </label>
                  <Input
                    id="studentName"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    placeholder="Enter student name"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="guardianName" className="text-sm font-medium">
                    Guardian's Name *
                  </label>
                  <Input
                    id="guardianName"
                    value={newStudent.guardianName}
                    onChange={(e) => setNewStudent({...newStudent, guardianName: e.target.value})}
                    placeholder="Enter guardian's name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="rollNumber" className="text-sm font-medium">
                      Roll Number
                    </label>
                    <Input
                      id="rollNumber"
                      value={newStudent.rollNumber}
                      onChange={(e) => setNewStudent({...newStudent, rollNumber: e.target.value})}
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="className" className="text-sm font-medium">
                      Class *
                    </label>
                    <Select 
                      value={newStudent.className} 
                      onValueChange={(value) => setNewStudent({...newStudent, className: value})}
                    >
                      <SelectTrigger id="className">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classList.map((cls) => (
                          <SelectItem key={cls} value={cls}>
                            {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStudent}>
                  Add Student
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, guardian or roll number..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Classes</SelectItem>
              {classList.map((cls) => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {sortedStudents.length > 0 ? (
          <div className="space-y-4">
            {sortedStudents.map(student => (
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
        ) : (
          <div className="bg-white rounded-md p-8 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium">No students found</h3>
            <p className="text-gray-500 mt-1">
              {searchTerm || selectedClass ? 
                'Try changing your search criteria.' : 
                'Start by adding students to the system.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Students;
