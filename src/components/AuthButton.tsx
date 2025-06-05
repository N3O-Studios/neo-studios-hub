
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        toast({ title: 'Check your email for the confirmation link!' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast({ title: 'Welcome back!' });
      }
      setIsOpen(false);
      setEmail('');
      setPassword('');
      setName('');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Signed out successfully' });
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-white/80 text-sm hidden sm:inline">
          {user.user_metadata?.name || user.email}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
        >
          <UserIcon className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Sign In</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1A1F2C] border-[#9b87f5]/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#9b87f5]">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="name" className="text-white/80">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
                className="bg-[#2A2A30] border-[#9b87f5]/30 text-white"
              />
            </div>
          )}
          <div>
            <Label htmlFor="email" className="text-white/80">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#2A2A30] border-[#9b87f5]/30 text-white"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white/80">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-[#2A2A30] border-[#9b87f5]/30 text-white"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-[#9b87f5] hover:bg-[#9b87f5]/10"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthButton;
