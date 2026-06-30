import { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';

interface TagsPopoverProps {
  children: ReactNode;
}

export function TagsPopover({ children }: TagsPopoverProps) {
  const { tags, selectedTags, toggleTag } = useAppStore();

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Filter by tags</h4>
          
          {tags.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tags created yet</p>
          ) : (
            <div className="space-y-2">
              {tags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded-md p-1 -m-1"
                >
                  <Checkbox
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => toggleTag(tag.id)}
                  />
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                  >
                    {tag.name}
                  </Badge>
                </label>
              ))}
            </div>
          )}

          {selectedTags.length > 0 && (
            <button
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => selectedTags.forEach(toggleTag)}
            >
              Clear all filters
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
