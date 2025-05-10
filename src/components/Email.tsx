
import { useState } from 'react';

const Email = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative transition-all duration-300 ${isHovered ? 'email-hover' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Upper right angle */}
      <div className="absolute -top-3 -right-3 w-3 h-3 border-t-2 border-r-2 border-[#428ce2]"></div>
      
      <a 
        href="mailto:contact@n3ostudios.com" 
        className={`text-lg text-white tracking-wide ${
          isHovered ? 'text-glow text-secondary' : ''
        } transition-all duration-300`}
        aria-label="Email N3O Studios"
      >
        contact@n3ostudios.com
      </a>
      
      {/* Lower left angle */}
      <div className="absolute -bottom-3 -left-3 w-3 h-3 border-b-2 border-l-2 border-[#428ce2]"></div>
    </div>
  );
};

export default Email;
