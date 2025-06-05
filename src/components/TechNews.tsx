
import { useState } from 'react';

const TechNews = () => {
  const [news, setNews] = useState([
    {
      title: "AI Code Generation Breakthrough",
      summary: "New language models show unprecedented accuracy in generating production-ready code across multiple programming languages.",
      time: "1 hour ago"
    },
    {
      title: "WebAssembly Performance Gains",
      summary: "Latest WebAssembly updates deliver 40% performance improvements for compute-intensive web applications.",
      time: "4 hours ago"
    },
    {
      title: "Quantum Computing Integration",
      summary: "Cloud providers now offer quantum computing APIs accessible through traditional programming interfaces.",
      time: "8 hours ago"
    }
  ]);

  return (
    <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 p-6">
      <h3 className="text-lg font-semibold text-[#9b87f5] mb-4">Latest Tech News</h3>
      
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

export default TechNews;
