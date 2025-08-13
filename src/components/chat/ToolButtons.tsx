
import { Button } from '@/components/ui/button';
import { Music, Image, Video, Wrench, Piano, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ToolButtonsProps {
  onSelectTool: (tool: string) => void;
}

export const ToolButtons = ({ onSelectTool }: ToolButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const tools = [
    { name: 'Music', icon: Music, label: 'Music Generator' },
    { name: 'Image', icon: Image, label: 'Image Generator' },
    { name: 'Video', icon: Video, label: 'Video Generator' },
    { name: 'Chord Detector', icon: Piano, label: 'Chord Detector' },
    { name: 'Stems Splitter', icon: BarChart3, label: 'Stems Splitter' },
  ];

  const handleToolSelect = (toolName: string) => {
    onSelectTool(toolName);
    setIsOpen(false);
  };

  return (
    <div className="flex mt-3 gap-3 overflow-x-auto pb-1 items-center">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Tools
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="bg-[#1A1F2C] border-[#9b87f5]/30 text-white"
          align="start"
        >
          {tools.map((tool) => (
            <DropdownMenuItem
              key={tool.name}
              onClick={() => handleToolSelect(tool.label)}
              className="hover:bg-[#9b87f5]/10 cursor-pointer"
            >
              <tool.icon className="h-4 w-4 mr-2" />
              {tool.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="text-xs text-white/60 italic">
        *NS can make mistakes, double check important information
      </div>
    </div>
  );
};
