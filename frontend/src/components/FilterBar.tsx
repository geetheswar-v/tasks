import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Filter, Archive } from 'lucide-react';
import type { ItemStatus } from '@/hooks/useItems';

interface FilterBarProps {
  statusFilter: ItemStatus | 'All';
  setStatusFilter: (status: ItemStatus | 'All') => void;
  showArchive: boolean;
  setShowArchive: (show: boolean) => void;
  onCreateClick: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  statusFilter,
  setStatusFilter,
  showArchive,
  setShowArchive,
}) => {
    return (
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-[150px] bg-muted h-8 text-xs b border-none shadow-none focus:ring-0">
            <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <div className="h-4 w-px bg-border" />

        <div className="flex bg-muted items-center gap-2 py-2 px-3 rounded-md">
          <Label htmlFor="archive-mode-minimal" className="text-[11px] font-medium text-muted-foreground cursor-pointer">Archive</Label>
          <Switch
            id="archive-mode-minimal"
            checked={showArchive}
            onCheckedChange={setShowArchive}
            className="scale-[0.7] data-[state=checked]:bg-primary"
          />
        </div>
      </div>
    );

  
};
