import { useState } from 'react';
import { UserPlus, Navigation, Check, Copy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCollaborationStore } from '@/stores/collaborationStore';
import { cn } from '@/lib/utils';

const MAX_VISIBLE = 4;

export function PresenceBar() {
  const collaborators = useCollaborationStore((s) => s.collaborators);
  const onlineIds = useCollaborationStore((s) => s.onlineIds);
  const followingId = useCollaborationStore((s) => s.followingId);
  const toggleFollow = useCollaborationStore((s) => s.toggleFollow);
  const enabled = useCollaborationStore((s) => s.enabled);
  const setEnabled = useCollaborationStore((s) => s.setEnabled);

  const [copied, setCopied] = useState(false);

  const online = collaborators.filter((c) => onlineIds.includes(c.id));
  const visible = online.slice(0, MAX_VISIBLE);
  const overflow = online.length - visible.length;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Avatar stack + presence popover */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center -space-x-2 rounded-full p-0.5 transition-opacity hover:opacity-90"
            aria-label="Online collaborators"
          >
            {visible.map((c) => (
              <Avatar
                key={c.id}
                className="h-7 w-7 border-2 border-background ring-2"
                style={{ ['--tw-ring-color' as string]: c.color }}
              >
                <AvatarImage src={c.avatarUrl} alt={c.name} />
                <AvatarFallback
                  className="text-[10px] font-medium text-white"
                  style={{ backgroundColor: c.color }}
                >
                  {c.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {overflow > 0 && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
                +{overflow}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 p-0">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-medium">
              {online.length} online
            </span>
            <div className="flex items-center gap-2">
              <Label htmlFor="collab-toggle" className="text-xs text-muted-foreground cursor-pointer">
                Live
              </Label>
              <Switch id="collab-toggle" checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto px-2 pb-2">
            {online.map((c) => {
              const isFollowing = followingId === c.id;
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
                >
                  <span className="relative">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={c.avatarUrl} alt={c.name} />
                      <AvatarFallback
                        className="text-[10px] font-medium text-white"
                        style={{ backgroundColor: c.color }}
                      >
                        {c.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background"
                      style={{ backgroundColor: '#22c55e' }}
                    />
                  </span>
                  <span className="flex-1 truncate text-sm">{c.name}</span>
                  <Button
                    variant={isFollowing ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-7 gap-1 px-2 text-xs"
                    disabled={!enabled}
                    onClick={() => toggleFollow(c.id)}
                  >
                    <Navigation className="h-3 w-3" />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* Share */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline" className="h-8 gap-1.5">
            <UserPlus className="h-4 w-4" />
            Share
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">Share this board</p>
            <p className="text-xs text-muted-foreground">
              Anyone with the link can view and collaborate.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input readOnly value="https://ideaboard.app/b/track-ideas" className="text-xs" />
            <Button size="sm" className="shrink-0 gap-1.5" onClick={handleCopy}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="text-xs text-muted-foreground">People with access</span>
            <span className={cn('text-xs font-medium')}>{online.length + 1}</span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
