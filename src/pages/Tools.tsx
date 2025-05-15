
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Tools = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary to-primary/80 text-white font-light">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Creative Tools</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#222222] p-6 rounded-lg border border-[#1EAEDB]/40">
            <h2 className="text-xl font-bold mb-4">Chord Generator</h2>
            <p className="mb-4 text-white/90">Generate chord progressions for your music productions.</p>
            
            <Link to="/chord-generator">
              <Button 
                variant="outline"
                className="bg-[#1EAEDB] text-white border-white/40 hover:bg-[#1EAEDB]/80 hover:text-white"
              >
                Try It
              </Button>
            </Link>
          </div>
          
          <div className="bg-[#222222] p-6 rounded-lg border border-[#1EAEDB]/40">
            <h2 className="text-xl font-bold mb-4">AI Music Assistant</h2>
            <p className="mb-4 text-white/90">Get creative assistance with our AI-powered music chatbot.</p>
            <p className="text-sm text-white/80 mb-4">Coming soon</p>
            
            <Button 
              variant="outline" 
              disabled
              className="bg-[#1EAEDB] text-white border-white/40 hover:bg-[#1EAEDB]/80 hover:text-white"
            >
              Chat Now
            </Button>
          </div>
        </div>
        
        <div className="mt-8">
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

export default Tools;
