import { Search, Settings, Menu, Moon, Sun, LogOut, User as UserIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/stores/appStore';
import { useState, useEffect, RefObject } from 'react';
import { TagsPopover } from '@/components/board/TagsPopover';
import { NotificationsPopover } from '@/components/layout/NotificationsPopover';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  searchInputRef?: RefObject<HTMLInputElement>;
}

export function TopBar({ searchInputRef }: TopBarProps) {
  const { boards, selectedBoardId, searchQuery, setSearchQuery, user, setUser, setActiveView } = useAppStore();
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  
  const currentBoard = boards.find((b) => b.id === selectedBoardId);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleDownloadCode = async () => {
    const { downloadProjectCode } = await import('@/lib/exportCode');
    await downloadProjectCode();
  };

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        </div>


        <div className="flex flex-1 items-center justify-center max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search in title and metadata... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <NotificationsPopover />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user?.name?.charAt(0) || <UserIcon className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.name || 'Guest'}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user?.email || 'guest@example.com'}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveView('userSettings')}>
                <Settings className="mr-2 h-4 w-4" />
                User settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadCode}>
                <Download className="mr-2 h-4 w-4" />
                Download code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
