
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import Email from "@/components/Email";
import SocialIcons from "@/components/SocialIcons";
import OptionButtons from "@/components/OptionButtons";
import Navigation from "@/components/Navigation";
import AuthButton from "@/components/AuthButton";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1A1F2C] to-[#2A2A30] text-white font-light">
      {/* Header with Logo */}
      <div className="flex justify-between items-start pt-6 px-4 sm:px-6">
        <div className={`flex justify-center flex-1 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-0`}>
          <Logo />
        </div>
        <div className={`transition-opacity duration-1000 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <AuthButton />
        </div>
      </div>

      {/* Navigation */}
      <div className={`flex justify-center pt-4 px-4 transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Navigation />
      </div>

      {/* Main Content */}
      <div className={`flex-grow flex flex-col items-center justify-center py-6 px-4 transition-opacity duration-1000 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-10`}>
        <OptionButtons />
      </div>

      {/* Footer */}
      <div className={`w-full p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center transition-opacity duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} mt-auto gap-4 sm:gap-0`}>
        <div className="flex items-center gap-2">
          <Email />
        </div>

        <div className="text-sm text-white/60 order-first sm:order-none">
          <span>© 2025 N3OStudios</span>
        </div>

        <div>
          <SocialIcons />
        </div>
      </div>
    </div>
  );
};

export default Index;
