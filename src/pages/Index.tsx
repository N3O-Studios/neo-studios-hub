
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import Email from "@/components/Email";
import SocialIcons from "@/components/SocialIcons";
import OptionButtons from "@/components/OptionButtons";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1A1F2C] to-[#2A2A30] text-white font-light">
      <div className={`flex justify-center pt-6 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-0`}>
        <Logo />
      </div>

      <div className={`flex-grow flex flex-col items-center justify-center py-6 transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} z-10`}>
        <OptionButtons />
      </div>

      <div className={`w-full p-6 flex justify-between items-center transition-opacity duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} mt-auto`}>
        <div>
          <Email />
        </div>

        {/* Removed copyright text as requested */}
        <div></div>

        <div>
          <SocialIcons />
        </div>
      </div>
    </div>
  );
};

export default Index;
