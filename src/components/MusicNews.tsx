
import { useState, useEffect } from 'react';

const MusicNews = () => {
  const [news, setNews] = useState([
    {
      title: "AI Music Production Reaches New Heights",
      summary: "Latest developments in artificial intelligence are transforming music creation with real-time composition tools.",
      time: "2 hours ago"
    },
    {
      title: "Spatial Audio Technology Advances",
      summary: "New immersive audio formats are changing how we experience music across all platforms.",
      time: "5 hours ago"
    },
    {
      title: "Neural Networks for Music Mastering",
      summary: "Machine learning algorithms now provide professional-grade mastering capabilities to home producers.",
      time: "1 day ago"
    }
  ]);

  return (
    <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 p-6">
      <h3 className="text-lg font-semibold text-[#9b87f5] mb-4">Latest Music Tech News</h3>
      
      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="bg-[#2A2A30] p-4 rounded border border-[#9b87f5]/10">
            <h4 className="text-white font-medium mb-2">{item.title}</h4>
            <p className="text-white/70 text-sm mb-2">{item.summary}</p>
            <span className="text-[#9b87f5] text-xs">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicNews;
