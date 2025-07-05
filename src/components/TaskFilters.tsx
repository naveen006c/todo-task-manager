
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export interface FilterState {
  search: string;
  status: 'all' | 'todo' | 'in-progress' | 'completed';
  priority: 'all' | 'low' | 'medium' | 'high';
  dueDate: 'all' | 'today' | 'overdue' | 'this-week';
}

interface TaskFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  taskCounts: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
}

export const TaskFilters = ({ filters, onFiltersChange, taskCounts }: TaskFiltersProps) => {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.dueDate} onValueChange={(value) => updateFilter('dueDate', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Due Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Due Today</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <Badge variant="outline" className="bg-gray-50">
          Total: {taskCounts.total}
        </Badge>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          To Do: {taskCounts.todo}
        </Badge>
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
          In Progress: {taskCounts.inProgress}
        </Badge>
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Completed: {taskCounts.completed}
        </Badge>
        {taskCounts.overdue > 0 && (
          <Badge variant="destructive" className="animate-pulse">
            Overdue: {taskCounts.overdue}
          </Badge>
        )}
      </div>
    </div>
  );
};
