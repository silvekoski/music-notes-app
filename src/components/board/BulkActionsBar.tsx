import { X, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/stores/appStore';

interface BulkActionsBarProps {
  selectionCount: number;
  onClear: () => void;
  onDelete: () => void;
  onAddTag: (tagName: string) => void;
  onRemoveTag: (tagName: string) => void;
}

export function BulkActionsBar({
  selectionCount,
  onClear,
  onDelete,
  onAddTag,
  onRemoveTag,
}: BulkActionsBarProps) {
  const { tags } = useAppStore();

  if (selectionCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-lg shadow-lg px-4 py-3 flex items-center gap-4">
      <span className="text-sm font-medium">
        {selectionCount} card{selectionCount !== 1 ? 's' : ''} selected
      </span>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Tag className="h-4 w-4 mr-2" />
              Tags
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Add Tag</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {tags.map((tag) => (
                  <DropdownMenuItem
                    key={tag.id}
                    onClick={() => onAddTag(tag.name)}
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Remove Tag</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {tags.map((tag) => (
                  <DropdownMenuItem
                    key={tag.id}
                    onClick={() => onRemoveTag(tag.name)}
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>

        <Button variant="ghost" size="icon" onClick={onClear}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
