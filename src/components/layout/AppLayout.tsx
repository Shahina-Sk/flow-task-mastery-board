
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useTaskStore } from '@/store/taskStore';
import { KanbanSquare, List, Calendar } from 'lucide-react';

const AppLayout = () => {
  const { initializeStore, checkNotifications } = useTaskStore();
  
  useEffect(() => {
    initializeStore();
    
    // Check for notifications on load
    checkNotifications();
    
    // Set up interval to check for notifications periodically
    const notificationInterval = setInterval(() => {
      checkNotifications();
    }, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(notificationInterval);
  }, [initializeStore, checkNotifications]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
