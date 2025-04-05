
import { create } from 'zustand';
import { Task, Tag, Priority, Status, AppTheme, View } from '../types';
import { getStoredTasks, setStoredTasks, getStoredTags, setStoredTags, getStoredTheme, setStoredTheme } from '../utils/localStorage';
import { notifyDueTasks } from '../utils/notification';

type TaskState = {
  tasks: Task[];
  tags: Tag[];
  theme: AppTheme;
  currentView: View;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'comments'>) => void;
  updateTask: (id: string, taskUpdate: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (id: string, tagUpdate: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  
  addComment: (taskId: string, content: string, author: string) => void;
  deleteComment: (taskId: string, commentId: string) => void;
  
  setTheme: (theme: AppTheme) => void;
  setCurrentView: (view: View) => void;
  
  initializeStore: () => void;
  checkNotifications: () => void;
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  tags: [],
  theme: 'light',
  currentView: 'board',

  addTask: (task) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...task,
      createdAt: new Date().toISOString(),
      comments: []
    };
    
    set(state => {
      const updatedTasks = [...state.tasks, newTask];
      setStoredTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
  
  updateTask: (id, taskUpdate) => {
    set(state => {
      const updatedTasks = state.tasks.map(task => 
        task.id === id ? { ...task, ...taskUpdate } : task
      );
      setStoredTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
  
  deleteTask: (id) => {
    set(state => {
      const updatedTasks = state.tasks.filter(task => task.id !== id);
      setStoredTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
  
  addTag: (tag) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      ...tag
    };
    
    set(state => {
      const updatedTags = [...state.tags, newTag];
      setStoredTags(updatedTags);
      return { tags: updatedTags };
    });
  },
  
  updateTag: (id, tagUpdate) => {
    set(state => {
      const updatedTags = state.tags.map(tag => 
        tag.id === id ? { ...tag, ...tagUpdate } : tag
      );
      setStoredTags(updatedTags);
      
      // Update all tasks using this tag
      const updatedTasks = state.tasks.map(task => {
        const updatedTaskTags = task.tags.map(taskTag => 
          taskTag.id === id ? { ...taskTag, ...tagUpdate } : taskTag
        );
        return { ...task, tags: updatedTaskTags };
      });
      setStoredTasks(updatedTasks);
      
      return { tags: updatedTags, tasks: updatedTasks };
    });
  },
  
  deleteTag: (id) => {
    set(state => {
      const updatedTags = state.tags.filter(tag => tag.id !== id);
      setStoredTags(updatedTags);
      
      // Remove this tag from all tasks
      const updatedTasks = state.tasks.map(task => ({
        ...task,
        tags: task.tags.filter(tag => tag.id !== id)
      }));
      setStoredTasks(updatedTasks);
      
      return { tags: updatedTags, tasks: updatedTasks };
    });
  },
  
  addComment: (taskId, content, author) => {
    set(state => {
      const updatedTasks = state.tasks.map(task => {
        if (task.id === taskId) {
          const newComment = {
            id: Date.now().toString(),
            taskId,
            content,
            author,
            createdAt: new Date().toISOString()
          };
          return {
            ...task,
            comments: [...task.comments, newComment]
          };
        }
        return task;
      });
      
      setStoredTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
  
  deleteComment: (taskId, commentId) => {
    set(state => {
      const updatedTasks = state.tasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            comments: task.comments.filter(comment => comment.id !== commentId)
          };
        }
        return task;
      });
      
      setStoredTasks(updatedTasks);
      return { tasks: updatedTasks };
    });
  },
  
  setTheme: (theme) => {
    set({ theme });
    setStoredTheme(theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  
  setCurrentView: (view) => {
    set({ currentView: view });
  },
  
  initializeStore: () => {
    const tasks = getStoredTasks();
    const tags = getStoredTags();
    const theme = getStoredTheme() as AppTheme;
    
    set({ tasks, tags, theme });
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // If no default tags exist, create some
    if (tags.length === 0) {
      const defaultTags: Tag[] = [
        { id: '1', name: 'Work', color: '#8b5cf6' },
        { id: '2', name: 'Personal', color: '#ec4899' },
        { id: '3', name: 'Urgent', color: '#ef4444' },
        { id: '4', name: 'Ideas', color: '#14b8a6' }
      ];
      
      set({ tags: defaultTags });
      setStoredTags(defaultTags);
    }
  },
  
  checkNotifications: () => {
    const { tasks } = get();
    notifyDueTasks(tasks);
  }
}));
