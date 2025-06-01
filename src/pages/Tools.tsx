
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Tools = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1A1F2C] to-[#2A2A30] text-white font-light">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-[#9b87f5]">Creative Tools</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A1F2C] p-6 rounded-lg border border-[#9b87f5]/40">
            <h2 className="text-xl font-bold mb-4">AI Music Assistant</h2>
            <p className="mb-4 text-white/90">Get creative assistance with our AI-powered music chatbot NS.</p>
            
            <Link to="/">
              <Button 
                variant="outline"
                className="bg-[#9b87f5] text-white border-[#9b87f5] hover:bg-[#7E69AB] hover:text-white"
              >
                Chat with NS
              </Button>
            </Link>
          </div>
          
          <div className="bg-[#1A1F2C] p-6 rounded-lg border border-[#9b87f5]/40">
            <h2 className="text-xl font-bold mb-4">Creative Assistant</h2>
            <p className="mb-4 text-white/90">Get help with creative projects and artistic guidance.</p>
            
            <Link to="/">
              <Button 
                variant="outline"
                className="bg-[#9b87f5] text-white border-[#9b87f5] hover:bg-[#7E69AB] hover:text-white"
              >
                Get Creative Help
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-8">
          <Link to="/">
            <Button 
              variant="outline" 
              className="bg-[#9b87f5] text-white border-[#9b87f5] hover:bg-[#7E69AB] hover:text-white"
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
