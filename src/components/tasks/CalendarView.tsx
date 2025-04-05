
import React, { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, subMonths, addMonths } from 'date-fns';
import { Task } from '@/types';
import TaskCard from './TaskCard';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import TaskForm from './TaskForm';

const CalendarView = () => {
  const { tasks } = useTaskStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDay(null);
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDay(null);
  };
  
  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return isSameDay(dueDate, day);
    });
  };
  
  // Calculate the first day of the month's position in the week (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = startOfMonth(currentMonth).getDay();
  // Create empty slots for days before the first day of the month
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
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
              <TaskForm initialData={{ dueDate: selectedDay }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center font-medium">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map(day => (
          <div 
            key={`empty-${day}`} 
            className="min-h-[100px] border border-border/50 rounded-md p-1"
          />
        ))}
        
        {daysInMonth.map(day => {
          const tasksForDay = getTasksForDay(day);
          const isSelected = selectedDay && isSameDay(day, selectedDay);
          
          return (
            <div
              key={day.toISOString()}
              className={`min-h-[100px] border border-border/50 rounded-md p-1 cursor-pointer relative ${
                isToday(day) ? 'bg-primary/5' : ''
              } ${isSelected ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-medium ${isToday(day) ? 'text-primary' : ''}`}>
                  {format(day, 'd')}
                </span>
                {tasksForDay.length > 0 && (
                  <span className="text-xs bg-primary text-white rounded-full px-1.5">
                    {tasksForDay.length}
                  </span>
                )}
              </div>
              
              <div className="space-y-1 overflow-auto max-h-[80px]">
                {tasksForDay.slice(0, 2).map(task => (
                  <TaskCard key={task.id} task={task} isCompact />
                ))}
                {tasksForDay.length > 2 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{tasksForDay.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedDay && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">
            Tasks for {format(selectedDay, 'MMMM d, yyyy')}
          </h3>
          <div className="space-y-3">
            {getTasksForDay(selectedDay).length > 0 ? (
              getTasksForDay(selectedDay).map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No tasks for this day. Add one!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
