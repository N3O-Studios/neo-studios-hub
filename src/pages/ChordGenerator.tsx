
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';

// Define all available chord types
const chordTypes = [
  'major', 'minor', 'sus2', 'sus4', 'aug', 'dim',
  '7', 'maj7', 'min7', 'm7b5', 'dim7',
  '9', 'maj9', 'min9', '11', '13',
  'add9', 'madd9', '6', 'm6'
];

// Define all root notes
const rootNotes = [
  'C', 'C#', 'Db', 'D', 'D#', 'Eb', 
  'E', 'F', 'F#', 'Gb', 'G', 'G#', 
  'Ab', 'A', 'A#', 'Bb', 'B'
];

type ChordResult = {
  name: string;
  notes: string[];
  description?: string;
};

const ChordGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [barLength, setBarLength] = useState('4');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ChordResult[]>([]);

  const generateChords = async () => {
    if (!prompt.trim() || !barLength) return;
    
    setIsGenerating(true);
    
    // Simulated chord generation (in a real app, this would call an API)
    try {
      // For demo purposes, we'll generate some random chords
      const numberOfChords = Math.floor(Math.random() * 5) + 2; // 2-6 chords
      const generatedChords: ChordResult[] = [];
      
      for (let i = 0; i < numberOfChords; i++) {
        const randomRootIndex = Math.floor(Math.random() * rootNotes.length);
        const randomChordTypeIndex = Math.floor(Math.random() * chordTypes.length);
        
        const root = rootNotes[randomRootIndex];
        const type = chordTypes[randomChordTypeIndex];
        const name = `${root}${type}`;
        
        // Simulate chord notes (this would be calculated properly in a real app)
        const notes = [`${root}`, 'Some note', 'Another note'];
        
        generatedChords.push({
          name,
          notes,
          description: `A ${root} ${type} chord that would work well with your ${barLength}-bar progression.`
        });
      }
      
      setResults(generatedChords);
    } catch (error) {
      console.error('Error generating chords:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1A1F2C] to-[#2A2A30] text-white font-light p-6">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#9b87f5]">Chord Generator</h1>
        
        <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 p-6 mb-8">
          <h2 className="text-xl mb-4">Describe what you're looking for</h2>
          <p className="text-gray-400 mb-6">
            Tell me what kind of chords you're looking for. For example: "Jazzy chords for a mellow intro" 
            or "Dark and atmospheric chords in A minor"
          </p>
          
          {/* Bar length selection */}
          <div className="mb-6">
            <h3 className="text-lg mb-2">Length (required)</h3>
            <RadioGroup 
              defaultValue="4" 
              value={barLength} 
              onValueChange={setBarLength} 
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="r1" />
                <Label htmlFor="r1" className="text-white">4 Bars</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="8" id="r2" />
                <Label htmlFor="r2" className="text-white">8 Bars</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="16" id="r3" />
                <Label htmlFor="r3" className="text-white">16 Bars</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex gap-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the chord progression you want..."
              className="min-h-[100px] bg-[#2A2A30] border-none text-white resize-none focus-visible:ring-[#9b87f5]"
            />
            <Button
              onClick={generateChords}
              disabled={isGenerating || !prompt.trim() || !barLength}
              className="bg-[#9b87f5] text-white px-4 self-end hover:bg-[#7E69AB]"
            >
              <Send className="h-5 w-5 mr-2" />
              Generate
            </Button>
          </div>
        </div>
        
        {results.length > 0 && (
          <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 p-6">
            <h2 className="text-xl mb-4">{barLength}-Bar Chord Progression</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((chord, index) => (
                <div 
                  key={index}
                  className="bg-[#2A2A30] p-4 rounded-lg border border-[#9b87f5]/20 hover:border-[#9b87f5]/40 transition-all"
                >
                  <h3 className="text-lg font-bold text-[#9b87f5] mb-2">{chord.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{chord.description}</p>
                  <div className="flex gap-2">
                    {chord.notes.map((note, i) => (
                      <span 
                        key={i}
                        className="bg-[#1A1F2C] px-2 py-1 rounded-md text-sm"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          <Link to="/">
            <Button variant="outline" className="bg-transparent border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10">
              Back to Home
            </Button>
          </Link>
        </div>
        
        {/* Copyright at the bottom */}
        <div className="text-center text-xs text-gray-400 mt-8">
          © 2025 N3O Studios. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default ChordGenerator;
