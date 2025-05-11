
import React from 'react';
import { Link } from 'react-router-dom';
import { classList, Student } from '@/services/students';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Users } from 'lucide-react';
import DeleteStudentDialog from './DeleteStudentDialog';

type StudentTableViewProps = {
  students: Student[];
  selectedClass: string;
  onDeleteStudent: (id: string, name: string) => void;
};

const StudentTableView: React.FC<StudentTableViewProps> = ({
  students,
  selectedClass,
  onDeleteStudent
}) => {
  // Group students by class for table view
  const studentsByClass = classList.reduce((acc, className) => {
    acc[className] = students.filter(student => student.className === className);
    return acc;
  }, {} as Record<string, Student[]>);

  if (students.length === 0) {
    return (
      <div className="bg-card rounded-md p-8 text-center">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium">No students found</h3>
        <p className="text-muted-foreground mt-1">
          Try changing your search criteria or add new students.
        </p>
      </div>
    );
  }

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
                        <DeleteStudentDialog
                          studentName={student.name}
                          onDelete={() => onDeleteStudent(student.id, student.name)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null;
      })}
    </div>
  );
};

export default StudentTableView;
