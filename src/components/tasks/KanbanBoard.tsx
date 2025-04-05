
import React from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Status, Task } from '@/types';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TaskForm from './TaskForm';
import { Input } from '@/components/ui/input';

const KanbanBoard = () => {
  const { tasks, updateTask } = useTaskStore();
  const [search, setSearch] = React.useState('');
  
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.description?.toLowerCase().includes(search.toLowerCase()) ||
    task.tags.some(tag => tag.name.toLowerCase().includes(search.toLowerCase()))
  );
  
  const columns: { id: Status; name: string }[] = [
    { id: 'todo', name: 'To Do' },
    { id: 'in-progress', name: 'In Progress' },
    { id: 'completed', name: 'Completed' }
  ];
  
  const getColumnTasks = (columnId: Status) => {
    return filteredTasks
      .filter(task => task.status === columnId)
      .sort((a, b) => {
        // Sort by priority (high → medium → low)
        const priorityOrder: Record<string, number> = {
          'high': 0,
          'medium': 1,
          'low': 2
        };
        
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        
        // Then sort by due date (if available)
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        
        // Tasks with due dates come before tasks without due dates
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
        
        // Finally, sort by creation date
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  };
  
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('taskId', task.id);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    updateTask(taskId, { status });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Board</h2>
        <div className="flex space-x-2">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create a new task</DialogTitle>
              </DialogHeader>
              <TaskForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <div
            key={column.id}
            className="bg-secondary/50 rounded-lg p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-medium">{column.name}</h3>
              <span className="text-sm text-muted-foreground">
                {getColumnTasks(column.id).length}
              </span>
            </div>
            
            <div className="space-y-3 min-h-[200px]">
              {getColumnTasks(column.id).map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                >
                  <TaskCard task={task} />
                </div>
              ))}
              
              {getColumnTasks(column.id).length === 0 && (
                <div className="h-16 border-2 border-dashed border-border rounded-md flex items-center justify-center text-sm text-muted-foreground">
                  {search ? 'No matching tasks' : 'No tasks yet'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
