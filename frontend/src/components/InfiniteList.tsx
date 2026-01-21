import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ItemCard } from './ItemCard';
import { type ItemStatus, useInfiniteItems, useBulkSoftDelete, useBulkPermanentDelete } from '@/hooks/useItems';
import { Loader2, Inbox, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface InfiniteListProps {
  statusFilter: ItemStatus | 'All';
  showArchive: boolean;
}

export const InfiniteList: React.FC<InfiniteListProps> = ({ statusFilter, showArchive }) => {
  const { ref, inView } = useInView();
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  
  const bulkSoftDelete = useBulkSoftDelete();
  const bulkPermanentDelete = useBulkPermanentDelete();
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteItems(statusFilter === 'All' ? undefined : statusFilter, showArchive);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
        <p className="mt-4 text-muted-foreground font-medium">Loading your tasks...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-destructive text-center p-4 bg-destructive/5 rounded-2xl border border-destructive/10">
        <p className="font-bold text-lg">Error loading tasks</p>
        <p className="text-sm opacity-80 max-w-xs mt-2">There was a problem connecting to the server. Please check if the backend is running.</p>
      </div>
    );
  }

  const items = data?.pages.flatMap((page) => page) || [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-12 w-12 bg-primary/5 rounded-full flex items-center justify-center mb-4">
           <Inbox className="h-6 w-6 text-primary/40" />
        </div>
        <h3 className="text-lg font-medium opacity-90">All clear!</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          {showArchive 
            ? "Your archive is empty." 
            : "No active tasks found."}
        </p>
      </div>
    );
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(items.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: number, selected: boolean) => {
    if (selected) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    
    if (showArchive) {
      bulkPermanentDelete.mutate(selectedIds, {
        onSuccess: () => setSelectedIds([]),
      });
    } else {
      bulkSoftDelete.mutate(selectedIds, {
        onSuccess: () => setSelectedIds([]),
      });
    }
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      {/* Table Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-muted/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <div className="flex items-center gap-4 flex-1">
          <Checkbox 
            checked={items.length > 0 && selectedIds.length === items.length}
            onCheckedChange={(checked) => handleSelectAll(!!checked)}
            aria-label="Select all"
          />
          <span className="ml-4">Details</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24 text-center">Status</div>
          <div className="w-24 text-right pr-2 flex justify-end items-center gap-2">
            {selectedIds.length > 0 ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="text-[10px]">Delete ({selectedIds.length})</span>
              </Button>
            ) : (
              <span>Actions</span>
            )}
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
      {items.map((item) => (
        <ItemCard 
          key={item.id} 
          item={item} 
          isSelected={selectedIds.includes(item.id)}
          onSelect={handleSelectItem}
        />
      ))}
      
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-8">
          {isFetchingNextPage ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary/50" />
          ) : (
            <div className="h-1 w-1" />
          )}
        </div>
      )}
    </div>
  </div>
);
};
