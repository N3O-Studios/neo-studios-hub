
import { useState, useEffect } from 'react';
import { Menu, Save, Trash2, Users, Settings, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface SavedChat {
  id: string;
  title: string;
  messages: any[];
  created_at: string;
}

interface UserRole {
  role: 'user' | 'developer';
}

interface ChatHamburgerMenuProps {
  chatType: 'music' | 'developer';
}

const ChatHamburgerMenu = ({ chatType }: ChatHamburgerMenuProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [userRole, setUserRole] = useState<'user' | 'developer'>('user');
  const [newChatTitle, setNewChatTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    if (user) {
      fetchUserRole();
      fetchSavedChats();
    }
  }, [user]);

  const fetchUserRole = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (data && !error) {
      setUserRole(data.role);
    }
  };

  const fetchSavedChats = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('saved_chats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setSavedChats(data);
    }
  };

  const saveCurrentChat = async () => {
    if (!user || !newChatTitle.trim()) {
      toast({ title: 'Please enter a chat title', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from('saved_chats')
      .insert({
        user_id: user.id,
        title: newChatTitle,
        messages: [] // This would be populated with actual chat messages
      });

    if (error) {
      toast({ title: 'Error saving chat', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Chat saved successfully' });
      setNewChatTitle('');
      fetchSavedChats();
    }
    setIsLoading(false);
  };

  const deleteChat = async (chatId: string) => {
    const { error } = await supabase
      .from('saved_chats')
      .delete()
      .eq('id', chatId);

    if (error) {
      toast({ title: 'Error deleting chat', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Chat deleted successfully' });
      fetchSavedChats();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-[#1A1F2C]/80 border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10 backdrop-blur-sm"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1A1F2C] border-[#9b87f5]/30 text-white max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-[#9b87f5]">
            {chatType === 'music' ? 'Music Chat' : 'Developer Chat'} Menu
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-full max-h-[60vh]">
          <div className="space-y-4">
            {/* Save Current Chat */}
            <div className="space-y-2">
              <Label className="text-white/80">Save Current Chat</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter chat title..."
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                  className="bg-[#2A2A30] border-[#9b87f5]/30 text-white"
                />
                <Button
                  onClick={saveCurrentChat}
                  disabled={isLoading}
                  size="sm"
                  className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="bg-[#9b87f5]/20" />

            {/* Saved Chats */}
            <div className="space-y-2">
              <Label className="text-white/80">Saved Chats</Label>
              {savedChats.length === 0 ? (
                <p className="text-white/60 text-sm">No saved chats yet</p>
              ) : (
                <div className="space-y-2">
                  {savedChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="flex items-center justify-between p-2 bg-[#2A2A30] rounded border border-[#9b87f5]/20"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{chat.title}</p>
                        <p className="text-xs text-white/60">
                          {new Date(chat.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => deleteChat(chat.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* N3O Developer Features */}
            {userRole === 'developer' && (
              <>
                <Separator className="bg-[#9b87f5]/20" />
                <div className="space-y-2">
                  <Label className="text-[#9b87f5]">N3O Developer Tools</Label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View All User Chats
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Usage Analytics
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ChatHamburgerMenu;
