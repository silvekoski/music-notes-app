import { useState } from 'react';
import { Bell, Check, UserPlus, MessageSquare, AtSign, Heart, CheckCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type NotificationType = 'collaborator' | 'comment' | 'mention' | 'reaction';

interface AppNotification {
  id: string;
  type: NotificationType;
  actor: string;
  action: string;
  target: string;
  time: string;
  group: 'Today' | 'Earlier';
  unread: boolean;
}

const typeIcon: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  collaborator: UserPlus,
  comment: MessageSquare,
  mention: AtSign,
  reaction: Heart,
};

const initialNotifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'collaborator',
    actor: 'Alex',
    action: 'joined the project',
    target: 'Album Ideas',
    time: '2h',
    group: 'Today',
    unread: true,
  },
  {
    id: 'n2',
    type: 'comment',
    actor: 'Sarah',
    action: 'commented on',
    target: 'Sunset Vibes',
    time: '5h',
    group: 'Today',
    unread: true,
  },
  {
    id: 'n3',
    type: 'mention',
    actor: 'Jordan',
    action: 'mentioned you in',
    target: 'Track Ideas',
    time: '1d',
    group: 'Earlier',
    unread: false,
  },
  {
    id: 'n4',
    type: 'reaction',
    actor: 'Mia',
    action: 'reacted to your note',
    target: 'Velvet Hours',
    time: '2d',
    group: 'Earlier',
    unread: false,
  },
];

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const groups: AppNotification['group'][] = ['Today', 'Earlier'];

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground relative"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-border">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">Notifications</h4>
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground">{unreadCount} new</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-40"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        </div>

        {/* List */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">You&apos;re all caught up</p>
            <p className="text-xs text-muted-foreground">New activity will show up here.</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {groups.map((group) => {
              const items = notifications.filter((n) => n.group === group);
              if (items.length === 0) return null;
              return (
                <div key={group}>
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      {group}
                    </span>
                  </div>
                  {items.map((n) => {
                    const Icon = typeIcon[n.type];
                    return (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={cn(
                          'group relative flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted',
                          n.unread && 'bg-muted/40'
                        )}
                      >
                        {/* Unread dot */}
                        <div className="flex w-2 shrink-0 items-start pt-2">
                          {n.unread && (
                            <span className="h-2 w-2 rounded-full bg-primary" aria-label="Unread" />
                          )}
                        </div>

                        {/* Avatar with type badge */}
                        <div className="relative shrink-0">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-muted-foreground/20 text-foreground text-xs">
                              {n.actor.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-background bg-secondary">
                            <Icon className="h-2.5 w-2.5 text-secondary-foreground" />
                          </span>
                        </div>

                        {/* Body */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-foreground leading-snug">
                            <span className="font-medium">{n.actor}</span>{' '}
                            {n.action}{' '}
                            <span className="font-medium">{n.target}</span>
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{n.time} ago</p>
                        </div>

                        {/* Hover actions */}
                        <div className="flex shrink-0 items-start gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          {n.unread && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-foreground"
                              aria-label="Mark as read"
                              onClick={(e) => {
                                e.stopPropagation();
                                markRead(n.id);
                              }}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            aria-label="Dismiss"
                            onClick={(e) => {
                              e.stopPropagation();
                              dismiss(n.id);
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="p-2">
          <Button variant="ghost" className="w-full h-8 text-xs text-muted-foreground hover:text-foreground">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
