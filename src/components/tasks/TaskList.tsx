
import React from 'react';
import { useTaskStore } from '@/store/taskStore';
import TaskCard from './TaskCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import TaskForm from './TaskForm';

const TaskList = () => {
  const { tasks } = useTaskStore();
  const [search, setSearch] = React.useState('');
  
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.description?.toLowerCase().includes(search.toLowerCase()) ||
    task.tags.some(tag => tag.name.toLowerCase().includes(search.toLowerCase()))
  );
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Sort by status (todo → in-progress → completed)
    const statusOrder: Record<string, number> = {
      'todo': 0,
      'in-progress': 1,
      'completed': 2
    };
    
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    
    // Then sort by priority (high → medium → low)
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Tasks</h2>
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
      
      <div className="space-y-3">
        {sortedTasks.length > 0 ? (
          sortedTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            {search ? 'No tasks found matching your search.' : 'No tasks yet. Create your first task!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
