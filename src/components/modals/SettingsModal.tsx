import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import { CardAspectRatio } from '@/types';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colorPalette = [
  '#8B7355',
  '#6B8E9F',
  '#7B9B8B',
  '#9B8B7B',
  '#9B7B8B',
  '#8B7B9B',
];

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { boardSettings, setBoardSettings, cards, selectedBoardId } = useAppStore();
  const [activeTab, setActiveTab] = useState('general');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');

  const boardCards = cards.filter((c) => c.boardId === selectedBoardId);
  const totalAudioDuration = boardCards
    .filter((c) => c.attachmentMeta?.duration)
    .reduce((acc, c) => {
      const [min, sec] = (c.attachmentMeta?.duration || '0:00').split(':').map(Number);
      return acc + min * 60 + sec;
    }, 0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="public">Public Access</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            {/* General Tab */}
            <TabsContent value="general" className="space-y-6 m-0">
              <div>
                <h3 className="text-sm font-medium mb-3">Customize how cards are displayed in this project</h3>
                
                {/* Color Palette */}
                <div className="space-y-2 mb-6">
                  <Label>Color Palette</Label>
                  <div className="flex gap-2">
                    {colorPalette.map((color) => (
                      <button
                        key={color}
                        className={cn(
                          'w-8 h-8 rounded-full border-2 transition-all',
                          boardSettings.colorPalette === color
                            ? 'border-foreground scale-110'
                            : 'border-transparent hover:scale-105'
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => setBoardSettings({ colorPalette: color })}
                      />
                    ))}
                  </div>
                </div>

                {/* Appearance Toggles */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="corner-radius">Remove Card Corner Radius</Label>
                    <Switch
                      id="corner-radius"
                      checked={boardSettings.removeCornerRadius}
                      onCheckedChange={(checked) => setBoardSettings({ removeCornerRadius: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="card-spacing">Remove Card Spacing</Label>
                    <Switch
                      id="card-spacing"
                      checked={boardSettings.removeCardSpacing}
                      onCheckedChange={(checked) => setBoardSettings({ removeCardSpacing: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide-titles">Hide Card Titles</Label>
                    <Switch
                      id="hide-titles"
                      checked={boardSettings.hideCardTitles}
                      onCheckedChange={(checked) => setBoardSettings({ hideCardTitles: checked })}
                    />
                  </div>
                </div>

                {/* Layout Controls */}
                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <Label>Card Aspect Ratio</Label>
                    <Select
                      value={boardSettings.aspectRatio}
                      onValueChange={(v) => setBoardSettings({ aspectRatio: v as CardAspectRatio })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4:5">4:5 (Default)</SelectItem>
                        <SelectItem value="1:1">1:1 (Square)</SelectItem>
                        <SelectItem value="5:4">5:4 (Landscape)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Grid Width</Label>
                      <span className="text-sm text-muted-foreground">{boardSettings.gridWidth}</span>
                    </div>
                    <Slider
                      value={[boardSettings.gridWidth]}
                      onValueChange={([v]) => setBoardSettings({ gridWidth: v })}
                      min={3}
                      max={9}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Extra Empty Rows</Label>
                      <span className="text-sm text-muted-foreground">{boardSettings.extraEmptyRows}</span>
                    </div>
                    <Slider
                      value={[boardSettings.extraEmptyRows]}
                      onValueChange={([v]) => setBoardSettings({ extraEmptyRows: v })}
                      min={0}
                      max={10}
                      step={1}
                    />
                  </div>
                </div>

                {/* Behavior Controls */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-sort">Disable Auto Sort</Label>
                      <p className="text-xs text-muted-foreground">Manual reorder with Shift + drag</p>
                    </div>
                    <Switch
                      id="auto-sort"
                      checked={boardSettings.disableAutoSort}
                      onCheckedChange={(checked) => setBoardSettings({ disableAutoSort: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="free-grid">Free Grid Movement</Label>
                      <p className="text-xs text-muted-foreground">Place cards with gaps anywhere</p>
                    </div>
                    <Switch
                      id="free-grid"
                      checked={boardSettings.freeGridMovement}
                      onCheckedChange={(checked) => setBoardSettings({ freeGridMovement: checked })}
                    />
                  </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Changing layout settings may affect existing card positions.
                  </p>
                </div>

                {/* Project Statistics */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="text-sm font-medium mb-3">Project Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-2xl font-semibold">{boardCards.length}</p>
                      <p className="text-xs text-muted-foreground">Total Cards</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-2xl font-semibold">{formatDuration(totalAudioDuration)}</p>
                      <p className="text-xs text-muted-foreground">Total Audio Duration</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6 m-0">
              <div>
                <h3 className="text-sm font-medium mb-3">Invite Collaborator</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Invite</Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Project Members (1)</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
                        Y
                      </div>
                      <div>
                        <p className="text-sm font-medium">You</p>
                        <p className="text-xs text-muted-foreground">you@example.com</p>
                      </div>
                    </div>
                    <Badge>Owner</Badge>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Public Access Tab */}
            <TabsContent value="public" className="space-y-6 m-0">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Share this project with anyone via a public link.
                </p>

                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="public-link">Enable Public Link</Label>
                  <Switch id="public-link" />
                </div>

                <div className="space-y-2">
                  <Label>Access Level</Label>
                  <Select defaultValue="view">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View only</SelectItem>
                      <SelectItem value="comment">Can comment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 space-y-2">
                  <Label>Public Link</Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value="https://musicnotes.app/p/abc123"
                      className="bg-muted"
                    />
                    <Button variant="outline">Copy</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6 m-0">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Activity History</h3>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activity</SelectItem>
                      <SelectItem value="cards">Cards</SelectItem>
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="settings">Settings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-center py-12 text-muted-foreground">
                  <p>No activity found</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
