
import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, List, Table as TableIcon } from 'lucide-react';
import { classList } from '@/services/students';

type StudentsSearchProps = {
  searchTerm: string;
  selectedClass: string;
  viewMode: 'card' | 'table';
  onSearchChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onViewModeChange: (mode: 'card' | 'table') => void;
};

const StudentsSearch: React.FC<StudentsSearchProps> = ({
  searchTerm,
  selectedClass,
  viewMode,
  onSearchChange,
  onClassChange,
  onViewModeChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, guardian or roll number..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={selectedClass} onValueChange={onClassChange}>
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
            onClick={() => onViewModeChange('card')}
          >
            <List className="h-4 w-4 mr-1" />
            Cards
          </Button>
          <Button 
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-l-none"
            onClick={() => onViewModeChange('table')}
          >
            <TableIcon className="h-4 w-4 mr-1" />
            Table
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentsSearch;
