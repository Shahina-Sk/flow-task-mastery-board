
import React from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types';
import { format } from 'date-fns';
import { Pencil, Trash2, MessageCircle, CalendarIcon, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import TaskForm from './TaskForm';
import CommentSection from '../comments/CommentSection';

interface TaskCardProps {
  task: Task;
  isCompact?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isCompact = false }) => {
  const { deleteTask } = useTaskStore();
  
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-priority-high" />;
      case 'medium':
        return <CheckCircle2 className="h-4 w-4 text-priority-medium" />;
      case 'low':
        return <Circle className="h-4 w-4 text-priority-low" />;
      default:
        return null;
    }
  };

  // Convert task to the form expected by TaskForm
  const getFormInitialData = (task: Task) => {
    return {
      title: task.title,
      description: task.description,
      // Convert ISO string to Date object if it exists
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      priority: task.priority,
      status: task.status,
      tags: task.tags
    };
  };

  return (
    <div className={cn(
      "task-card bg-card animate-fade-in",
      `priority-${task.priority}`,
      isCompact ? "p-3" : "p-4"
    )}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={cn("font-medium flex-1", isCompact ? "text-sm" : "text-base")}>{task.title}</h3>
        
        <div className="flex items-center space-x-1">
          {!isCompact && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <TaskForm
                  initialData={getFormInitialData(task)}
                  taskId={task.id}
                />
              </DialogContent>
            </Dialog>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the task. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteTask(task.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {!isCompact && task.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex flex-wrap gap-2 mb-3">
        {task.tags.map(tag => (
          <Badge 
            key={tag.id}
            style={{ backgroundColor: tag.color }}
            className="text-xs px-2 py-0.5"
          >
            {tag.name}
          </Badge>
        ))}
      </div>
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center space-x-3">
          {task.dueDate && (
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-3 w-3" />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            {getPriorityIcon(task.priority)}
            <span className="capitalize">{task.priority}</span>
          </div>
        </div>
        
        {!isCompact && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6">
                <MessageCircle className="h-3 w-3 mr-1" />
                <span>{task.comments.length}</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{task.title}</DialogTitle>
              </DialogHeader>
              <CommentSection taskId={task.id} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
