
import { Button } from '@/components/ui/button';
import { Guitar, Music, Image, Video } from 'lucide-react';

interface ToolButtonsProps {
  onSelectTool: (tool: string) => void;
}

export const ToolButtons = ({ onSelectTool }: ToolButtonsProps) => {
  return (
    <div className="flex mt-3 gap-3 overflow-x-auto pb-1">
      <Button
        variant="outline"
        size="sm"
        className="bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
        onClick={() => onSelectTool("Chord Generator")}
      >
        <Guitar className="h-4 w-4 mr-2" />
        Chord Generator
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
        onClick={() => onSelectTool("Music Generator")}
      >
        <Music className="h-4 w-4 mr-2" />
        Music
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
        onClick={() => onSelectTool("Image Generator")}
      >
        <Image className="h-4 w-4 mr-2" />
        Image
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
        onClick={() => onSelectTool("Video Generator")}
      >
        <Video className="h-4 w-4 mr-2" />
        Video
      </Button>
    </div>
  );
};
