
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StudentProfileProps = {
  student: {
    rollNumber: string;
    className: string;
    guardianName: string;
    admissionDate: string;
    phone?: string;
    email?: string;
    address?: string;
  };
};

const StudentProfile: React.FC<StudentProfileProps> = ({ student }) => {
  return (
    <Card>
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
        {student.phone && (
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Phone</span>
            <span className="font-medium">{student.phone}</span>
          </div>
        )}
        {student.email && (
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="font-medium">{student.email}</span>
          </div>
        )}
        {student.address && (
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Address</span>
            <span className="font-medium">{student.address}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentProfile;
