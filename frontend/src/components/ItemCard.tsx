import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, RotateCcw, Trash } from 'lucide-react';
import { type Item, type ItemStatus, useSoftDeleteItem, useRestoreItem, usePermanentDeleteItem } from '@/hooks/useItems';
import { CreateItemModal } from './CreateItemModal';
import { Checkbox } from '@/components/ui/checkbox';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ItemCardProps {
  item: Item;
  isSelected?: boolean;
  onSelect?: (id: number, selected: boolean) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, isSelected, onSelect }) => {
  const softDeleteMutation = useSoftDeleteItem();
  const restoreMutation = useRestoreItem();
  const permanentDeleteMutation = usePermanentDeleteItem();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getStatusColor = (status: ItemStatus) => {
    switch (status) {
      case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'In Progress': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-muted-foreground bg-muted border-muted-foreground/10';
    }
  };

  const getStatusDotColor = (status: ItemStatus) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      default: return 'bg-muted-foreground';
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (item.is_deleted) {
      permanentDeleteMutation.mutate(item.id);
    } else {
      softDeleteMutation.mutate(item.id);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div 
        onClick={() => setIsEditModalOpen(true)}
        className={`group flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors cursor-pointer ${item.is_deleted ? 'opacity-50' : ''}`}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={(checked) => onSelect?.(item.id, !!checked)}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0"
          />
          
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {item.title}
              </span>
              {/* Mobile Status Dot */}
              <div className={`sm:hidden w-1.5 h-1.5 rounded-full ${getStatusDotColor(item.status)}`} />
            </div>
            {item.description && (
              <span className="text-xs text-muted-foreground truncate max-w-md">
                {item.description}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Delete */}
          <div className="sm:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="hidden sm:flex w-24 justify-center">
            <Badge variant="outline" className={`rounded-full text-[10px] px-2 py-0 h-5 font-normal ${getStatusColor(item.status)}`}>
              {item.status}
            </Badge>
          </div>

          <div className="hidden sm:flex w-24 justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
            {!item.is_deleted ? (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-green-500" 
                  onClick={(e) => {
                    e.stopPropagation();
                    restoreMutation.mutate(item.id);
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive" 
                  onClick={handleDelete}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <CreateItemModal 
        item={item} 
        open={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen} 
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              <span>Are you absolutely sure?</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              {item.is_deleted 
                ? "This will permanently delete the task. This action cannot be undone."
                : "This will move the task to the archive. You can restore it later if needed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.stopPropagation();
                confirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {item.is_deleted ? 'Permanently Delete' : 'Archive Task'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
