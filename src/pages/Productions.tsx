
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Productions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-primary text-white font-light">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Productions</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-secondary/80 p-6 rounded-lg border border-secondary/40">
            <h2 className="text-xl font-bold mb-4">Music</h2>
            <p className="mb-4 text-white/90">Listen to our latest tracks on your favorite platforms.</p>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                className="text-white border-white/40 hover:bg-secondary hover:text-white"
                onClick={() => window.open('https://open.spotify.com/artist/7g1t8aR8ksGZPVDLhemiRt', '_blank')}
              >
                Spotify
              </Button>
              <Button 
                variant="outline" 
                className="text-white border-white/40 hover:bg-secondary hover:text-white"
                onClick={() => window.open('https://music.youtube.com/channel/UCuyY0KPfckK4mi-pmac8w4A', '_blank')}
              >
                YouTube Music
              </Button>
            </div>
          </div>
          
          <div className="bg-secondary/80 p-6 rounded-lg border border-secondary/40">
            <h2 className="text-xl font-bold mb-4">Videos</h2>
            <p className="mb-4 text-white/90">Watch our latest videos and tutorials.</p>
            
            <Button 
              variant="outline" 
              className="text-white border-white/40 hover:bg-secondary hover:text-white"
              onClick={() => window.open('https://www.youtube.com/@N3O-STUD1O5', '_blank')}
            >
              YouTube Channel
            </Button>
          </div>
        </div>
        
        <div className="mt-8">
          <Link to="/">
            <Button 
              variant="outline" 
              className="text-white border-white/40 hover:bg-secondary hover:text-white"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Productions;
