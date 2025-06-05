
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Music, Code } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <div className="flex justify-center gap-4 mb-6">
      <Link to="/">
        <Button
          variant={location.pathname === '/' ? 'default' : 'outline'}
          className={`${
            location.pathname === '/' 
              ? 'bg-[#9b87f5] text-white hover:bg-[#7E69AB]' 
              : 'bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10'
          } transition-all duration-300`}
        >
          DF
        </Button>
      </Link>
      
      <Link to="/music">
        <Button
          variant={location.pathname === '/music' ? 'default' : 'outline'}
          className={`${
            location.pathname === '/music' 
              ? 'bg-[#9b87f5] text-white hover:bg-[#7E69AB]' 
              : 'bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10'
          } transition-all duration-300`}
        >
          <Music className="h-4 w-4" />
        </Button>
      </Link>
      
      <Link to="/developer">
        <Button
          variant={location.pathname === '/developer' ? 'default' : 'outline'}
          className={`${
            location.pathname === '/developer' 
              ? 'bg-[#9b87f5] text-white hover:bg-[#7E69AB]' 
              : 'bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10'
          } transition-all duration-300`}
        >
          <Code className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

export default Navigation;
