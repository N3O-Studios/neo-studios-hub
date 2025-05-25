
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Send, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// Music theory data
const noteCircleOfFifths = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'Ab', 'Eb', 'Bb', 'F'];
const chromaticNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Get notes for a chord
const getChordNotes = (root: string, chordType: string): string[] => {
  const rootIndex = chromaticNotes.indexOf(root);
  if (rootIndex === -1) return [root];

  const getNote = (interval: number) => chromaticNotes[(rootIndex + interval) % 12];

  switch (chordType.toLowerCase()) {
    case 'maj':
    case 'major':
    case '':
      return [root, getNote(4), getNote(7)]; // 1, 3, 5
    case 'm':
    case 'min':
    case 'minor':
      return [root, getNote(3), getNote(7)]; // 1, b3, 5
    case 'dim':
      return [root, getNote(3), getNote(6)]; // 1, b3, b5
    case 'aug':
      return [root, getNote(4), getNote(8)]; // 1, 3, #5
    case '7':
      return [root, getNote(4), getNote(7), getNote(10)]; // 1, 3, 5, b7
    case 'maj7':
      return [root, getNote(4), getNote(7), getNote(11)]; // 1, 3, 5, 7
    case 'm7':
      return [root, getNote(3), getNote(7), getNote(10)]; // 1, b3, 5, b7
    default:
      return [root, getNote(4), getNote(7)];
  }
};

type Chord = {
  name: string;
  notes: string[];
  description?: string;
};

type ChordProgression = {
  chords: Chord[];
  description: string;
};

const ChordGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [barLength, setBarLength] = useState('4');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressions, setProgressions] = useState<ChordProgression[]>([]);

  const generateChordProgressions = async () => {
    if (!prompt.trim() || !barLength) return;
    
    setIsGenerating(true);
    
    try {
      const numChords = parseInt(barLength);
      
      // Use AI to generate chord progressions with specific music theory instructions
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { 
          message: `Generate 5 chord progressions for "${prompt}" that are ${barLength} chords long.

REQUIREMENTS:
- Use proper music theory and chord symbols
- For minor keys, use chords that actually exist in that key
- For "G minor", use chords like: Gm, Cm, Dm, Eb, F, Bb (not D flat major!)
- Show constituent notes for each chord (e.g., Gm = G, Bb, D)

Format as JSON array:
[
  {
    "description": "Melancholic G minor progression",
    "chords": [
      {"name": "Gm", "notes": ["G", "Bb", "D"]},
      {"name": "Cm", "notes": ["C", "Eb", "G"]},
      {"name": "F", "notes": ["F", "A", "C"]},
      {"name": "Bb", "notes": ["Bb", "D", "F"]}
    ]
  }
]

Generate progressions that match the mood and key requested.`,
          chatHistory: []
        }
      });
      
      if (error) {
        console.error('Error generating chords:', error);
        toast.error('Failed to generate chord progressions');
        return;
      }
      
      // Extract and parse JSON from response
      try {
        const response = data?.response || "";
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
          const jsonStr = jsonMatch[0];
          const parsedProgressions = JSON.parse(jsonStr);
          
          const validProgressions = parsedProgressions
            .filter((prog: any) => prog.description && Array.isArray(prog.chords))
            .map((prog: any, i: number) => ({
              description: prog.description.startsWith((i+1).toString()) 
                ? prog.description 
                : `${i+1}. ${prog.description}`,
              chords: prog.chords.map((chord: any) => ({
                name: chord.name || "Unknown",
                notes: Array.isArray(chord.notes) ? chord.notes : getChordNotes(chord.name?.charAt(0) || 'C', chord.name?.slice(1) || '')
              }))
            }));
          
          setProgressions(validProgressions);
        } else {
          // Fallback generation
          const fallbackProgressions = generateMusicTheoryProgressions(prompt, numChords);
          setProgressions(fallbackProgressions);
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        const fallbackProgressions = generateMusicTheoryProgressions(prompt, numChords);
        setProgressions(fallbackProgressions);
      }
    } catch (error) {
      console.error('Error in chord generation:', error);
      toast.error('Something went wrong. Using music theory fallback.');
      const fallbackProgressions = generateMusicTheoryProgressions(prompt, parseInt(barLength));
      setProgressions(fallbackProgressions);
    } finally {
      setIsGenerating(false);
    }
  };

  // Music theory-based fallback generator
  const generateMusicTheoryProgressions = (prompt: string, numChords: number): ChordProgression[] => {
    const progressions: ChordProgression[] = [];
    const lowerPrompt = prompt.toLowerCase();
    
    // Determine key and mode from prompt
    let key = 'C';
    let isMinor = false;
    
    // Key detection
    const keyMatches = lowerPrompt.match(/\b([a-g])\s*(minor|major|min|maj)?\b/i);
    if (keyMatches) {
      key = keyMatches[1].toUpperCase();
      isMinor = keyMatches[2]?.toLowerCase().includes('min') || false;
    }
    
    // Mood detection
    if (lowerPrompt.includes('minor') || lowerPrompt.includes('sad') || lowerPrompt.includes('melancholy') || lowerPrompt.includes('dark')) {
      isMinor = true;
    }

    for (let i = 0; i < 5; i++) {
      const chords: Chord[] = [];
      
      if (isMinor) {
        // Natural minor scale chord progressions
        const keyIndex = chromaticNotes.indexOf(key);
        const minorProgressions = [
          [0, 3, 5, 0], // i - III - v - i
          [0, 5, 7, 3], // i - v - VII - III
          [0, 7, 3, 5], // i - VII - III - v
          [0, 3, 7, 0], // i - III - VII - i
          [0, 5, 3, 7]  // i - v - III - VII
        ];
        
        const progression = minorProgressions[i % minorProgressions.length];
        const scaleNotes = [
          chromaticNotes[keyIndex], // i
          chromaticNotes[(keyIndex + 2) % 12], // ii
          chromaticNotes[(keyIndex + 3) % 12], // III
          chromaticNotes[(keyIndex + 5) % 12], // iv
          chromaticNotes[(keyIndex + 7) % 12], // v
          chromaticNotes[(keyIndex + 8) % 12], // VI
          chromaticNotes[(keyIndex + 10) % 12] // VII
        ];
        
        const chordTypes = ['m', '', 'm', '', '', 'm', ''];
        
        for (let j = 0; j < numChords; j++) {
          const scaleIndex = progression[j % progression.length];
          const chordRoot = scaleNotes[scaleIndex];
          const chordType = chordTypes[scaleIndex];
          const chordName = `${chordRoot}${chordType}`;
          
          chords.push({
            name: chordName,
            notes: getChordNotes(chordRoot, chordType)
          });
        }
        
        progressions.push({
          chords,
          description: `${i + 1}. ${key} minor progression - ${lowerPrompt.includes('mellow') ? 'mellow and introspective' : 'atmospheric'}`
        });
      } else {
        // Major scale chord progressions
        const keyIndex = chromaticNotes.indexOf(key);
        const majorProgressions = [
          [0, 5, 3, 4], // I - vi - IV - V
          [0, 4, 5, 0], // I - V - vi - I
          [0, 3, 4, 5], // I - IV - V - vi
          [0, 5, 4, 0], // I - vi - V - I
          [3, 5, 0, 4]  // IV - vi - I - V
        ];
        
        const progression = majorProgressions[i % majorProgressions.length];
        const scaleNotes = [
          chromaticNotes[keyIndex], // I
          chromaticNotes[(keyIndex + 2) % 12], // ii
          chromaticNotes[(keyIndex + 4) % 12], // iii
          chromaticNotes[(keyIndex + 5) % 12], // IV
          chromaticNotes[(keyIndex + 7) % 12], // V
          chromaticNotes[(keyIndex + 9) % 12], // vi
          chromaticNotes[(keyIndex + 11) % 12] // vii
        ];
        
        const chordTypes = ['', 'm', 'm', '', '', 'm', 'dim'];
        
        for (let j = 0; j < numChords; j++) {
          const scaleIndex = progression[j % progression.length];
          const chordRoot = scaleNotes[scaleIndex];
          const chordType = chordTypes[scaleIndex];
          const chordName = `${chordRoot}${chordType}`;
          
          chords.push({
            name: chordName,
            notes: getChordNotes(chordRoot, chordType)
          });
        }
        
        progressions.push({
          chords,
          description: `${i + 1}. ${key} major progression - ${lowerPrompt.includes('bright') ? 'bright and uplifting' : 'versatile'}`
        });
      }
    }
    
    return progressions;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1A1F2C] to-[#2A2A30] text-white font-light p-6">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#9b87f5]">Chord Generator</h1>
        
        <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 p-6 mb-8">
          <h2 className="text-xl mb-4">Describe what you're looking for</h2>
          <p className="text-gray-400 mb-6">
            Tell me what kind of chords you're looking for. For example: "Mellow intro in G minor" 
            or "Bright pop progression in C major"
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
                <Label htmlFor="r1" className="text-white">4 Chords</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="8" id="r2" />
                <Label htmlFor="r2" className="text-white">8 Chords</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="16" id="r3" />
                <Label htmlFor="r3" className="text-white">16 Chords</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex gap-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the chord progression you want... (e.g., 'mellow intro in G minor')"
              className="min-h-[100px] bg-[#2A2A30] border-none text-white resize-none focus-visible:ring-[#9b87f5]"
            />
            <Button
              onClick={generateChordProgressions}
              disabled={isGenerating || !prompt.trim() || !barLength}
              className="bg-[#9b87f5] text-white px-4 self-end hover:bg-[#7E69AB]"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Send className="h-5 w-5 mr-2" />
              )}
              Generate
            </Button>
          </div>
        </div>
        
        {progressions.length > 0 && (
          <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 p-6">
            <h2 className="text-xl mb-4">Generated Chord Progressions</h2>
            
            <div className="space-y-6">
              {progressions.map((progression, index) => (
                <div 
                  key={index}
                  className="bg-[#2A2A30] p-4 rounded-lg border border-[#9b87f5]/20 hover:border-[#9b87f5]/40 transition-all"
                >
                  <h3 className="text-lg font-bold text-[#9b87f5] mb-3">{progression.description}</h3>
                  
                  <div className="flex items-center flex-wrap gap-y-4">
                    {progression.chords.map((chord, chordIndex) => (
                      <div key={chordIndex} className="flex items-center">
                        <div className="bg-[#1A1F2C] px-4 py-3 rounded-md flex flex-col items-center min-w-[80px]">
                          <span className="text-lg font-bold text-[#9b87f5]">{chord.name}</span>
                          <div className="flex gap-1 mt-1">
                            {chord.notes.map((note, noteIndex) => (
                              <span 
                                key={noteIndex}
                                className="bg-[#2A2A30] px-2 py-0.5 rounded-md text-xs"
                              >
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                        {chordIndex < progression.chords.length - 1 && (
                          <ArrowRight className="mx-2 text-[#9b87f5]" />
                        )}
                      </div>
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
