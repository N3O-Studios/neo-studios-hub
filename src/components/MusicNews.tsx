
import { useState, useEffect } from 'react';
import { ExternalLink, Clock } from 'lucide-react';

const MusicNews = () => {
  const [news, setNews] = useState([
    {
      title: "AI Music Production Reaches New Heights",
      summary: "Latest developments in artificial intelligence are transforming music creation with real-time composition tools.",
      time: "2 hours ago",
      link: "https://musictech.com/ai-music-production-2025"
    },
    {
      title: "Spatial Audio Technology Advances",
      summary: "New immersive audio formats are changing how we experience music across all platforms.",
      time: "5 hours ago",
      link: "https://billboard.com/spatial-audio-advances"
    },
    {
      title: "Neural Networks for Music Mastering",
      summary: "Machine learning algorithms now provide professional-grade mastering capabilities to home producers.",
      time: "1 day ago",
      link: "https://sound.org/neural-mastering-2025"
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNews(prevNews => prevNews.map(item => ({
        ...item,
        time: updateTimeStamp(item.time)
      })));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const updateTimeStamp = (currentTime: string) => {
    if (currentTime.includes('hours ago')) {
      const hours = parseInt(currentTime.split(' ')[0]) + 1;
      return `${hours} hours ago`;
    }
    return currentTime;
  };

  return (
    <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="text-lg font-semibold text-[#9b87f5]">Latest Music Tech News</h3>
      </div>
      
      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="bg-[#2A2A30] p-4 rounded border border-[#9b87f5]/10 hover:border-[#9b87f5]/30 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-2 line-clamp-2">{item.title}</h4>
                <p className="text-white/70 text-sm mb-3 line-clamp-3">{item.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#9b87f5] text-xs">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#9b87f5] text-xs hover:text-white transition-colors"
                  >
                    Read more
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicNews;
