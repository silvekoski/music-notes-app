import { Settings2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import { CardAspectRatio } from '@/types';
import { useState } from 'react';

export function BoardSettingsPanel() {
  const { boardSettings, setBoardSettings } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Board Settings
          <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-80 p-4 space-y-5 border-0">
        {/* Aspect Ratio */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Aspect Ratio</Label>
          <Select
            value={boardSettings.aspectRatio}
            onValueChange={(v) => setBoardSettings({ aspectRatio: v as CardAspectRatio })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4:5">4:5</SelectItem>
              <SelectItem value="1:1">1:1</SelectItem>
              <SelectItem value="5:4">5:4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid Width */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Grid Width</Label>
            <span className="text-xs text-muted-foreground">{boardSettings.gridWidth}</span>
          </div>
          <Slider
            value={[boardSettings.gridWidth]}
            onValueChange={([v]) => setBoardSettings({ gridWidth: v })}
            min={3}
            max={9}
            step={1}
          />
        </div>

        {/* Extra Rows */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Extra Rows</Label>
            <span className="text-xs text-muted-foreground">{boardSettings.extraEmptyRows}</span>
          </div>
          <Slider
            value={[boardSettings.extraEmptyRows]}
            onValueChange={([v]) => setBoardSettings({ extraEmptyRows: v })}
            min={0}
            max={10}
            step={1}
          />
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-1 border-t border-border">
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="corner-radius" className="text-xs cursor-pointer">No Radius</Label>
            <Switch
              id="corner-radius"
              checked={boardSettings.removeCornerRadius}
              onCheckedChange={(checked) => setBoardSettings({ removeCornerRadius: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="card-spacing" className="text-xs cursor-pointer">No Spacing</Label>
            <Switch
              id="card-spacing"
              checked={boardSettings.removeCardSpacing}
              onCheckedChange={(checked) => setBoardSettings({ removeCardSpacing: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="hide-titles" className="text-xs cursor-pointer">Hide text</Label>
            <Switch
              id="hide-titles"
              checked={boardSettings.hideCardTitles}
              onCheckedChange={(checked) => setBoardSettings({ hideCardTitles: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="free-grid" className="text-xs cursor-pointer">Free Movement</Label>
            <Switch
              id="free-grid"
              checked={boardSettings.freeGridMovement}
              onCheckedChange={(checked) => setBoardSettings({ freeGridMovement: checked })}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
