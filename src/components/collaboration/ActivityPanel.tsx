import { Activity as ActivityIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAppStore } from '@/stores/appStore';
import { getCollaborator } from '@/lib/collaborators';

function formatRelativeTime(date: Date | string) {
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const secs = Math.round(diff / 1000);
  if (secs < 60) return 'just now';
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function ActivityPanel() {
  const activities = useAppStore((s) => s.activities);
  const selectedProjectId = useAppStore((s) => s.selectedProjectId);

  const projectActivities = activities
    .filter((a) => a.projectId === selectedProjectId)
    .slice(0, 40);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Activity"
        >
          <ActivityIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium">Activity</span>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>

        {projectActivities.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            No activity yet
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto pb-2">
            {projectActivities.map((activity) => {
              const collaborator = getCollaborator(activity.userId);
              const color = collaborator?.color;
              const initials =
                collaborator?.initials ?? activity.userName.charAt(0).toUpperCase();
              return (
                <div key={activity.id} className="flex gap-3 px-4 py-2.5">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage src={collaborator?.avatarUrl} alt={activity.userName} />
                    <AvatarFallback
                      className="text-[10px] font-medium text-white"
                      style={color ? { backgroundColor: color } : undefined}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">
                      <span className="font-medium">{activity.userName}</span>{' '}
                      <span className="text-muted-foreground">{activity.details}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatRelativeTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
