import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Download, Palette, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const DashboardImageGenerator = () => {
  const [prompt, setPrompt] = useState(
    "A modern, premium digital dashboard for a family office app. Centered on a deep navy and gold theme, features a welcoming banner with a gold tree logo, clean data cards (net worth, accounts, milestones), family vault snapshot, and motivational progress rings. Includes soft confetti, 3D icons, and subtle gold accents. Bright, elegant, mobile-first, with a sense of trust, legacy, and luxury."
  );
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageSize, setImageSize] = useState("1024x1024");
  const [imageQuality, setImageQuality] = useState("high");

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-dashboard-image', {
        body: {
          prompt: prompt.trim(),
          size: imageSize,
          quality: imageQuality
        }
      });

      if (error) {
        console.error('Error generating image:', error);
        toast.error('Failed to generate image. Make sure OpenAI API key is configured in Supabase.');
        return;
      }

      if (data?.success && data?.image) {
        setGeneratedImage(data.image);
        toast.success('Dashboard mockup generated successfully!');
      } else {
        toast.error('Failed to generate image');
      }
    } catch (error) {
      console.error('Error calling function:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    try {
      // Create download link for base64 image
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${generatedImage}`;
      link.download = `dashboard-mockup-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    }
  };

  const predefinedPrompts = [
    {
      title: "BFO Premium Dashboard",
      prompt: "A modern, premium digital dashboard for a family office app. Centered on a deep navy and gold theme, features a welcoming banner with a gold tree logo, clean data cards (net worth, accounts, milestones), family vault snapshot, and motivational progress rings. Includes soft confetti, 3D icons, and subtle gold accents. Bright, elegant, mobile-first, with a sense of trust, legacy, and luxury."
    },
    {
      title: "Mobile-First Design",
      prompt: "A sleek mobile dashboard interface for wealthy families, featuring navy blue and gold colors. Shows clean metric cards, goal progress circles, family vault section with gold tree watermark, and floating action buttons. Modern typography, subtle animations, premium feel with luxury fintech aesthetic."
    },
    {
      title: "Desktop Experience",
      prompt: "A comprehensive desktop dashboard for family office wealth management. Wide layout with navy background, gold accents, prominent welcome banner, 4-column metrics row, two-column main content with goals and vault sections. Professional, trustworthy, with subtle celebration elements and premium fintech styling."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Dashboard Design Generator
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Generate beautiful dashboard mockups using DALL·E for your Family Office app
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Image Size</label>
              <Select value={imageSize} onValueChange={setImageSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1024x1024">Square (1024x1024)</SelectItem>
                  <SelectItem value="1536x1024">Landscape (1536x1024)</SelectItem>
                  <SelectItem value="1024x1536">Portrait (1024x1536)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Quality</label>
              <Select value={imageQuality} onValueChange={setImageQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Quality</SelectItem>
                  <SelectItem value="medium">Medium Quality</SelectItem>
                  <SelectItem value="low">Low Quality (Faster)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Predefined Prompts */}
          <div>
            <label className="text-sm font-medium mb-2 block">Quick Presets</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {predefinedPrompts.map((preset, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(preset.prompt)}
                  className="text-left h-auto p-3"
                >
                  <div>
                    <div className="font-medium text-xs">{preset.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {preset.prompt.substring(0, 80)}...
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label htmlFor="prompt" className="text-sm font-medium mb-2 block">
              Custom Prompt
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your dashboard design..."
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tip: Be specific about colors (navy, gold), layout, and components for best results
            </p>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generateImage}
            disabled={isGenerating || !prompt.trim()}
            className="w-full gap-2"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Dashboard Design...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Dashboard Mockup
              </>
            )}
          </Button>

          {/* Generated Image */}
          {generatedImage && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Generated Dashboard Design</CardTitle>
                  <Button onClick={downloadImage} variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img 
                    src={`data:image/png;base64,${generatedImage}`}
                    alt="Generated dashboard mockup"
                    className="w-full rounded-lg border shadow-lg"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="text-orange-800 dark:text-orange-200">Setup Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-700 dark:text-orange-300 text-sm">
            To use this feature, add your OpenAI API key to Supabase Edge Function Secrets:
          </p>
          <ol className="list-decimal list-inside mt-2 space-y-1 text-sm text-orange-600 dark:text-orange-400">
            <li>Go to your Supabase Dashboard → Settings → Edge Functions</li>
            <li>Add a new secret: <code className="bg-orange-200 dark:bg-orange-900 px-1 rounded">OPENAI_API_KEY</code></li>
            <li>Enter your OpenAI API key as the value</li>
            <li>Deploy the edge function and start generating!</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};