import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTaskStore } from '@/store/taskStore';
import { Calendar as CalendarIcon, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Priority, Status, Tag, Task } from '@/types';

const taskFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  dueDate: z.date().nullable().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  status: z.enum(['todo', 'in-progress', 'completed']),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormInitialData extends TaskFormValues {
  tags?: Tag[];
}

interface TaskFormProps {
  initialData?: TaskFormInitialData;
  taskId?: string;
  onComplete?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  initialData,
  taskId,
  onComplete
}) => {
  const { addTask, updateTask, tags } = useTaskStore();
  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialData?.tags || []);

  const defaultValues: Partial<TaskFormValues> = {
    title: '',
    description: '',
    dueDate: null,
    priority: 'medium',
    status: 'todo',
    ...initialData
  };

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  const onSubmit = (data: TaskFormValues) => {
    if (taskId) {
      updateTask(taskId, {
        ...data,
        dueDate: data.dueDate ? data.dueDate.toISOString() : null,
        tags: selectedTags,
      });
    } else {
      addTask({
        ...data,
        dueDate: data.dueDate ? data.dueDate.toISOString() : null,
        tags: selectedTags,
        title: data.title,
        description: data.description || "",
        priority: data.priority,
        status: data.status,
      });
    }
    
    onComplete?.();
  };

  const toggleTag = (tag: Tag) => {
    if (selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Task description"
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high" className="flex items-center">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2 text-priority-high" />
                        High
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-priority-medium" />
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center">
                        <Circle className="h-4 w-4 mr-2 text-priority-low" />
                        Low
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Tags</FormLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map(tag => (
              <Badge
                key={tag.id}
                variant={selectedTags.some(t => t.id === tag.id) ? "default" : "outline"}
                style={{
                  backgroundColor: selectedTags.some(t => t.id === tag.id) ? tag.color : 'transparent',
                  borderColor: tag.color,
                  color: selectedTags.some(t => t.id === tag.id) ? 'white' : tag.color
                }}
                className="cursor-pointer"
                onClick={() => toggleTag(tag)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">{taskId ? 'Update' : 'Create'} Task</Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;
