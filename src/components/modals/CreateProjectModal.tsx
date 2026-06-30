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
import { Project } from '@/types';

const projectIcons = [
  { id: 'music', label: 'Music' },
  { id: 'pen', label: 'Pen' },
  { id: 'folder', label: 'Folder' },
  { id: 'lightbulb', label: 'Lightbulb' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'mic', label: 'Mic' },
];

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
  const { addProject, selectProject } = useAppStore();
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('folder');

  const handleCreate = () => {
    if (!name.trim()) return;

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: name.trim(),
      icon: selectedIcon,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addProject(newProject);
    selectProject(newProject.id);
    setName('');
    setSelectedIcon('folder');
    onOpenChange(false);
    toast.success('Project created');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {projectIcons.map((icon) => (
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
              Create Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
