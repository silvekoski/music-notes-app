import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';

interface UserSettingsViewProps {
  onClose: () => void;
}

type SectionId = 'profile' | 'account' | 'security' | 'notifications' | 'appearance';

const sections: { id: SectionId; label: string; description: string }[] = [
  { id: 'profile', label: 'Profile', description: 'Your public identity and bio' },
  { id: 'account', label: 'Account', description: 'Email, language, and region' },
  { id: 'security', label: 'Security', description: 'Password, 2FA, and sessions' },
  { id: 'notifications', label: 'Notifications', description: 'How and when we reach you' },
  { id: 'appearance', label: 'Appearance', description: 'Theme and display options' },
];

const languages = ['English', 'Spanish', 'French', 'German', 'Japanese'];
const timezones = [
  'UTC',
  'America/Los_Angeles',
  'America/New_York',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Tokyo',
];

const sessions = [
  { id: 's1', device: 'Chrome on macOS', location: 'San Francisco, US', current: true, lastActive: 'Active now' },
  { id: 's2', device: 'Safari on iPhone', location: 'San Francisco, US', current: false, lastActive: '2 hours ago' },
  { id: 's3', device: 'Firefox on Windows', location: 'New York, US', current: false, lastActive: '3 days ago' },
];

const notificationGroups: { id: string; label: string; description: string; channel: 'Email' | 'Push' }[] = [
  { id: 'comments', label: 'Comments', description: 'When someone comments on your cards', channel: 'Email' },
  { id: 'mentions', label: 'Mentions', description: 'When someone mentions you', channel: 'Push' },
  { id: 'newCards', label: 'New cards', description: 'When a card is added to your boards', channel: 'Push' },
  { id: 'weekly', label: 'Weekly digest', description: 'A summary of activity each week', channel: 'Email' },
  { id: 'product', label: 'Product updates', description: 'News about features and releases', channel: 'Email' },
];

export function UserSettingsView({ onClose }: UserSettingsViewProps) {
  const { user, setUser } = useAppStore();
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState<SectionId>('profile');

  // Profile
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [role, setRole] = useState(user?.role || '');
  const [location, setLocation] = useState(user?.location || '');

  // Account
  const [email, setEmail] = useState(user?.email || '');
  const [language, setLanguage] = useState(user?.language || 'English');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC');

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    comments: true,
    mentions: true,
    newCards: false,
    weekly: true,
    product: false,
  });

  // Appearance
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  const handleSaveProfile = () => {
    if (user) {
      setUser({ ...user, name, username, bio, role, location });
      toast({ title: 'Profile updated', description: 'Your profile has been saved successfully.' });
    }
  };

  const handleSaveAccount = () => {
    if (user) {
      setUser({ ...user, email, language, timezone });
      toast({ title: 'Account updated', description: 'Your account details have been saved.' });
    }
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', description: 'Please make sure your new passwords match.', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: 'Password too short', description: 'Password must be at least 8 characters.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Password changed', description: 'Your password has been updated successfully.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    toast({ title: 'Account deletion', description: 'This feature requires backend integration.', variant: 'destructive' });
  };

  const initials = user?.name?.charAt(0) || 'U';

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8 pl-12">
          Manage your account, security, and preferences.
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Section nav */}
          <nav className="lg:w-56 shrink-0" aria-label="Settings sections">
            <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        'w-full text-left rounded px-3 py-2 text-sm transition-colors whitespace-nowrap',
                        isActive
                          ? 'bg-muted font-medium text-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {section.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h2 className="text-lg font-medium">
                {sections.find((s) => s.id === activeSection)?.label}
              </h2>
              <p className="text-sm text-muted-foreground">
                {sections.find((s) => s.id === activeSection)?.description}
              </p>
            </div>

            {/* Profile */}
            {activeSection === 'profile' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Change photo</Button>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell people a little about yourself"
                    className="min-h-[100px]"
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">{bio.length}/200 characters</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Songwriter" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>Save profile</Button>
                </div>
              </div>
            )}

            {/* Account */}
            {activeSection === 'account' && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                  <p className="text-xs text-muted-foreground">Used for sign in and notifications.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveAccount}>Save account</Button>
                </div>

                <Separator />

                {/* Danger zone */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-destructive">Danger zone</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded border border-border p-4">
                    <div>
                      <p className="text-sm font-medium">Delete account</p>
                      <p className="text-xs text-muted-foreground">Permanently remove your account and all data. This cannot be undone.</p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="shrink-0">Delete account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete your account, boards, and cards. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAccount}>Delete account</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Change password</h3>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New password</Label>
                      <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm new password</Label>
                      <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleChangePassword} variant="outline" disabled={!currentPassword || !newPassword || !confirmPassword}>
                      Update password
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Two-factor authentication</h3>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} aria-label="Toggle two-factor authentication" />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Active sessions</h3>
                  <ul>
                    {sessions.map((session, index) => (
                      <li key={session.id}>
                        {index > 0 && <Separator />}
                        <div className="flex items-center justify-between gap-4 py-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">{session.device}</p>
                              {session.current && (
                                <span className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
                                  This device
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{session.location} · {session.lastActive}</p>
                          </div>
                          {!session.current && (
                            <Button variant="ghost" size="sm" className="shrink-0">Sign out</Button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div className="space-y-1">
                {notificationGroups.map((group, index) => (
                  <div key={group.id}>
                    {index > 0 && <Separator />}
                    <div className="flex items-center justify-between gap-4 py-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{group.label}</p>
                          <span className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
                            {group.channel}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{group.description}</p>
                      </div>
                      <Switch
                        checked={notifications[group.id]}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({ ...prev, [group.id]: checked }))
                        }
                        aria-label={`Toggle ${group.label} notifications`}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-4">
                  <Button onClick={() => toast({ title: 'Preferences saved', description: 'Your notification settings have been updated.' })}>
                    Save preferences
                  </Button>
                </div>
              </div>
            )}

            {/* Appearance */}
            {activeSection === 'appearance' && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {(['light', 'dark', 'system'] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setTheme(option)}
                        className={cn(
                          'rounded border p-3 text-left transition-colors',
                          theme === option ? 'border-foreground' : 'border-border hover:bg-muted'
                        )}
                        aria-pressed={theme === option}
                      >
                        <div className="mb-2 h-12 w-full rounded bg-muted" />
                        <span className="text-sm capitalize">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Compact mode</h3>
                    <p className="text-xs text-muted-foreground">Reduce spacing for a denser layout.</p>
                  </div>
                  <Switch checked={compactMode} onCheckedChange={setCompactMode} aria-label="Toggle compact mode" />
                </div>

                <Separator />

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Reduce motion</h3>
                    <p className="text-xs text-muted-foreground">Minimize animations and transitions.</p>
                  </div>
                  <Switch checked={reduceMotion} onCheckedChange={setReduceMotion} aria-label="Toggle reduce motion" />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => toast({ title: 'Appearance saved', description: 'Your display preferences have been updated.' })}>
                    Save preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
