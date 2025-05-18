
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from 'lucide-react';
import DeleteStudentDialog from './DeleteStudentDialog';
import { useIsMobile } from '@/hooks/use-mobile';

type StudentCardActionsProps = {
  studentId: string;
  studentName: string;
  onDeleteStudent: (id: string, name: string) => void;
};

const StudentCardActions: React.FC<StudentCardActionsProps> = ({
  studentId,
  studentName,
  onDeleteStudent
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="absolute top-4 right-4 flex gap-2 z-10">
      <Link to={`/students/${studentId}`}>
        <Button 
          size={isMobile ? "icon" : "sm"} 
          variant="outline" 
          className={isMobile ? "h-10 w-10 p-0 touch-target" : "h-8 w-8 p-0"}
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View</span>
        </Button>
      </Link>
      <DeleteStudentDialog 
        studentName={studentName}
        onDelete={() => onDeleteStudent(studentId, studentName)}
      />
    </div>
  );
};

export default StudentCardActions;
