
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, MessageSquare, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: chats } = useQuery({
    queryKey: ['user-chats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.log('Chats table not yet created');
        return [];
      }
    },
    enabled: false
  });

  const deleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['user-chats'] });
      toast({ title: 'Chat deleted successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/60 hover:text-white hover:bg-white/10 p-2"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-[#1A1F2C] border-[#9b87f5]/30 text-white w-80">
        <SheetHeader>
          <SheetTitle className="text-[#9b87f5]">Chat History</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {chats?.length === 0 ? (
            <p className="text-white/60 text-sm">No saved chats yet</p>
          ) : (
            chats?.map((chat) => (
              <div key={chat.id} className="bg-[#2A2A30] p-3 rounded border border-[#9b87f5]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#9b87f5] text-sm capitalize">{chat.chat_type}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteChat(chat.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-white/70 text-xs">
                  {new Date(chat.updated_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 pt-4 border-t border-[#9b87f5]/20">
          <p className="text-white/60 text-xs">
            © 2025 N3OStudios
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HamburgerMenu;
