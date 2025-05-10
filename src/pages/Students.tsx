import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Users, Trash2, Eye, Table as TableIcon, List } from 'lucide-react';
import StudentCard from '../components/StudentCard';
import { getAllStudents, classList, addStudent, deleteStudent } from '../services/students';
import type { Student } from '../services/students';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [newStudent, setNewStudent] = useState({
    name: '',
    guardianName: '',
    rollNumber: '',
    className: ''
  });
  
  const { toast } = useToast();

  // Load students on component mount
  useEffect(() => {
    setStudents(getAllStudents());
  }, []);

  // Filter students based on search term and selected class
  const filteredStudents = students.filter(student => {
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

  // Group students by class for table view
  const studentsByClass = classList.reduce((acc, className) => {
    acc[className] = sortedStudents.filter(student => student.className === className);
    return acc;
  }, {} as Record<string, Student[]>);

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
                       `${newStudent.className}-${Math.floor(Math.random() * 900) + 100}`;

    // Create monthly fee status (all unpaid initially)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const monthlyFeeStatus: {[month: string]: 'paid' | 'unpaid'} = {};
    months.forEach(month => {
      monthlyFeeStatus[month] = 'unpaid';
    });

    // Add the student
    const added = addStudent({
      name: newStudent.name,
      guardianName: newStudent.guardianName,
      rollNumber,
      className: newStudent.className,
      admissionDate: new Date().toISOString().split('T')[0],
      feeStatus: 'unpaid',
      paidAmount: 0,
      totalAmount: 3000,
      monthlyFeeStatus
    });

    // Update state with new student
    setStudents(getAllStudents());
    
    toast({
      title: "Student Added",
      description: `${added.name} has been added to Class ${added.className}.`,
    });
    
    setIsDialogOpen(false);
    setNewStudent({ name: '', guardianName: '', rollNumber: '', className: '' });
  };

  const handleDeleteStudent = (id: string, name: string) => {
    const deleted = deleteStudent(id);
    
    if (deleted) {
      setStudents(getAllStudents());
      
      toast({
        title: "Student Deleted",
        description: `${name} has been removed from the system.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete student.",
        variant: "destructive",
      });
    }
  };

  // Render table view of students grouped by class
  const renderTableView = () => {
    return (
      <div className="space-y-8">
        {classList.map(className => {
          const classStudents = studentsByClass[className] || [];
          
          if (selectedClass && selectedClass !== className) return null;
          
          return classStudents.length > 0 ? (
            <div key={className} className="rounded-md border">
              <div className="bg-muted/50 px-4 py-3 rounded-t-md">
                <h3 className="text-lg font-medium">Class {className}</h3>
                <p className="text-sm text-muted-foreground">{classStudents.length} students</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Guardian Name</TableHead>
                    <TableHead>Fee Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents.map(student => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.rollNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.guardianName}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          student.feeStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : student.feeStatus === 'partial' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-orange-100 text-orange-800'
                        }`}>
                          {student.feeStatus === 'paid' ? 'Paid' : student.feeStatus === 'partial' ? 'Partial' : 'Unpaid'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Link to={`/students/${student.id}`}>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
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
                                  onClick={() => handleDeleteStudent(student.id, student.name)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null;
        })}
        
        {!sortedStudents.length && (
          <div className="bg-card rounded-md p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium">No students found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm || selectedClass ? 
                'Try changing your search criteria.' : 
                'Start by adding students to the system.'}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render card view of students
  const renderCardView = () => {
    return sortedStudents.length > 0 ? (
      <div className="space-y-4">
        {sortedStudents.map(student => (
          <div key={student.id} className="relative">
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <Link to={`/students/${student.id}`}>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
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
                      onClick={() => handleDeleteStudent(student.id, student.name)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <StudentCard 
              id={student.id}
              name={student.name}
              guardianName={student.guardianName}
              rollNumber={student.rollNumber}
              className={student.className}
              feeStatus={student.feeStatus}
              paidAmount={student.paidAmount}
              totalAmount={student.totalAmount}
              lastPaymentDate={student.lastPaymentDate}
            />
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-card rounded-md p-8 text-center">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium">No students found</h3>
        <p className="text-muted-foreground mt-1">
          {searchTerm || selectedClass ? 
            'Try changing your search criteria.' : 
            'Start by adding students to the system.'}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">Manage and view student records</p>
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, guardian or roll number..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
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
            
            <div className="flex border rounded-md">
              <Button 
                variant={viewMode === 'card' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode('card')}
              >
                <List className="h-4 w-4 mr-1" />
                Cards
              </Button>
              <Button 
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode('table')}
              >
                <TableIcon className="h-4 w-4 mr-1" />
                Table
              </Button>
            </div>
          </div>
        </div>
        
        {viewMode === 'table' ? renderTableView() : renderCardView()}
      </main>
    </div>
  );
};

export default Students;
