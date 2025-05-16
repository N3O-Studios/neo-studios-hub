
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Send, ArrowRight } from 'lucide-react';

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
      // For demo purposes, we'll generate 5 random chord progressions
      const generatedProgressions: ChordProgression[] = [];
      
      for (let i = 0; i < 5; i++) {
        const numChords = parseInt(barLength);
        const chords: Chord[] = [];
        
        // Generate emotion-based chord progression
        // This is simplified logic - in a real app, you'd use music theory rules
        // to create progressions that match the emotional tone
        
        let startingChord;
        let isMinor = false;
        
        // Determine mood from prompt
        const lowerPrompt = prompt.toLowerCase();
        if (lowerPrompt.includes('sad') || lowerPrompt.includes('melancholy') || 
            lowerPrompt.includes('dark') || lowerPrompt.includes('emotional')) {
          isMinor = true;
          startingChord = 'A';
        } else if (lowerPrompt.includes('happy') || lowerPrompt.includes('upbeat') || 
                  lowerPrompt.includes('bright') || lowerPrompt.includes('joyful')) {
          isMinor = false;
          startingChord = 'C';
        } else {
          // Random starter
          startingChord = rootNotes[Math.floor(Math.random() * 7)]; // More common keys
          isMinor = Math.random() > 0.5;
        }
        
        // Create first chord in progression
        chords.push({
          name: `${startingChord}${isMinor ? 'minor' : 'major'}`,
          notes: [`${startingChord}`, isMinor ? `${startingChord}m` : startingChord, isMinor ? 'E' : 'E'],
        });
        
        // Common chord progressions for different moods
        let progression: string[];
        if (isMinor) {
          // Minor progressions
          const minorProgressions = [
            ['i', 'VI', 'VII', 'i'],  // Am-F-G-Am
            ['i', 'iv', 'VII', 'III'], // Am-Dm-G-C
            ['i', 'VII', 'VI', 'VII'], // Am-G-F-G
            ['i', 'iv', 'v', 'i'],    // Am-Dm-Em-Am
          ];
          progression = minorProgressions[i % minorProgressions.length];
        } else {
          // Major progressions
          const majorProgressions = [
            ['I', 'V', 'vi', 'IV'],   // C-G-Am-F
            ['I', 'IV', 'V', 'I'],    // C-F-G-C
            ['I', 'vi', 'IV', 'V'],   // C-Am-F-G
            ['I', 'V', 'vi', 'iii'],  // C-G-Am-Em
          ];
          progression = majorProgressions[i % majorProgressions.length];
        }
        
        // Map roman numerals to actual chords (simplified)
        const rootIndex = rootNotes.findIndex(note => note === startingChord);
        for (let j = 1; j < numChords; j++) {
          const romanNumeral = progression[j % progression.length];
          
          let chordType = 'major';
          let chordRoot;
          
          if (romanNumeral.toLowerCase() === romanNumeral) {
            // Lowercase numeral = minor chord
            chordType = 'minor';
          }
          
          // Very simplified chord progression building
          // In a real app, this would be more sophisticated
          switch (romanNumeral.toUpperCase()) {
            case 'I': 
              chordRoot = rootNotes[rootIndex]; 
              break;
            case 'II': 
              chordRoot = rootNotes[(rootIndex + 2) % rootNotes.length]; 
              break;
            case 'III': 
              chordRoot = rootNotes[(rootIndex + 4) % rootNotes.length]; 
              break;
            case 'IV': 
              chordRoot = rootNotes[(rootIndex + 5) % rootNotes.length]; 
              break;
            case 'V': 
              chordRoot = rootNotes[(rootIndex + 7) % rootNotes.length]; 
              break;
            case 'VI': 
              chordRoot = rootNotes[(rootIndex + 9) % rootNotes.length]; 
              break;
            case 'VII': 
              chordRoot = rootNotes[(rootIndex + 11) % rootNotes.length]; 
              break;
            default: 
              chordRoot = rootNotes[rootIndex];
          }
          
          chords.push({
            name: `${chordRoot}${chordType}`,
            notes: [`${chordRoot}`, chordType === 'minor' ? `${chordRoot}m` : chordRoot],
          });
        }
        
        // Generate a description based on the progression
        let description;
        if (isMinor) {
          description = `${i + 1}. A ${barLength}-bar ${lowerPrompt.includes('sad') ? 'melancholic' : 'atmospheric'} progression in ${startingChord} minor`;
        } else {
          description = `${i + 1}. A ${barLength}-bar ${lowerPrompt.includes('happy') ? 'uplifting' : 'powerful'} progression in ${startingChord} major`;
        }
        
        generatedProgressions.push({
          chords,
          description
        });
      }
      
      setProgressions(generatedProgressions);
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
              onClick={generateChordProgressions}
              disabled={isGenerating || !prompt.trim() || !barLength}
              className="bg-[#9b87f5] text-white px-4 self-end hover:bg-[#7E69AB]"
            >
              <Send className="h-5 w-5 mr-2" />
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
