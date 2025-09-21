import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Code, FileEdit } from 'lucide-react';

const BlogSection = () => {
  return (
    <div className="w-full max-w-5xl mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest Music */}
        <Card className="bg-[#1A1F2C] border-[#9b87f5]/30">
          <CardHeader>
            <CardTitle className="text-[#9b87f5] flex items-center gap-2">
              <Music className="h-5 w-5" />
              Latest Music
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white/80 space-y-4">
            <p>
              Dive into our cutting-edge music production insights. From AI-powered composition tools to innovative mixing techniques, we're pushing the boundaries of what's possible in modern music creation.
            </p>
            <p>
              Our latest articles explore how artificial intelligence is revolutionizing the music industry, featuring interviews with top producers and exclusive previews of upcoming technology.
            </p>
          </CardContent>
        </Card>

        {/* Latest Tech */}
        <Card className="bg-[#1A1F2C] border-[#9b87f5]/30">
          <CardHeader>
            <CardTitle className="text-[#9b87f5] flex items-center gap-2">
              <Code className="h-5 w-5" />
              Latest Tech
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white/80 space-y-4">
            <p>
              Stay ahead of the curve with our technology insights. We cover everything from breakthrough AI developments to emerging programming frameworks that are shaping the future.
            </p>
            <p>
              Our technical deep-dives and expert analysis help developers and tech enthusiasts navigate the rapidly evolving landscape of modern technology and innovation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogSection;