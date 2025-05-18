
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useToast } from '@/components/ui/use-toast';
import { getAllStudents, deleteStudent } from '../services/students';
import { getAllStudentsFromSupabase, deleteStudentFromSupabase } from '@/services/supabaseStudents';
import { isSupabaseConnected } from '@/lib/supabase';
import type { Student } from '../services/students';
import AddStudentDialog from '../components/student/AddStudentDialog';
import StudentsSearch from '../components/student/StudentsSearch';
import StudentCardView from '../components/student/StudentCardView';
import StudentTableView from '../components/student/StudentTableView';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [isLoading, setIsLoading] = useState(true);
  const [usingSupabase, setUsingSupabase] = useState(false);
  
  const { toast } = useToast();

  // Load students on component mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      // Check if Supabase is connected
      const connected = await isSupabaseConnected();
      setUsingSupabase(connected);
      
      let allStudents: Student[];
      if (connected) {
        // Use Supabase if connected
        allStudents = await getAllStudentsFromSupabase();
        console.log("Loaded students from Supabase:", allStudents);
      } else {
        // Fallback to mock data if Supabase is not connected
        allStudents = getAllStudents();
        console.log("Loaded mock students:", allStudents);
      }
      
      setStudents(allStudents);
    } catch (error) {
      console.error("Error loading students:", error);
      toast({
        title: "Error",
        description: "Failed to load students. Using mock data instead.",
        variant: "destructive",
      });
      // Fallback to mock data
      const mockStudents = getAllStudents();
      setStudents(mockStudents);
      setUsingSupabase(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter students based on search term and selected class
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        student.guardianName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === '' || student.className === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  // Sort students: unpaid first, then partial, then paid
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const statusOrder = { unpaid: 0, partial: 1, paid: 2 };
    return statusOrder[a.feeStatus as keyof typeof statusOrder] - statusOrder[b.feeStatus as keyof typeof statusOrder];
  });

  const handleDeleteStudent = async (id: string, name: string) => {
    try {
      let deleted: boolean;
      if (usingSupabase) {
        // Use Supabase if connected
        deleted = await deleteStudentFromSupabase(id);
      } else {
        // Fallback to mock data if Supabase is not connected
        deleted = deleteStudent(id);
      }
      
      if (deleted) {
        await loadStudents();
        
        toast({
          title: "Student Deleted",
          description: `${name} has been removed from the system.`,
        });
      } else {
        throw new Error("Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "Error",
        description: "Failed to delete student.",
        variant: "destructive",
      });
    }
  };

  console.log("Render students:", students.length, sortedStudents.length);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">Manage and view student records</p>
            {usingSupabase && (
              <div className="mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Using Supabase
              </div>
            )}
          </div>
          
          <AddStudentDialog onStudentAdded={loadStudents} />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        ) : (
          <>
            <StudentsSearch 
              searchTerm={searchTerm}
              selectedClass={selectedClass}
              viewMode={viewMode}
              onSearchChange={setSearchTerm}
              onClassChange={setSelectedClass}
              onViewModeChange={setViewMode}
            />
            
            {viewMode === 'table' ? (
              <StudentTableView 
                students={sortedStudents}
                selectedClass={selectedClass}
                onDeleteStudent={handleDeleteStudent}
              />
            ) : (
              <StudentCardView 
                students={sortedStudents}
                onDeleteStudent={handleDeleteStudent}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Students;
