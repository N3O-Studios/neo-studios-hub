
import { useState } from 'react';

const Logo = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src="/lovable-uploads/9aad7a26-d478-4099-b926-2f46ac9a3edd.png" 
        alt="N3O Studios Logo" 
        className="w-44 h-auto max-w-full" // Changed from w-54 to w-44 to make it smaller
      />
    </div>
  );
};

export default Logo;
