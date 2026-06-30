import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'sonner';
import { Board } from '@/types';

const boardIcons = [
  { id: 'grid', label: 'Grid' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'mic', label: 'Mic' },
  { id: 'lightbulb', label: 'Lightbulb' },
  { id: 'music', label: 'Music' },
  { id: 'pen', label: 'Pen' },
];

interface CreateBoardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

export function CreateBoardModal({ open, onOpenChange, projectId }: CreateBoardModalProps) {
  const { addBoard, selectBoard, selectedProjectId } = useAppStore();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('grid');

  const targetProjectId = projectId ?? selectedProjectId;

  const handleCreate = () => {
    if (!name.trim() || !targetProjectId) return;

    const newBoard: Board = {
      id: crypto.randomUUID(),
      projectId: targetProjectId,
      name: name.trim(),
      icon: selectedIcon,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addBoard(newBoard);
    selectBoard(newBoard.id);
    setName('');
    setSelectedIcon('grid');
    onOpenChange(false);
    toast.success('Board created');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="board-name">Board Name</Label>
            <Input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter board name..."
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {boardIcons.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => setSelectedIcon(icon.id)}
                  className={`p-2 rounded-md border transition-colors ${
                    selectedIcon === icon.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-ring'
                  }`}
                  title={icon.label}
                >
                  <span className="text-sm">{icon.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!name.trim()}>
              Create Board
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
