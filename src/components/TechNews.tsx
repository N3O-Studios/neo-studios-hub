
import { useState, useEffect } from 'react';
import { ExternalLink, Clock } from 'lucide-react';

const TechNews = () => {
  const [news, setNews] = useState([
    {
      title: "AI Code Generation Breakthrough",
      summary: "New language models show unprecedented accuracy in generating production-ready code across multiple programming languages.",
      time: "1 hour ago",
      link: "https://techcrunch.com/ai-code-generation-2025"
    },
    {
      title: "WebAssembly Performance Gains",
      summary: "Latest WebAssembly updates deliver 40% performance improvements for compute-intensive web applications.",
      time: "4 hours ago",
      link: "https://developer.mozilla.org/webassembly-performance"
    },
    {
      title: "Quantum Computing Integration",
      summary: "Cloud providers now offer quantum computing APIs accessible through traditional programming interfaces.",
      time: "8 hours ago",
      link: "https://aws.amazon.com/quantum-computing-apis"
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
        <h3 className="text-lg font-semibold text-[#9b87f5]">Latest Tech News</h3>
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

export default TechNews;
