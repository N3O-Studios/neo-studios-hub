
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import Email from "@/components/Email";
import SocialIcons from "@/components/SocialIcons";
import OptionButtons from "@/components/OptionButtons";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a small delay for the animation effect
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1A1F2C] to-[#2A2A30] text-white font-light">
      {/* Logo with proper z-index */}
      <div className={`flex justify-center pt-6 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-0`}>
        <Logo />
      </div>

      {/* Main content - AI interface and productions */}
      <div className={`flex-grow flex flex-col items-center justify-center py-6 transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-10`}>
        <OptionButtons />
      </div>

      {/* Footer */}
      <div className={`w-full p-6 flex justify-between items-end transition-opacity duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Email on bottom left */}
        <div>
          <Email />
        </div>

        {/* Copyright in the center */}
        <div className="text-xs text-gray-400">
          © 2025 N3O Studios. All Rights Reserved.
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
