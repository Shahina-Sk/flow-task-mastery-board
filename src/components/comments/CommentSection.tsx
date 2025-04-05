
import React, { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { format } from 'date-fns';
import { Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface CommentSectionProps {
  taskId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ taskId }) => {
  const { tasks, addComment, deleteComment } = useTaskStore();
  const [comment, setComment] = useState('');
  const [username, setUsername] = useState('User');
  
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return <div>Task not found</div>;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (comment.trim()) {
      addComment(taskId, comment, username);
      setComment('');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-sm py-2 px-3 bg-secondary rounded-md">
        <p className="font-medium">{task.title}</p>
        {task.description && <p className="text-muted-foreground mt-1">{task.description}</p>}
      </div>
      
      <div className="pb-2 border-b">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            placeholder="Add a comment..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="min-h-[60px]"
          />
          <Button type="submit" className="self-end" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
      
      <div className="space-y-4">
        {task.comments.length > 0 ? (
          [...task.comments]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map(comment => (
              <div key={comment.id} className="flex gap-3 animate-fade-in">
                <Avatar>
                  <AvatarFallback>
                    {comment.author.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteComment(taskId, comment.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <p className="mt-1 text-sm">{comment.content}</p>
                </div>
              </div>
            ))
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
