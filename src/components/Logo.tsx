
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
        className="w-64 h-auto max-w-full" // Increased size from w-48 to w-64
      />
      <div className="text-xs text-gray-400 mt-1">© 2025 N3O Studios. All Rights Reserved.</div>
    </div>
  );
};

export default Logo;
