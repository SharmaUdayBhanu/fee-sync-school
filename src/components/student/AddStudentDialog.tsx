
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
import { addStudentToSupabase } from '@/services/supabaseStudents';
import { isSupabaseConnected } from '@/lib/supabase';

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddStudent = async () => {
    // Validation
    if (!newStudent.name || !newStudent.guardianName || !newStudent.className) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Generate roll number if not provided
    const rollNumber = newStudent.rollNumber || 
                       `${newStudent.className}-${Math.floor(Math.random() * 900) + 100}`;

    try {
      const isConnected = await isSupabaseConnected();
      
      let added;
      if (isConnected) {
        // Use Supabase if connected
        added = await addStudentToSupabase({
          name: newStudent.name,
          guardianName: newStudent.guardianName,
          rollNumber,
          className: newStudent.className,
          admissionDate: new Date().toISOString().split('T')[0],
          feeStatus: 'unpaid',
          paidAmount: 0,
          totalAmount: 3000,
          monthlyFeeStatus: {}
        });
      } else {
        // Fallback to mock data if Supabase is not connected
        added = addStudent({
          name: newStudent.name,
          guardianName: newStudent.guardianName,
          rollNumber,
          className: newStudent.className,
          admissionDate: new Date().toISOString().split('T')[0],
          feeStatus: 'unpaid',
          paidAmount: 0,
          totalAmount: 3000,
          monthlyFeeStatus: {}
        });
      }
      
      if (added) {
        toast({
          title: "Student Added",
          description: `${added.name} has been added to Class ${added.className}.`,
        });
        
        setIsDialogOpen(false);
        setNewStudent({ name: '', guardianName: '', rollNumber: '', className: '' });
        onStudentAdded();
      } else {
        throw new Error("Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleAddStudent} disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
