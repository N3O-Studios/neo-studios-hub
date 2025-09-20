
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ChatHamburgerMenuProps {
  chatType: 'music' | 'developer';
}

const ChatHamburgerMenu = ({ chatType }: ChatHamburgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
      <DialogContent className="bg-[#1A1F2C] border-[#9b87f5]/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#9b87f5]">
            {chatType === 'music' ? 'Music Chat' : 'Developer Chat'} Menu
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          <p className="text-white/70 text-sm">
            Chat menu coming soon! This will include features like:
          </p>
          <ul className="text-white/60 text-sm space-y-1 ml-4">
            <li>• Save conversations</li>
            <li>• Load previous chats</li>
            <li>• Export chat history</li>
            <li>• Chat settings</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatHamburgerMenu;
