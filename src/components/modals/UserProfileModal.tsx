import { useState } from 'react';
import { User, Camera, Lock, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserProfileModal({ open, onOpenChange }: UserProfileModalProps) {
  const { user, setUser } = useAppStore();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = () => {
    if (user) {
      setUser({
        ...user,
        name,
        email,
      });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been saved successfully.',
      });
    }
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your new passwords match.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 8 characters.',
        variant: 'destructive',
      });
      return;
    }

    // In production, this would call an API
    toast({
      title: 'Password changed',
      description: 'Your password has been updated successfully.',
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    // In production, this would show a confirmation and call an API
    toast({
      title: 'Account deletion',
      description: 'This feature requires backend integration.',
      variant: 'destructive',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatarUrl} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" className="gap-2">
                <Camera className="h-4 w-4" />
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <Button onClick={handleSaveProfile} className="w-full">
              Save Profile
            </Button>
          </div>

          <Separator />

          {/* Password Change */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Change Password
            </h3>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button
              onClick={handleChangePassword}
              variant="outline"
              className="w-full"
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              Update Password
            </Button>
          </div>

          <Separator />

          {/* Danger Zone */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-destructive flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Danger Zone
            </h3>
            <p className="text-xs text-muted-foreground">
              Deleting your account is permanent and cannot be undone.
            </p>
            <Button
              onClick={handleDeleteAccount}
              variant="destructive"
              size="sm"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
