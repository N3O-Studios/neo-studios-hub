
import { useState } from 'react';

const Email = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`transition-all duration-300 ${isHovered ? 'email-hover' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a 
        href="mailto:contact@n3ostudios.com" 
        className={`text-lg text-white tracking-wide ${
          isHovered ? 'text-glow text-secondary' : ''
        } transition-all duration-300`}
        aria-label="Email N3O Studios"
      >
        contact@n3ostudios.com
      </a>
    </div>
  );
};

export default Email;
