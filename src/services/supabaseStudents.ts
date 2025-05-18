
import { supabase } from '@/lib/supabase';
import { Student, ClassInfo } from './students';

// Get all students from Supabase
export const getAllStudentsFromSupabase = async (): Promise<Student[]> => {
  const { data, error } = await supabase
    .from('students')
    .select('*');

  if (error) {
    console.error('Error fetching students:', error);
    return [];
  }

  return data || [];
};

// Get student by ID from Supabase
export const getStudentByIdFromSupabase = async (id: string): Promise<Student | undefined> => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching student:', error);
    return undefined;
  }

  return data;
};

// Add student to Supabase
export const addStudentToSupabase = async (student: Omit<Student, 'id'>): Promise<Student | undefined> => {
  // Generate monthly fee status
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const monthlyFeeStatus: {[month: string]: 'paid' | 'unpaid'} = {};
  months.forEach(month => {
    monthlyFeeStatus[month] = 'unpaid';
  });

  const newStudent = {
    ...student,
    feeStatus: 'unpaid',
    paidAmount: 0,
    totalAmount: 3000,
    monthlyFeeStatus
  };

  const { data, error } = await supabase
    .from('students')
    .insert(newStudent)
    .select()
    .single();

  if (error) {
    console.error('Error adding student:', error);
    return undefined;
  }

  return data;
};

// Delete student from Supabase
export const deleteStudentFromSupabase = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting student:', error);
    return false;
  }

  return true;
};

// Update student in Supabase
export const updateStudentInSupabase = async (student: Student): Promise<Student | undefined> => {
  const { data, error } = await supabase
    .from('students')
    .update(student)
    .eq('id', student.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating student:', error);
    return undefined;
  }

  return data;
};

// Get all classes from Supabase
export const getAllClassInfoFromSupabase = async (): Promise<ClassInfo[]> => {
  const { data, error } = await supabase
    .from('classes')
    .select('*');

  if (error) {
    console.error('Error fetching classes:', error);
    return [];
  }

  return data || [];
};

// Add class to Supabase
export const addClassToSupabase = async (classInfo: Omit<ClassInfo, 'id'>): Promise<ClassInfo | undefined> => {
  const { data, error } = await supabase
    .from('classes')
    .insert(classInfo)
    .select()
    .single();

  if (error) {
    console.error('Error adding class:', error);
    return undefined;
  }

  return data;
};

// Update fee structure in Supabase
export const updateFeeStructureInSupabase = async (className: string, monthlyFee: number, admissionFee: number): Promise<boolean> => {
  const { error } = await supabase
    .from('fee_structure')
    .upsert({
      class: className,
      monthlyFee,
      admissionFee
    });

  if (error) {
    console.error('Error updating fee structure:', error);
    return false;
  }

  return true;
};
