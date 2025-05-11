
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { classList, addStudent } from '@/services/students';

type AddStudentDialogProps = {
  onStudentAdded: () => void;
};

const AddStudentDialog: React.FC<AddStudentDialogProps> = ({ onStudentAdded }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    guardianName: '',
    rollNumber: '',
    className: ''
  });
  const { toast } = useToast();

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
    
    toast({
      title: "Student Added",
      description: `${added.name} has been added to Class ${added.className}.`,
    });
    
    setIsDialogOpen(false);
    setNewStudent({ name: '', guardianName: '', rollNumber: '', className: '' });
    onStudentAdded();
  };

  return (
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
  );
};

export default AddStudentDialog;
