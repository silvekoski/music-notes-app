import { useState } from 'react';
import { User, Camera, Lock, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';

interface UserSettingsViewProps {
  onClose: () => void;
}

export function UserSettingsView({ onClose }: UserSettingsViewProps) {
  const { user, setUser } = useAppStore();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = () => {
    if (user) {
      setUser({ ...user, name, email });
      toast({ title: 'Profile updated', description: 'Your profile has been saved successfully.' });
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

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-2xl mx-auto p-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <User className="h-6 w-6" />
            User Settings
          </h1>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatarUrl} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" className="gap-2">
                <Camera className="h-4 w-4" />
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
            </div>
            <Button onClick={handleSaveProfile}>Save Profile</Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Change Password
            </h3>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button onClick={handleChangePassword} variant="outline" disabled={!currentPassword || !newPassword || !confirmPassword}>
              Update Password
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-destructive flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Danger Zone
            </h3>
            <p className="text-xs text-muted-foreground">Deleting your account is permanent and cannot be undone.</p>
            <Button onClick={handleDeleteAccount} variant="destructive" size="sm">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
