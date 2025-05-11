
import React from 'react';
import StudentCard from '../StudentCard';
import StudentCardActions from './StudentCardActions';
import { Users } from 'lucide-react';
import { Student } from '@/services/students';

type StudentCardViewProps = {
  students: Student[];
  onDeleteStudent: (id: string, name: string) => void;
};

const StudentCardView: React.FC<StudentCardViewProps> = ({
  students,
  onDeleteStudent
}) => {
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
    <div className="space-y-4">
      {students.map(student => (
        <div key={student.id} className="relative">
          <StudentCardActions
            studentId={student.id}
            studentName={student.name}
            onDeleteStudent={onDeleteStudent}
          />
          
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
  );
};

export default StudentCardView;
