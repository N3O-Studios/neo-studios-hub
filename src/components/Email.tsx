
import { useState } from 'react';

const Email = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`transition-all duration-300 ${isHovered ? 'email-hover' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src="/lovable-uploads/489bd192-6b01-47f8-9447-6ba36532bb5e.png" 
        alt="N3O Studios Email" 
        className="w-36 h-auto"
      />
    </div>
  );
};

export default Email;
