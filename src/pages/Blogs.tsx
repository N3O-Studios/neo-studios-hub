import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const Blogs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary to-primary/80 text-white font-light">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Monthly AI Tools Blog</h1>
        
        <div className="bg-[#222222] p-8 rounded-lg border border-[#1EAEDB]/40 mb-8">
          <h2 className="text-2xl font-bold mb-6">This Month's Featured AI Tools</h2>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-6 text-white/90">
              There are a lot of fascinating AI tools popping up nowadays and here are two good ones I found.
            </p>
            
            <div className="space-y-6">
              <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#1EAEDB]/20">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  1. Seed by ByteDance
                  <ExternalLink className="h-5 w-5" />
                </h3>
                <p className="text-white/90 mb-4">
                  This is a fantastic website for anybody who wants to make 4K content using AI. It offers several models to fit any needs.
                </p>
                <a 
                  href="https://seed.bytedance.com/en/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#1EAEDB] hover:text-[#1EAEDB]/80 underline"
                >
                  https://seed.bytedance.com/en/
                </a>
              </div>
              
              <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#1EAEDB]/20">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  2. Meshy AI
                  <ExternalLink className="h-5 w-5" />
                </h3>
                <p className="text-white/90 mb-4">
                  Meshy AI is a marvelous website for any 3D modeller. It can make models for product advertisement, game development and even film production! One of its most interesting capabilities is being able to turn an image into a 3D model.
                </p>
                <a 
                  href="https://meshy.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#1EAEDB] hover:text-[#1EAEDB]/80 underline"
                >
                  https://meshy.ai
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Link to="/tools">
            <Button 
              variant="outline" 
              className="bg-[#1EAEDB] text-white border-white/40 hover:bg-[#1EAEDB]/80 hover:text-white"
            >
              Back to Tools
            </Button>
          </Link>
          
          <Link to="/">
            <Button 
              variant="outline" 
              className="bg-[#1EAEDB] text-white border-white/40 hover:bg-[#1EAEDB]/80 hover:text-white"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Blogs;