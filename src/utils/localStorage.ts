
const TASKS_STORAGE_KEY = 'flow-task-mastery:tasks';
const TAGS_STORAGE_KEY = 'flow-task-mastery:tags';
const THEME_STORAGE_KEY = 'flow-task-mastery:theme';

export const getStoredTasks = () => {
  const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
  return storedTasks ? JSON.parse(storedTasks) : [];
};

export const setStoredTasks = (tasks: any[]) => {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

export const getStoredTags = () => {
  const storedTags = localStorage.getItem(TAGS_STORAGE_KEY);
  return storedTags ? JSON.parse(storedTags) : [];
};

export const setStoredTags = (tags: any[]) => {
  localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
};

export const getStoredTheme = () => {
  return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
};

export const setStoredTheme = (theme: string) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};
