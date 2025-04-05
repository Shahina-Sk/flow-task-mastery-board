
export type Priority = 'high' | 'medium' | 'low';

export type Status = 'todo' | 'in-progress' | 'completed';

export type Tag = {
  id: string;
  name: string;
  color: string;
};

export type Comment = {
  id: string;
  taskId: string;
  content: string;
  author: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: Priority;
  status: Status;
  tags: Tag[];
  createdAt: string;
  comments: Comment[];
};

export type View = 'board' | 'list' | 'calendar';

export type AppTheme = 'light' | 'dark';
