
import { Task } from '../types';

export const checkDueTasks = (tasks: Task[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dueTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    // Tasks due today or tomorrow
    return (
      dueDate.getTime() === today.getTime() || 
      dueDate.getTime() === tomorrow.getTime()
    ) && task.status !== 'completed';
  });
  
  return dueTasks;
};

export const showNotification = (title: string, body: string) => {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return;
  }
  
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } 
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, { body });
      }
    });
  }
};

export const notifyDueTasks = (tasks: Task[]) => {
  const dueTasks = checkDueTasks(tasks);
  
  if (dueTasks.length > 0) {
    const todayTasks = dueTasks.filter(task => {
      const dueDate = new Date(task.dueDate as string);
      dueDate.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return dueDate.getTime() === today.getTime();
    });
    
    const tomorrowTasks = dueTasks.filter(task => {
      const dueDate = new Date(task.dueDate as string);
      dueDate.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      return dueDate.getTime() === tomorrow.getTime();
    });
    
    if (todayTasks.length > 0) {
      showNotification(
        'Tasks Due Today', 
        `You have ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} due today!`
      );
    }
    
    if (tomorrowTasks.length > 0) {
      showNotification(
        'Tasks Due Tomorrow', 
        `You have ${tomorrowTasks.length} task${tomorrowTasks.length > 1 ? 's' : ''} due tomorrow!`
      );
    }
  }
};
