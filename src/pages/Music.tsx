
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import Navigation from "@/components/Navigation";
import MusicNews from "@/components/MusicNews";
import ChordGenerator from "@/components/ChordGenerator";
import MusicChat from "@/components/MusicChat";

const Music = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2A2A30] text-white font-light">
      {/* Header */}
      <div className="flex justify-center pt-6 px-4 sm:px-6">
        <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <Logo />
        </div>
      </div>

      {/* Navigation */}
      <div className={`flex justify-center pt-4 px-4 transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Navigation />
      </div>

      {/* Main Content */}
      <div className={`container mx-auto px-4 py-6 transition-opacity duration-1000 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
            <MusicNews />
            <ChordGenerator />
          </div>
          
          {/* Right Column */}
          <div>
            <MusicChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Music;
