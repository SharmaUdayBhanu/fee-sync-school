
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import FeeStatus from '../components/FeeStatus';
import { Plus, FileText, Calendar } from 'lucide-react';
import { updateFeeStructureInSupabase } from '@/services/supabaseStudents';
import { isSupabaseConnected } from '@/lib/supabase';
import { classList } from '@/services/students';

// Mock fee types
const feeTypes = [
  { id: '1', name: 'Monthly Fee May 2025', type: 'monthly' },
  { id: '2', name: 'Admission Fee 2025', type: 'admission' },
  { id: '3', name: 'Computer Lab Fee', type: 'other' },
  { id: '4', name: 'Sports Fee', type: 'other' }
];

// Mock fee structure
const feeStructure = [
  { class: 'Pre-Nursery', monthlyFee: 1500, admissionFee: 5000 },
  { class: 'Nursery', monthlyFee: 1800, admissionFee: 5000 },
  { class: 'Lower KG', monthlyFee: 2000, admissionFee: 5000 },
  { class: 'Upper KG', monthlyFee: 2200, admissionFee: 5000 },
  { class: '1st', monthlyFee: 2500, admissionFee: 6000 },
  { class: '2nd', monthlyFee: 2500, admissionFee: 6000 },
  { class: '3rd', monthlyFee: 2800, admissionFee: 6000 },
  { class: '4th', monthlyFee: 2800, admissionFee: 6000 },
  { class: '5th', monthlyFee: 3000, admissionFee: 7000 },
  { class: '6th', monthlyFee: 3500, admissionFee: 7000 },
  { class: '7th', monthlyFee: 3500, admissionFee: 7000 },
  { class: '8th', monthlyFee: 4000, admissionFee: 8000 },
  { class: '9th', monthlyFee: 4500, admissionFee: 8000 },
  { class: '10th', monthlyFee: 5000, admissionFee: 8000 },
];

// Mock payment records
const paymentRecords = [
  { 
    id: '1', 
    studentName: 'Ishaan Verma', 
    class: '4th', 
    feeType: 'Monthly Fee May 2025',
    status: 'paid', 
    amount: 2800, 
    paidAmount: 2800, 
    date: '2025-05-01' 
  },
  { 
    id: '2', 
    studentName: 'Sara Khan', 
    class: '9th', 
    feeType: 'Monthly Fee May 2025',
    status: 'partial', 
    amount: 4500, 
    paidAmount: 2000, 
    date: '2025-05-03' 
  },
  { 
    id: '3', 
    studentName: 'Arjun Reddy', 
    class: '7th', 
    feeType: 'Monthly Fee May 2025',
    status: 'unpaid', 
    amount: 3500, 
    paidAmount: 0, 
    date: null 
  },
  { 
    id: '4', 
    studentName: 'Meera Joshi', 
    class: '2nd', 
    feeType: 'Admission Fee 2025',
    status: 'paid', 
    amount: 6000, 
    paidAmount: 6000, 
    date: '2025-04-15' 
  },
];

const Fees = () => {
  const [isNewFeeDialogOpen, setIsNewFeeDialogOpen] = useState(false);
  const [isEditFeeStructureDialogOpen, setIsEditFeeStructureDialogOpen] = useState(false);
  const [newFee, setNewFee] = useState({
    name: '',
    type: 'monthly',
    dueDate: ''
  });
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [editingFee, setEditingFee] = useState({
    monthlyFee: 0,
    admissionFee: 0
  });
  const [usingSupabase, setUsingSupabase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if Supabase is connected on component mount
  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const checkSupabaseConnection = async () => {
    const connected = await isSupabaseConnected();
    setUsingSupabase(connected);
    console.log("Using Supabase:", connected);
  };

  const handleCreateNewFee = async () => {
    if (!newFee.name || !newFee.type) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // In a real app with Supabase, this would insert into a fee_types table
      // For now, just show a success toast
      toast({
        title: "Fee Created",
        description: `${newFee.name} has been created successfully.`
      });

      setIsNewFeeDialogOpen(false);
      setNewFee({
        name: '',
        type: 'monthly',
        dueDate: ''
      });
    } catch (error) {
      console.error("Error creating fee:", error);
      toast({
        title: "Error",
        description: "Failed to create fee portal",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditFeeStructure = async () => {
    if (!editingClass || !editingFee.monthlyFee || !editingFee.admissionFee) {
      toast({
        title: "Invalid Values",
        description: "Please enter valid fee amounts",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      if (usingSupabase) {
        // Update fee structure in Supabase
        const updated = await updateFeeStructureInSupabase(
          editingClass, 
          editingFee.monthlyFee, 
          editingFee.admissionFee
        );
        
        if (!updated) {
          throw new Error("Failed to update fee structure");
        }
      }
      
      // Show success message
      toast({
        title: "Fee Structure Updated",
        description: `Fee structure for ${editingClass} has been updated.`
      });

      setIsEditFeeStructureDialogOpen(false);
      setEditingClass(null);
      setEditingFee({
        monthlyFee: 0,
        admissionFee: 0
      });
    } catch (error) {
      console.error("Error updating fee structure:", error);
      toast({
        title: "Error",
        description: "Failed to update fee structure",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Fees Management</h1>
            <p className="text-muted-foreground">Manage fee structures and payments</p>
            {usingSupabase && (
              <div className="mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Using Supabase
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog open={isNewFeeDialogOpen} onOpenChange={setIsNewFeeDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Fee Portal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Fee Portal</DialogTitle>
                  <DialogDescription>
                    Create a new fee collection portal for students
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="feeName" className="text-sm font-medium">
                      Fee Name *
                    </label>
                    <Input
                      id="feeName"
                      value={newFee.name}
                      onChange={(e) => setNewFee({...newFee, name: e.target.value})}
                      placeholder="e.g. Monthly Fee May 2025"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="feeType" className="text-sm font-medium">
                      Fee Type *
                    </label>
                    <Select 
                      value={newFee.type} 
                      onValueChange={(value) => setNewFee({...newFee, type: value})}
                    >
                      <SelectTrigger id="feeType">
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly Fee</SelectItem>
                        <SelectItem value="admission">Admission Fee</SelectItem>
                        <SelectItem value="other">Other Fee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="dueDate" className="text-sm font-medium">
                      Due Date
                    </label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newFee.dueDate}
                      onChange={(e) => setNewFee({...newFee, dueDate: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewFeeDialogOpen(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNewFee} disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Fee Portal"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isEditFeeStructureDialogOpen} onOpenChange={setIsEditFeeStructureDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Edit Fee Structure
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Fee Structure</DialogTitle>
                  <DialogDescription>
                    Update fee amounts for different classes
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="selectClass" className="text-sm font-medium">
                      Select Class *
                    </label>
                    <Select 
                      value={editingClass || ''} 
                      onValueChange={(value) => {
                        setEditingClass(value);
                        const selectedClassFee = feeStructure.find(item => item.class === value);
                        if (selectedClassFee) {
                          setEditingFee({
                            monthlyFee: selectedClassFee.monthlyFee,
                            admissionFee: selectedClassFee.admissionFee
                          });
                        }
                      }}
                    >
                      <SelectTrigger id="selectClass">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classList.map((cls) => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {editingClass && (
                    <>
                      <div className="grid gap-2">
                        <label htmlFor="monthlyFee" className="text-sm font-medium">
                          Monthly Fee (₹)
                        </label>
                        <Input
                          id="monthlyFee"
                          type="number"
                          value={editingFee.monthlyFee}
                          onChange={(e) => setEditingFee({...editingFee, monthlyFee: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="admissionFee" className="text-sm font-medium">
                          Admission Fee (₹)
                        </label>
                        <Input
                          id="admissionFee"
                          type="number"
                          value={editingFee.admissionFee}
                          onChange={(e) => setEditingFee({...editingFee, admissionFee: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditFeeStructureDialogOpen(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditFeeStructure} disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Fee Structure"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Tabs defaultValue="fee-portals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="fee-portals">Fee Portals</TabsTrigger>
            <TabsTrigger value="fee-structure">Fee Structure</TabsTrigger>
            <TabsTrigger value="payment-history">Payment History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fee-portals" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {feeTypes.map(fee => (
                <Card key={fee.id}>
                  <CardHeader>
                    <CardTitle>{fee.name}</CardTitle>
                    <CardDescription>
                      {fee.type === 'monthly' ? 'Monthly Fee' : 
                       fee.type === 'admission' ? 'Admission Fee' : 'Other Fee'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Total Students</span>
                      <span className="font-medium">65</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Payments Received</span>
                      <span className="font-medium text-green-600">42</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pending</span>
                      <span className="font-medium text-orange-600">23</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="fee-structure">
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure</CardTitle>
                <CardDescription>
                  Current fee structure for different classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead className="text-right">Monthly Fee (₹)</TableHead>
                      <TableHead className="text-right">Admission Fee (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeStructure.map((item) => (
                      <TableRow key={item.class}>
                        <TableCell className="font-medium">{item.class}</TableCell>
                        <TableCell className="text-right">₹{item.monthlyFee.toLocaleString()}</TableCell>
                        <TableCell className="text-right">₹{item.admissionFee.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment-history">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payment History</CardTitle>
                <CardDescription>
                  Record of recent fee payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.studentName}</TableCell>
                        <TableCell>{record.class}</TableCell>
                        <TableCell>{record.feeType}</TableCell>
                        <TableCell>
                          <div className="w-24">
                            <FeeStatus 
                              status={record.status as 'paid' | 'partial' | 'unpaid'}
                              paidAmount={record.paidAmount}
                              totalAmount={record.amount}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">₹{record.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          {record.date ? new Date(record.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Fees;
