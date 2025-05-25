
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Send, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// Musical theory constants
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHORD_INTERVALS = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  maj7: [0, 4, 7, 11],
  min7: [0, 3, 7, 10],
  dom7: [0, 4, 7, 10],
  dim7: [0, 3, 6, 9],
  add9: [0, 4, 7, 14],
  '6': [0, 4, 7, 9]
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

  // Helper function to get chord notes based on root and type
  const getChordNotes = (root: string, chordType: string): string[] => {
    const rootIndex = NOTES.indexOf(root);
    const intervals = CHORD_INTERVALS[chordType as keyof typeof CHORD_INTERVALS] || CHORD_INTERVALS.major;
    
    return intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return NOTES[noteIndex];
    });
  };

  // Helper function to get relative minor/major
  const getRelativeKey = (key: string, isMinor: boolean): string => {
    const keyIndex = NOTES.indexOf(key);
    if (isMinor) {
      // Relative major is 3 semitones up
      return NOTES[(keyIndex + 3) % 12];
    } else {
      // Relative minor is 3 semitones down
      return NOTES[(keyIndex - 3 + 12) % 12];
    }
  };

  const generateChordProgressions = async () => {
    if (!prompt.trim() || !barLength) return;
    
    setIsGenerating(true);
    
    try {
      const numChords = parseInt(barLength);
      
      // Use AI to generate chord progressions with music theory guidance
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { 
          message: `As a music theory expert, generate exactly 5 chord progressions for "${prompt}" with ${barLength} chords each. 

Consider the following music theory principles:
- For minor keys (like G minor): common progressions include i-VII-VI-VII, i-iv-V-i, i-VI-III-VII
- For major keys: I-V-vi-IV, I-vi-IV-V, vi-IV-I-V are popular
- For mellow/atmospheric: use extended chords (maj7, min7, add9)
- For dark/emotional: prefer minor keys and diminished chords
- G minor scale: G, A, Bb, C, D, Eb, F
- G minor relative major: Bb major

Generate musically accurate progressions in the requested key. For each chord, provide the exact constituent notes.

Respond ONLY with a JSON array in this exact format:
[
  {
    "description": "A mellow 4-chord progression in G minor",
    "chords": [
      {"name": "Gm", "notes": ["G", "Bb", "D"]},
      {"name": "Cm", "notes": ["C", "Eb", "G"]},
      {"name": "Bb", "notes": ["Bb", "D", "F"]},
      {"name": "F", "notes": ["F", "A", "C"]}
    ]
  }
]

Generate 5 different progressions, all musically appropriate for "${prompt}".`
        }
      });
      
      if (error) {
        console.error('Error generating chords:', error);
        toast.error('Failed to generate chord progressions');
        return;
      }
      
      // Extract and parse the JSON response
      try {
        const response = data?.response || "";
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
          const jsonStr = jsonMatch[0];
          const parsedProgressions = JSON.parse(jsonStr);
          
          // Validate and enhance the progressions with correct music theory
          const validProgressions = parsedProgressions
            .filter((prog: any) => prog.description && Array.isArray(prog.chords))
            .slice(0, 5) // Ensure only 5 progressions
            .map((prog: any, i: number) => {
              // Validate and correct chord notes using music theory
              const correctedChords = prog.chords.map((chord: any) => {
                const chordName = chord.name || "C";
                let root = chordName.replace(/[^A-G#b]/g, '');
                let chordType = chordName.replace(root, '').toLowerCase();
                
                // Map chord type variations
                if (chordType === 'm' || chordType === 'min') chordType = 'minor';
                if (chordType === '' || chordType === 'maj') chordType = 'major';
                if (chordType === '7') chordType = 'dom7';
                
                // Generate correct notes based on music theory
                const correctNotes = getChordNotes(root, chordType);
                
                return {
                  name: chordName,
                  notes: correctNotes.length > 0 ? correctNotes : chord.notes || [root]
                };
              });

              return {
                description: `${i + 1}. ${prog.description}`,
                chords: correctedChords
              };
            });
          
          setProgressions(validProgressions);
        } else {
          // Fallback to music theory-based generation
          const fallbackProgressions = generateMusicTheoryProgressions(prompt, numChords);
          setProgressions(fallbackProgressions);
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        
        // Fallback to music theory-based generation
        const fallbackProgressions = generateMusicTheoryProgressions(prompt, numChords);
        setProgressions(fallbackProgressions);
      }
    } catch (error) {
      console.error('Error in chord generation:', error);
      toast.error('Something went wrong. Using music theory fallback.');
      
      // Use music theory fallback
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
    
    // Check for specific keys mentioned
    const keyMatches = lowerPrompt.match(/\b([a-g][#b]?)\s*(major|minor|min|maj)?\b/i);
    if (keyMatches) {
      key = keyMatches[1].toUpperCase();
      if (keyMatches[1].includes('#')) key = keyMatches[1];
      if (keyMatches[1].includes('b')) key = keyMatches[1];
      isMinor = keyMatches[2] && (keyMatches[2].toLowerCase().includes('min') || keyMatches[2].toLowerCase().includes('minor'));
    } else if (lowerPrompt.includes('minor') || lowerPrompt.includes('dark') || lowerPrompt.includes('sad')) {
      key = 'G'; // Default to G minor for mellow/dark requests
      isMinor = true;
    }
    
    // Define common progressions for different moods
    const minorProgressions = [
      ['i', 'VII', 'VI', 'VII'],    // Gm-F-Eb-F
      ['i', 'iv', 'VII', 'III'],    // Gm-Cm-F-Bb
      ['i', 'VI', 'III', 'VII'],    // Gm-Eb-Bb-F
      ['i', 'v', 'iv', 'i'],        // Gm-Dm-Cm-Gm
      ['i', 'VII', 'VI', 'iv']      // Gm-F-Eb-Cm
    ];
    
    const majorProgressions = [
      ['I', 'V', 'vi', 'IV'],       // C-G-Am-F
      ['I', 'vi', 'IV', 'V'],       // C-Am-F-G
      ['vi', 'IV', 'I', 'V'],       // Am-F-C-G
      ['I', 'IV', 'V', 'vi'],       // C-F-G-Am
      ['I', 'V', 'IV', 'I']         // C-G-F-C
    ];
    
    const progressionSet = isMinor ? minorProgressions : majorProgressions;
    
    for (let i = 0; i < 5; i++) {
      const progression = progressionSet[i % progressionSet.length];
      const chords: Chord[] = [];
      
      for (let j = 0; j < numChords; j++) {
        const degree = progression[j % progression.length];
        const { chordName, chordNotes } = getRomanNumeralChord(key, degree, isMinor);
        
        chords.push({
          name: chordName,
          notes: chordNotes
        });
      }
      
      const moodDesc = isMinor ? 
        (lowerPrompt.includes('mellow') ? 'mellow' : 'atmospheric') : 
        (lowerPrompt.includes('bright') ? 'bright' : 'uplifting');
      
      progressions.push({
        chords,
        description: `${i + 1}. A ${moodDesc} ${numChords}-chord progression in ${key} ${isMinor ? 'minor' : 'major'}`
      });
    }
    
    return progressions;
  };

  // Convert roman numeral to actual chord
  const getRomanNumeralChord = (key: string, romanNumeral: string, isMinor: boolean) => {
    const keyIndex = NOTES.indexOf(key);
    const scaleIntervals = isMinor ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
    
    let degree = 0;
    let chordType = 'major';
    
    switch (romanNumeral.toUpperCase()) {
      case 'I': degree = 0; break;
      case 'II': degree = 1; break;
      case 'III': degree = 2; break;
      case 'IV': degree = 3; break;
      case 'V': degree = 4; break;
      case 'VI': degree = 5; break;
      case 'VII': degree = 6; break;
    }
    
    // Determine if chord should be minor based on scale
    if (isMinor) {
      chordType = ['i', 'iv', 'v'].includes(romanNumeral.toLowerCase()) ? 'minor' : 'major';
    } else {
      chordType = ['ii', 'iii', 'vi'].includes(romanNumeral.toLowerCase()) ? 'minor' : 'major';
    }
    
    const root = NOTES[(keyIndex + scaleIntervals[degree]) % 12];
    const chordNotes = getChordNotes(root, chordType);
    const chordName = root + (chordType === 'minor' ? 'm' : '');
    
    return { chordName, chordNotes };
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1A1F2C] to-[#2A2A30] text-white font-light p-6">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 text-center text-[#9b87f5]">Chord Generator</h1>
        
        <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 p-6 mb-8">
          <h2 className="text-xl mb-4">Describe what you're looking for</h2>
          <p className="text-gray-400 mb-6">
            Tell me what kind of chords you're looking for. For example: "Mellow intro in G minor" 
            or "Dark atmospheric progression in A minor"
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
              placeholder="Describe the chord progression you want..."
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
                          <span className="text-lg font-bold text-[#9b87f5] mb-2">{chord.name}</span>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {chord.notes.map((note, noteIndex) => (
                              <span 
                                key={noteIndex}
                                className="bg-[#2A2A30] px-2 py-1 rounded-md text-xs text-gray-300"
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
        
        {/* Contact info */}
        <div className="text-center text-xs text-gray-400 mt-8">
          <p>© 2025 N3O Studios. All Rights Reserved.</p>
          <p className="mt-2">Phone Support: +44 20 7946 0958 (UK) | +1 555-NS-HELP (US)</p>
        </div>
      </div>
    </div>
  );
};

export default ChordGenerator;
