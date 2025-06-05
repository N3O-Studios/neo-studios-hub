
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

const ChordGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [chords, setChords] = useState<string[]>([]);
  const [heading, setHeading] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateChords = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-chords', {
        body: { prompt }
      });

      if (error) throw error;

      setHeading(data.heading);
      setChords(data.chords);
    } catch (error) {
      console.error('Error generating chords:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 p-6">
      <h3 className="text-lg font-semibold text-[#9b87f5] mb-4">AI Chord Generator</h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Mellow intro in A major"
            className="bg-[#2A2A30] border-[#9b87f5]/20 text-white"
            onKeyDown={(e) => e.key === 'Enter' && generateChords()}
          />
          <Button
            onClick={generateChords}
            disabled={isLoading || !prompt.trim()}
            className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </div>

        {heading && (
          <div>
            <h4 className="text-md font-medium text-white mb-3">{heading}</h4>
            <div className="grid grid-cols-1 gap-2">
              {chords.map((chord, index) => (
                <div key={index} className="bg-[#2A2A30] p-3 rounded border border-[#9b87f5]/10">
                  <span className="text-white font-mono">{chord}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChordGenerator;
