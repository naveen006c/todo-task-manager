
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, User, Edit, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: {
    name: string;
    email: string;
    avatar?: string;
  };
  sharedWith?: Array<{
    name: string;
    email: string;
    avatar?: string;
  }>;
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200'
};

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800'
};

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  
  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-200 hover:-translate-y-1",
      task.status === 'completed' && "opacity-75",
      isOverdue && "border-red-300 bg-red-50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={cn(
              "font-semibold text-gray-900 mb-1",
              task.status === 'completed' && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(task)}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(task.id)}
              className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge className={statusColors[task.status]}>
            {task.status.replace('-', ' ')}
          </Badge>
          <Badge variant="outline" className={priorityColors[task.priority]}>
            {task.priority} priority
          </Badge>
          {isOverdue && (
            <Badge variant="destructive" className="animate-pulse">
              <Clock className="w-3 h-3 mr-1" />
              Overdue
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {task.dueDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
            
            {task.assignedTo && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{task.assignedTo.name}</span>
              </div>
            )}
          </div>
          
          {task.sharedWith && task.sharedWith.length > 0 && (
            <div className="flex -space-x-1">
              {task.sharedWith.slice(0, 3).map((user, index) => (
                <Avatar key={index} className="h-6 w-6 border-2 border-white">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-xs">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {task.sharedWith.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                  +{task.sharedWith.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
        
        {task.status !== 'completed' && (
          <div className="mt-3 flex space-x-2">
            {task.status === 'todo' && (
              <Button
                size="sm"
                onClick={() => onStatusChange?.(task.id, 'in-progress')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start Task
              </Button>
            )}
            {task.status === 'in-progress' && (
              <Button
                size="sm"
                onClick={() => onStatusChange?.(task.id, 'completed')}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
