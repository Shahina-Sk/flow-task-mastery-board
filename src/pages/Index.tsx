
import React, { useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import TaskList from '@/components/tasks/TaskList';
import CalendarView from '@/components/tasks/CalendarView';

const Index = () => {
  const { currentView } = useTaskStore();

  return (
    <div className="container mx-auto">
      {currentView === 'board' && <KanbanBoard />}
      {currentView === 'list' && <TaskList />}
      {currentView === 'calendar' && <CalendarView />}
    </div>
  );
};

export default Index;
