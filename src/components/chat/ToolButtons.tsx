
import { Button } from '@/components/ui/button';
import { Wrench, Music, Image, FileAudio } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { StemSplitterIcon } from '@/components/icons/StemSplitterIcon';

interface ToolButtonsProps {
  onSelectTool: (tool: string, component?: string) => void;
}

export const ToolButtons = ({ onSelectTool }: ToolButtonsProps) => {
  const tools = [
    { name: "Music Generator", icon: Music, status: "Music tool is currently WIP" },
    { name: "Image Generator", icon: Image, component: "ImageGenerator" },
    { name: "Chord Detector", icon: FileAudio, status: "Chord detector is currently WIP" },
    { name: "Stem Splitter", icon: StemSplitterIcon, status: "Stem splitter is currently WIP" }
  ];

  return (
    <div className="flex mt-3 gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Tools
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 bg-[#1A1F2C] border-[#9b87f5]/30">
          <div className="space-y-2">
            <h4 className="font-medium text-[#9b87f5] mb-3">Available Tools</h4>
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Button
                  key={tool.name}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white/70 hover:text-[#9b87f5] hover:bg-[#9b87f5]/10"
                  onClick={() => onSelectTool(tool.status || tool.name, tool.component)}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {tool.name}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      
      <div className="text-xs text-white/50 mt-2">
        <p>⚠️ Please note: All responses are AI-generated and may contain inaccuracies. Always verify information independently.</p>
      </div>
    </div>
  );
};
