import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Download, 
  Wand2, 
  Clock, 
  Eye,
  Sparkles,
  FileVideo,
  Palette
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { LOGOS, getLogoConfig } from '@/assets/logos';

interface StoryboardScene {
  id: number;
  timeframe: string;
  duration: string;
  title: string;
  description: string;
  prompt: string;
  textOverlay?: string;
  imageUrl?: string;
  isGenerating?: boolean;
}

export function ComplianceVideoStoryboard() {
  const [scenes, setScenes] = useState<StoryboardScene[]>([
    {
      id: 1,
      timeframe: "0:00-0:08",
      duration: "8 seconds",
      title: "Opening & Agent Login",
      description: "Professional insurance agent at modern desk opening laptop",
      prompt: "Professional insurance agent in business attire sitting at a clean modern desk, opening a sleek laptop computer, confident smile, office environment with certificates on wall, natural lighting, corporate setting, ultra high resolution",
      textOverlay: "Meet Sarah, Licensed Insurance Agent",
      imageUrl: undefined,
      isGenerating: false
    },
    {
      id: 2,
      timeframe: "0:08-0:18",
      duration: "10 seconds",
      title: "Dashboard Access",
      description: "Agent logging into Boutique Family Office™ compliance dashboard",
      prompt: "Close-up of laptop screen showing a professional insurance compliance dashboard login page with Boutique Family Office branding, navy blue and gold color scheme, clean modern UI design, login form visible, ultra high resolution",
      textOverlay: "Secure Dashboard Login",
      imageUrl: undefined,
      isGenerating: false
    },
    {
      id: 3,
      timeframe: "0:18-0:28",
      duration: "10 seconds", 
      title: "License Tracking",
      description: "Dashboard showing license status and renewal dates",
      prompt: "Insurance compliance dashboard showing license tracking interface, multiple state licenses displayed with renewal dates, progress bars showing CE completion status, navy blue and emerald green color scheme, professional UI design, ultra high resolution",
      textOverlay: "Track your licenses",
      imageUrl: undefined,
      isGenerating: false
    },
    {
      id: 4,
      timeframe: "0:28-0:38",
      duration: "10 seconds",
      title: "CE Upload Process",
      description: "Agent uploading continuing education certificates",
      prompt: "Insurance agent uploading CE certificates via drag-and-drop interface, PDF certificate icons being uploaded, progress indicators showing file processing, AI scanning document with subtle tech effects, modern dashboard interface, ultra high resolution",
      textOverlay: "upload CE",
      imageUrl: undefined,
      isGenerating: false
    },
    {
      id: 5,
      timeframe: "0:38-0:48",
      duration: "10 seconds",
      title: "Progress Bar Completion",
      description: "CE progress bar filling to 100% completion",
      prompt: "Close-up of compliance dashboard showing CE progress bar animating from 50% to 100% completion, emerald green progress bar, checkmarks appearing, completion status indicators, clean modern interface design, ultra high resolution",
      textOverlay: "stay compliant—automatically.",
      imageUrl: undefined,
      isGenerating: false
    },
    {
      id: 6,
      timeframe: "0:48-0:55",
      duration: "7 seconds",
      title: "Celebration with Confetti",
      description: "Agent celebrating with confetti animation",
      prompt: "Professional insurance agent celebrating at desk with golden confetti falling around them, laptop showing '100% Compliant!' message, joyful expression, office setting with certificates on wall, celebration atmosphere, ultra high resolution",
      textOverlay: "Congratulations! 100% Compliant",
      imageUrl: undefined,
      isGenerating: false
    },
    {
      id: 7,
      timeframe: "0:55-1:00",
      duration: "5 seconds",
      title: "BFO Logo & Tagline",
      description: "Boutique Family Office™ logo with final tagline",
      prompt: "Professional business logo presentation for Boutique Family Office with elegant tree icon, navy blue and gold color palette, clean typography, premium financial services branding, white background, ultra high resolution",
      textOverlay: "Your Compliance. Handled.",
      imageUrl: undefined,
      isGenerating: false
    }
  ]);

  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const generateSceneImage = async (scene: StoryboardScene) => {
    setScenes(prev => prev.map(s => 
      s.id === scene.id ? { ...s, isGenerating: true } : s
    ));

    try {
      const { data, error } = await supabase.functions.invoke('generate-storyboard-image', {
        body: {
          prompt: scene.prompt,
          size: "1024x1024",
          quality: "hd",
          style: "vivid"
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setScenes(prev => prev.map(s => 
        s.id === scene.id ? { 
          ...s, 
          imageUrl: data.imageUrl, 
          isGenerating: false 
        } : s
      ));

      toast.success(`Scene ${scene.id} generated successfully!`);
    } catch (error) {
      console.error('Error generating scene:', error);
      toast.error(`Failed to generate scene ${scene.id}`);
      setScenes(prev => prev.map(s => 
        s.id === scene.id ? { ...s, isGenerating: false } : s
      ));
    }
  };

  const generateAllScenes = async () => {
    setIsGeneratingAll(true);
    setGenerationProgress(0);

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      if (!scene.imageUrl) {
        await generateSceneImage(scene);
      }
      setGenerationProgress(((i + 1) / scenes.length) * 100);
      
      // Add delay between API calls to respect rate limits
      if (i < scenes.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setIsGeneratingAll(false);
    toast.success('All storyboard scenes generated!');
  };

  const downloadStoryboard = () => {
    const storyboardData = {
      title: "Insurance Agent Compliance - The Easy Way",
      duration: "60 seconds",
      scenes: scenes.map(scene => ({
        timeframe: scene.timeframe,
        title: scene.title,
        description: scene.description,
        textOverlay: scene.textOverlay,
        prompt: scene.prompt,
        imageUrl: scene.imageUrl
      })),
      brandingGuidelines: {
        colors: {
          primary: "#14213D", // Navy
          secondary: "#FFD700", // Gold  
          accent: "#169873"     // Emerald
        },
        typography: "Professional, clean, modern",
        style: "Corporate, trustworthy, efficient"
      },
      videoSpecifications: {
        resolution: "1920x1080",
        framerate: "30fps",
        format: "MP4",
        aspectRatio: "16:9"
      }
    };

    const blob = new Blob([JSON.stringify(storyboardData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-video-storyboard-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Storyboard downloaded successfully!');
  };

  const allScenesGenerated = scenes.every(scene => scene.imageUrl);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img 
            src={getLogoConfig('tree').src} 
            alt={getLogoConfig('tree').alt}
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-3xl font-bold text-navy">60-Second Video Storyboard</h1>
            <p className="text-emerald-600 font-semibold">Insurance Agent Compliance, the Easy Way</p>
          </div>
          <FileVideo className="h-8 w-8 text-emerald-600" />
        </div>
        
        <div className="flex justify-center gap-3">
          <Button 
            onClick={generateAllScenes}
            disabled={isGeneratingAll}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isGeneratingAll ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate All Scenes
              </>
            )}
          </Button>
          
          <Button 
            variant="outline"
            onClick={downloadStoryboard}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Storyboard
          </Button>
        </div>

        {isGeneratingAll && (
          <div className="max-w-md mx-auto">
            <Progress value={generationProgress} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              Generating scene {Math.ceil((generationProgress / 100) * scenes.length)} of {scenes.length}
            </p>
          </div>
        )}
      </div>

      {/* Video Overview */}
      <Card className="bg-gradient-to-r from-navy to-emerald-600 text-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <Clock className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">60s</div>
              <div className="text-sm opacity-90">Total Duration</div>
            </div>
            <div>
              <Sparkles className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">7</div>
              <div className="text-sm opacity-90">Key Scenes</div>
            </div>
            <div>
              <Palette className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">BFO</div>
              <div className="text-sm opacity-90">Branded</div>
            </div>
            <div>
              <Eye className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">HD</div>
              <div className="text-sm opacity-90">Quality</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Message */}
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">
            "Track your licenses, upload CE, stay compliant—automatically."
          </h2>
          <p className="text-emerald-700">
            A professional showcase of how Boutique Family Office™ makes insurance compliance effortless
          </p>
        </CardContent>
      </Card>

      {/* Storyboard Scenes */}
      <div className="space-y-6">
        {scenes.map((scene, index) => (
          <Card key={scene.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Badge className="bg-navy text-white">
                    Scene {scene.id}
                  </Badge>
                  <span>{scene.title}</span>
                  <Badge variant="outline">
                    {scene.timeframe}
                  </Badge>
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateSceneImage(scene)}
                  disabled={scene.isGenerating || isGeneratingAll}
                >
                  {scene.isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-emerald-600 mr-1" />
                      Generating...
                    </>
                  ) : scene.imageUrl ? (
                    <>
                      <Wand2 className="h-3 w-3 mr-1" />
                      Regenerate
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-3 w-3 mr-1" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Scene Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-navy mb-2">Scene Description</h3>
                    <p className="text-gray-600">{scene.description}</p>
                  </div>
                  
                  {scene.textOverlay && (
                    <div>
                      <h3 className="font-semibold text-navy mb-2">Text Overlay</h3>
                      <div className="bg-amber-50 p-3 rounded border border-amber-200">
                        <p className="text-amber-800 font-medium">"{scene.textOverlay}"</p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-navy mb-2">DALL·E Prompt</h3>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 border">
                      {scene.prompt}
                    </div>
                  </div>
                </div>

                {/* Generated Image */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-navy">Generated Scene</h3>
                  <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {scene.isGenerating ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Generating scene...</p>
                      </div>
                    ) : scene.imageUrl ? (
                      <img 
                        src={scene.imageUrl} 
                        alt={scene.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <Wand2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click "Generate" to create this scene</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Production Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="h-5 w-5 text-emerald-600" />
            Production Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Brand Colors</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-navy border"></div>
                  <span className="text-sm">Navy (#14213D) - Primary</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-gold border"></div>
                  <span className="text-sm">Gold (#FFD700) - Accent</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded bg-emerald-600 border"></div>
                  <span className="text-sm">Emerald (#169873) - Success</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Video Specifications</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Resolution: 1920x1080 (Full HD)</li>
                <li>• Frame Rate: 30fps</li>
                <li>• Aspect Ratio: 16:9</li>
                <li>• Format: MP4 (H.264)</li>
                <li>• Audio: Background music + voiceover</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Status */}
      {allScenesGenerated && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-emerald-900">Storyboard Complete!</h3>
            <p className="text-emerald-700 mb-4">
              All 7 scenes have been generated. Ready for video production.
            </p>
            <Button 
              onClick={downloadStoryboard}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Complete Storyboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}