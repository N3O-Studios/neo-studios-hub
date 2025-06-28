import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import AuthButton from "@/components/AuthButton";
import ChatHamburgerMenu from "@/components/chat/ChatHamburgerMenu";
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
      <div className="flex justify-between items-start pt-6 px-4 sm:px-6">
        <div className="w-16"></div> {/* Spacer for balance */}
        <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <Logo />
        </div>
        <div className={`transition-opacity duration-1000 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <AuthButton />
        </div>
      </div>

      {/* Main Content */}
      <div className={`container mx-auto px-4 py-6 transition-opacity duration-1000 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'} relative`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="space-y-6">
            <MusicNews />
            <ChordGenerator />
          </div>
          
          {/* Right Column with Chat Menu */}
          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <ChatHamburgerMenu chatType="music" />
            </div>
            <MusicChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Music;