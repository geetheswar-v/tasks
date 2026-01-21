import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import apiClient from '@/api/client';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (user: any, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        
        const response = await apiClient.post('/auth/login', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        const { user, access_token } = response.data;
        onSuccess(user, access_token);
      } else {
        await apiClient.post('/auth/register', { username, password, name });
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        const response = await apiClient.post('/auth/login', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        const { user, access_token } = response.data;
        onSuccess(user, access_token);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</DialogTitle>
            <DialogDescription>
              {isLogin 
                ? 'Enter your credentials to access your tasks.' 
                : 'Join us to stay organized and productive.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-8">
            {!isLogin && (
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive font-medium mt-2">{error}</p>
            )}
          </div>

          <DialogFooter className="flex-col gap-3 sm:flex-col sm:gap-3">
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="text-primary hover:underline font-medium"
                onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
