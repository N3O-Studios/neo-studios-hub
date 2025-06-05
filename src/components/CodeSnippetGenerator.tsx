
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

const CodeSnippetGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [snippet, setSnippet] = useState('');
  const [heading, setHeading] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateCode = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-code', {
        body: { prompt }
      });

      if (error) throw error;

      setHeading(data.heading);
      setSnippet(data.code);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 p-6">
      <h3 className="text-lg font-semibold text-[#9b87f5] mb-4">AI Code Generator</h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., React component for user authentication"
            className="bg-[#2A2A30] border-[#9b87f5]/20 text-white"
            onKeyDown={(e) => e.key === 'Enter' && generateCode()}
          />
          <Button
            onClick={generateCode}
            disabled={isLoading || !prompt.trim()}
            className="bg-[#9b87f5] hover:bg-[#7E69AB]"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </div>

        {heading && (
          <div>
            <h4 className="text-md font-medium text-white mb-3">{heading}</h4>
            <div className="bg-[#2A2A30] p-4 rounded border border-[#9b87f5]/10 overflow-x-auto">
              <pre className="text-white font-mono text-sm whitespace-pre-wrap">{snippet}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeSnippetGenerator;
