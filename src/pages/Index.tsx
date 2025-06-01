
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import Email from "@/components/Email";
import SocialIcons from "@/components/SocialIcons";
import OptionButtons from "@/components/OptionButtons";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Add a small delay for the animation effect
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Cool mouse tracking effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1A1F2C] to-[#2A2A30] text-white font-light relative overflow-hidden">
      {/* Cool animated background effect */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, #9b87f5, transparent)`
        }}
      />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#9b87f5] rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Logo with proper z-index */}
      <div className={`flex justify-center pt-6 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-10 relative`}>
        <Logo />
      </div>

      {/* Main content - AI interface and productions */}
      <div className={`flex-grow flex flex-col items-center justify-center py-6 transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-10 relative`}>
        <OptionButtons />
      </div>

      {/* Footer */}
      <div className={`w-full p-6 flex justify-between items-center transition-opacity duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} mt-auto z-10 relative`}>
        {/* Email on bottom left */}
        <div>
          <Email />
        </div>

        {/* Cool status indicator in the center */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>NS Online</span>
        </div>

        {/* Social media icons on bottom right */}
        <div>
          <SocialIcons />
        </div>
      </div>
    </div>
  );
};

export default Index;
