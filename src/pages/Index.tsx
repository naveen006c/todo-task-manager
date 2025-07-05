
import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { TaskCard, Task } from '../components/TaskCard';
import { TaskFilters, FilterState } from '../components/TaskFilters';
import { TaskForm } from '../components/TaskForm';
import { AuthForm } from '../components/AuthForm';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create a modern, responsive landing page with hero section and feature cards',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-01-10',
    assignedTo: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    sharedWith: [
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Bob Wilson', email: 'bob@example.com' }
    ],
    createdAt: '2025-01-01'
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up OAuth with Google and GitHub integration',
    status: 'completed',
    priority: 'high',
    dueDate: '2025-01-05',
    createdAt: '2024-12-28'
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST endpoints with examples',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-01-15',
    createdAt: '2025-01-02'
  },
  {
    id: '4',
    title: 'Fix mobile responsive issues',
    description: 'Address layout problems on tablets and mobile devices',
    status: 'todo',
    priority: 'low',
    dueDate: '2024-12-30', // Overdue
    createdAt: '2024-12-25'
  }
];

const Index = () => {
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(mockTasks);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    priority: 'all',
    dueDate: 'all'
  });
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter tasks based on current filters
  useEffect(() => {
    let filtered = tasks;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Due date filter
    if (filters.dueDate !== 'all') {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);

        switch (filters.dueDate) {
          case 'today':
            return dueDate.toDateString() === new Date().toDateString();
          case 'overdue':
            return dueDate < new Date() && task.status !== 'completed';
          case 'this-week':
            return dueDate >= startOfWeek && dueDate <= endOfWeek;
          default:
            return true;
        }
      });
    }

    setFilteredTasks(filtered);
  }, [tasks, filters]);

  const handleSignIn = (provider: 'google' | 'github' | 'email', data?: { email: string; password: string }) => {
    // Mock authentication - in real app, this would integrate with Supabase
    console.log('Signing in with:', provider, data);
    
    // Simulate successful login
    setUser({
      name: 'Demo User',
      email: data?.email || 'demo@example.com',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data?.email || 'demo'}`
    });
    
    toast.success(`Welcome! Signed in with ${provider}`);
  };

  const handleSignOut = () => {
    setUser(null);
    toast.info('Signed out successfully');
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    toast.success('Task created successfully!');
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return;

    const updatedTask: Task = {
      ...taskData,
      id: editingTask.id,
      createdAt: editingTask.createdAt
    };

    setTasks(prev => prev.map(task => task.id === editingTask.id ? updatedTask : task));
    setEditingTask(null);
    toast.success('Task updated successfully!');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully!');
  };

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
    toast.success(`Task marked as ${status.replace('-', ' ')}!`);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  // Calculate task counts for filters
  const taskCounts = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length
  };

  if (!user) {
    return <AuthForm onSignIn={handleSignIn} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onSignOut={handleSignOut} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600 mt-1">Manage your tasks and collaborate with your team</p>
          </div>
          
          <Button
            onClick={() => setIsTaskFormOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          taskCounts={taskCounts}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {filters.search || filters.status !== 'all' || filters.priority !== 'all' || filters.dueDate !== 'all'
                ? 'Try adjusting your filters or search criteria'
                : 'Get started by creating your first task'
              }
            </p>
            <Button
              onClick={() => setIsTaskFormOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>
        )}
      </main>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={closeTaskForm}
        onSubmit={editingTask ? handleEditTask : handleCreateTask}
        editingTask={editingTask}
      />
    </div>
  );
};

export default Index;
