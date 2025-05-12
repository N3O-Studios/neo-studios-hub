
import { Button } from '@/components/ui/button';
import { Music, Video } from 'lucide-react';

export const ProductionShowcase = () => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-[#1A1F2C] p-4 rounded-lg border border-[#9b87f5]/30">
        <h3 className="text-lg font-bold mb-2 text-white">Latest Music</h3>
        <div className="h-[100px] bg-[#2A2A30] rounded-md flex items-center justify-center">
          <Music className="h-8 w-8 text-[#9b87f5]" />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="mt-3 bg-[#9b87f5] text-white border-[#9b87f5]/40 hover:bg-[#7E69AB] hover:text-white"
          onClick={() => window.open('https://open.spotify.com/artist/7g1t8aR8ksGZPVDLhemiRt', '_blank')}
        >
          Listen on Spotify
        </Button>
      </div>
      <div className="bg-[#1A1F2C] p-4 rounded-lg border border-[#9b87f5]/30">
        <h3 className="text-lg font-bold mb-2 text-white">Latest Videos</h3>
        <div className="h-[100px] bg-[#2A2A30] rounded-md flex items-center justify-center">
          <Video className="h-8 w-8 text-[#9b87f5]" />
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="mt-3 bg-[#9b87f5] text-white border-[#9b87f5]/40 hover:bg-[#7E69AB] hover:text-white"
          onClick={() => window.open('https://www.youtube.com/@N3O-STUD1O5', '_blank')}
        >
          Watch on YouTube
        </Button>
      </div>
    </div>
  );
};
