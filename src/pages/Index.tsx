
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
    <div className="min-h-screen flex flex-col bg-primary text-white font-light">
      {/* Logo at the top center */}
      <div className={`flex justify-center pt-8 lg:pt-12 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Logo />
      </div>

      {/* Main content */}
      <div className={`flex-grow flex flex-col items-center justify-center transition-opacity duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <OptionButtons />
      </div>

      {/* Footer */}
      <div className={`w-full p-6 flex justify-between items-end transition-opacity duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Email on bottom left */}
        <div>
          <Email />
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
