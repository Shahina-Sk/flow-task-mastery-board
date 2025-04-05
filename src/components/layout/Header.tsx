
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, List, KanbanSquare, Calendar } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TaskForm from '@/components/tasks/TaskForm';

const Header = () => {
  const { currentView, setCurrentView } = useTaskStore();

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold text-primary">Flow Task Mastery</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="hidden sm:flex items-center rounded-md overflow-hidden border">
          <Button
            variant={currentView === 'board' ? 'default' : 'ghost'}
            className="rounded-none"
            onClick={() => setCurrentView('board')}
          >
            <KanbanSquare className="h-4 w-4 mr-2" />
            Board
          </Button>
          <Button
            variant={currentView === 'list' ? 'default' : 'ghost'}
            className="rounded-none"
            onClick={() => setCurrentView('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={currentView === 'calendar' ? 'default' : 'ghost'}
            className="rounded-none"
            onClick={() => setCurrentView('calendar')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
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
        
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
