
import { useState } from 'react';

const Email = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Upper right angle */}
      <div className="absolute -top-3 -right-3 w-3 h-3 border-t-2 border-r-2 border-[#428ce2]"></div>
      
      <div className="flex flex-col items-start">
        <span className="text-sm text-white/80">Contact:</span>
        <a 
          href="mailto:n3ostudios@gmail.com" 
          className="text-lg text-white tracking-wide transition-all duration-300"
          aria-label="Email N3O Studios"
        >
          n3ostudios@gmail.com
        </a>
      </div>
      
      {/* Lower left angle */}
      <div className="absolute -bottom-3 -left-3 w-3 h-3 border-b-2 border-l-2 border-[#428ce2]"></div>
    </div>
  );
};

export default Email;
