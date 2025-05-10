
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const OptionButtons = () => {
  const [activeOption, setActiveOption] = useState<'none' | 'productions' | 'tools'>('none');

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-6">
        <button 
          className={`option-button ${activeOption === 'productions' ? 'bg-secondary' : ''}`}
          onClick={() => setActiveOption(activeOption === 'productions' ? 'none' : 'productions')}
        >
          Productions
        </button>
        <button 
          className={`option-button ${activeOption === 'tools' ? 'bg-secondary' : ''}`}
          onClick={() => setActiveOption(activeOption === 'tools' ? 'none' : 'tools')}
        >
          Tools
        </button>
      </div>

      {/* Conditional content based on selected option */}
      <div className="mt-6 animate-fade-in">
        {activeOption === 'productions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <div className="bg-black/20 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-bold mb-3">Music</h3>
              <p className="text-gray-300">Check out our latest tracks on Spotify and YouTube Music.</p>
              <div className="mt-4 flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://open.spotify.com/artist/7g1t8aR8ksGZPVDLhemiRt', '_blank')}
                >
                  Spotify
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://music.youtube.com/channel/UCuyY0KPfckK4mi-pmac8w4A', '_blank')}
                >
                  YouTube Music
                </Button>
              </div>
            </div>
            <div className="bg-black/20 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-bold mb-3">Videos</h3>
              <p className="text-gray-300">Watch our latest videos on our YouTube channel.</p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://www.youtube.com/@N3O-STUD1O5', '_blank')}
                >
                  YouTube Channel
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeOption === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <div className="bg-black/20 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-bold mb-3">Chord Generator</h3>
              <p className="text-gray-300">Generate chord progressions for your music productions.</p>
              <div className="mt-4">
                <Button variant="outline" size="sm">Coming Soon</Button>
              </div>
            </div>
            <div className="bg-black/20 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-bold mb-3">AI Chatbot</h3>
              <p className="text-gray-300">Get creative assistance with our AI-powered music chatbot.</p>
              <div className="mt-4">
                <Button variant="outline" size="sm">Coming Soon</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionButtons;
