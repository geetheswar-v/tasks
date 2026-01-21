import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Item, type ItemStatus, useCreateItem, useUpdateItem } from '@/hooks/useItems';

interface CreateItemModalProps {
  item?: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateItemModal: React.FC<CreateItemModalProps> = ({ item, open, onOpenChange }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ItemStatus>('Pending');
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();

  useEffect(() => {
    if (item && open) {
      setTitle(item.title);
      setDescription(item.description || '');
      setStatus(item.status);
    } else if (!item && open) {
      setTitle('');
      setDescription('');
      setStatus('Pending');
    }
  }, [item, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      updateMutation.mutate({ id: item.id, data: { title, description, status } }, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      createMutation.mutate({ title, description, status }, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isInvalid = title.length < 5;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{item ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {item ? 'Modify the details of your task.' : 'Add a new task to your list. Title must be at least 5 characters.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-6">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Finish the OELP assignment..."
                className={`transition-colors ${title && isInvalid ? 'border-destructive/50' : ''}`}
                required
              />
              {title && isInvalid && (
                <p className="text-[10px] text-destructive font-medium">Title must be at least 5 characters.</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="modal-status" className="text-sm font-medium">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ItemStatus)}>
                <SelectTrigger id="modal-status" className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about this task..."
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isInvalid || createMutation.isPending || updateMutation.isPending}
              className="w-full sm:w-auto px-8"
            >
              {item ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
