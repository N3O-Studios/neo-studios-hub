
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <SheetTitle className="text-[#9b87f5]">*NS can make mistakes, double check important information</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <p className="text-white/60 text-sm">Chat history and user accounts coming soon...</p>
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
