import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, Wand2, X } from 'lucide-react';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({ title: 'File too large', description: 'Please select an image under 10MB', variant: 'destructive' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReferenceImage = () => {
    setReferenceImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({ title: 'Prompt required', description: 'Please enter a prompt to generate an image', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-image-generator', {
        body: {
          prompt: prompt.trim(),
          referenceImage: referenceImage
        }
      });

      if (error) throw error;
      
      if (data?.success && data?.imageData) {
        setGeneratedImage(data.imageData);
        toast({ title: 'Image generated successfully!' });
      } else {
        throw new Error(data?.error || 'Failed to generate image');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: 'Image downloaded!' });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="bg-[#1A1F2C] border-[#9b87f5]/30">
        <CardHeader>
          <CardTitle className="text-[#9b87f5] flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Image Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label className="text-white/80">Prompt</Label>
            <Textarea
              placeholder="Describe the image you want to generate... (e.g., 'A futuristic city skyline at dusk, neon lights reflecting on water, in cyberpunk style')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-[#2A2A30] border-[#9b87f5]/30 text-white min-h-[100px] resize-none"
            />
          </div>

          {/* Reference Image Upload */}
          <div className="space-y-2">
            <Label className="text-white/80">Reference Image (Optional)</Label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Reference
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              {referenceImage && (
                <div className="flex items-center gap-2">
                  <span className="text-white/70 text-sm">Reference uploaded</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeReferenceImage}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            {referenceImage && (
              <div className="mt-2">
                <img
                  src={referenceImage}
                  alt="Reference"
                  className="w-32 h-32 object-cover rounded border border-[#9b87f5]/30"
                />
              </div>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateImage}
            disabled={isLoading}
            className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating Image...
              </div>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>

          {/* Generated Image Display */}
          {generatedImage && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white/80">Generated Image</Label>
                <Button
                  onClick={downloadImage}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="border border-[#9b87f5]/30 rounded-lg overflow-hidden">
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageGenerator;