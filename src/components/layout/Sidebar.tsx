import React from 'react';
import { Calendar, CheckSquare, Clock, Tag, User, List, KanbanIcon } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { tags, currentView, setCurrentView } = useTaskStore();

  return (
    <aside className="w-64 border-r h-[calc(100vh-64px)] p-4 hidden lg:block">
      <nav className="space-y-6">
        <div>
          <h3 className="font-medium mb-2 text-muted-foreground">VIEWS</h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setCurrentView('board')}
                className={cn(
                  "flex items-center w-full text-left px-3 py-2 rounded-md transition-colors",
                  currentView === 'board' 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-secondary"
                )}
              >
                <KanbanIcon className="h-4 w-4 mr-2" />
                Board View
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('list')}
                className={cn(
                  "flex items-center w-full text-left px-3 py-2 rounded-md transition-colors",
                  currentView === 'list' 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-secondary"
                )}
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('calendar')}
                className={cn(
                  "flex items-center w-full text-left px-3 py-2 rounded-md transition-colors",
                  currentView === 'calendar' 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-secondary"
                )}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar View
              </button>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium mb-2 text-muted-foreground">FILTERS</h3>
          <ul className="space-y-1">
            <li>
              <button className="flex items-center w-full text-left px-3 py-2 rounded-md hover:bg-secondary">
                <Clock className="h-4 w-4 mr-2" />
                Due Soon
              </button>
            </li>
            <li>
              <button className="flex items-center w-full text-left px-3 py-2 rounded-md hover:bg-secondary">
                <CheckSquare className="h-4 w-4 mr-2" />
                Completed
              </button>
            </li>
            <li>
              <button className="flex items-center w-full text-left px-3 py-2 rounded-md hover:bg-secondary">
                <User className="h-4 w-4 mr-2" />
                Assigned to Me
              </button>
            </li>
          </ul>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-muted-foreground">TAGS</h3>
          </div>
          <ul className="space-y-1">
            {tags.map(tag => (
              <li key={tag.id}>
                <button className="flex items-center w-full text-left px-3 py-2 rounded-md hover:bg-secondary">
                  <Tag className="h-4 w-4 mr-2" style={{ color: tag.color }} />
                  {tag.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
