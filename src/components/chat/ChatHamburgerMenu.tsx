import { useState, useEffect } from 'react';
import { Menu, Save, Trash2, Heart, HeartOff, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types/chat';

interface SavedChat {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  is_favorited?: boolean;
}

interface ChatHamburgerMenuProps {
  chatType: 'music' | 'developer' | 'general';
  currentChatHistory?: ChatMessage[];
  onLoadChat?: (messages: ChatMessage[]) => void;
  onNewChat?: () => void;
}

const ChatHamburgerMenu = ({ 
  chatType, 
  currentChatHistory = [], 
  onLoadChat,
  onNewChat 
}: ChatHamburgerMenuProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
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
      fetchSavedChats();
    }
  }, [user, chatType]);

  const fetchSavedChats = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('saved_chats')
      .select('*')
      .eq('user_id', user.id)
      .eq('chat_type', chatType)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data && !error) {
      setSavedChats(data);
    }
  };

  const saveCurrentChat = async () => {
    if (!user || !newChatTitle.trim() || currentChatHistory.length === 0) {
      toast({ 
        title: 'Cannot save chat', 
        description: 'Please enter a title and have some conversation history',
        variant: 'destructive' 
      });
      return;
    }

    setIsLoading(true);
    
    // Check if user already has 10 saved chats
    if (savedChats.length >= 10) {
      // Find oldest non-favorited chat to delete
      const oldestNonFavorited = savedChats
        .filter(chat => !chat.is_favorited)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];
      
      if (oldestNonFavorited) {
        await supabase
          .from('saved_chats')
          .delete()
          .eq('id', oldestNonFavorited.id);
      } else {
        toast({ 
          title: 'Cannot save chat', 
          description: 'You have reached the maximum of 10 saved chats. Please unfavorite some chats to save new ones.',
          variant: 'destructive' 
        });
        setIsLoading(false);
        return;
      }
    }

    const { error } = await supabase
      .from('saved_chats')
      .insert({
        user_id: user.id,
        title: newChatTitle,
        messages: currentChatHistory,
        chat_type: chatType,
        is_favorited: false
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

  const toggleFavorite = async (chatId: string, currentFavoriteStatus: boolean) => {
    const { error } = await supabase
      .from('saved_chats')
      .update({ is_favorited: !currentFavoriteStatus })
      .eq('id', chatId);

    if (error) {
      toast({ title: 'Error updating favorite', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: currentFavoriteStatus ? 'Removed from favorites' : 'Added to favorites' });
      fetchSavedChats();
    }
  };

  const loadChat = (chat: SavedChat) => {
    if (onLoadChat) {
      onLoadChat(chat.messages);
      setIsOpen(false);
      toast({ title: 'Chat loaded successfully' });
    }
  };

  const startNewChat = () => {
    if (onNewChat) {
      onNewChat();
      setIsOpen(false);
      toast({ title: 'Started new chat' });
    }
  };

  if (!user) {
    return null;
  }

  const getChatTypeLabel = () => {
    switch (chatType) {
      case 'music': return 'Music Chat';
      case 'developer': return 'Developer Chat';
      default: return 'General Chat';
    }
  };

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
            {getChatTypeLabel()} Menu
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-full max-h-[60vh]">
          <div className="space-y-4">
            {/* New Chat Button */}
            <div className="space-y-2">
              <Button
                onClick={startNewChat}
                className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
              >
                Start New Chat
              </Button>
            </div>

            <Separator className="bg-[#9b87f5]/20" />

            {/* Save Current Chat */}
            {currentChatHistory.length > 0 && (
              <>
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
                  <p className="text-xs text-white/60">
                    {savedChats.length}/10 chats saved. Oldest non-favorited chats are auto-deleted.
                  </p>
                </div>

                <Separator className="bg-[#9b87f5]/20" />
              </>
            )}

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
                      className="flex items-center justify-between p-3 bg-[#2A2A30] rounded border border-[#9b87f5]/20 hover:border-[#9b87f5]/40 transition-colors"
                    >
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => loadChat(chat)}
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-white truncate">{chat.title}</p>
                          {chat.is_favorited && (
                            <Heart className="h-3 w-3 text-red-400 fill-current" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <Calendar className="h-3 w-3" />
                          {new Date(chat.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(chat.id, chat.is_favorited || false);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-white/60 hover:text-red-400 hover:bg-red-400/10 p-1 h-auto"
                        >
                          {chat.is_favorited ? (
                            <Heart className="h-4 w-4 fill-current text-red-400" />
                          ) : (
                            <HeartOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat.id);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-white/60 hover:text-red-400 hover:bg-red-400/10 p-1 h-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ChatHamburgerMenu;