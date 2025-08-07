import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Download, Copy, Check, Video, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export function DemoVideoSection() {
  const [copiedScript, setCopiedScript] = useState(false);

  const videoScript = `Hi, I'm Tony Gomes, founder of the Boutique Family Office Marketplace™. Imagine if every family—no matter their background—could access the tools and community once reserved for the 1%.

With our platform, families, advisors, and top professionals can create their own private digital office, collaborate, manage wealth, health, and legacy—all in one place.

We've brought together best-in-class security, AI-powered advice, and exclusive opportunities—plus a world-class education center with guides, athlete mentors, and celebrity advisors.

We're inviting a select group of founding members to join us now—before we open the doors to the world. If you want to be part of the revolution, claim your portal today!

Welcome to the future of family offices. Let's build your legacy, together.`;

  const copyScript = () => {
    navigator.clipboard.writeText(videoScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Demo Video & Scripts</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Ready-to-use video scripts and demo materials for investor presentations, media interviews, and Shark Tank pitches.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Video Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              2-Minute Demo Video
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-gold/10 rounded-lg flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
              >
                <Play className="h-8 w-8 ml-1" />
              </motion.button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Watch Demo
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="space-y-2">
              <Badge variant="secondary">Investor Ready</Badge>
              <Badge variant="secondary">Media Friendly</Badge>
              <Badge variant="secondary">Shark Tank Optimized</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Script Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Video Script
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg text-sm leading-relaxed max-h-64 overflow-y-auto">
              {videoScript}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyScript}
                className="flex-1"
              >
                {copiedScript ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Script
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              Perfect for HeyGen, video production, or live presentations. Duration: ~2 minutes.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Resources */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shark Tank Cut</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              90-second version optimized for TV pitch shows
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Script
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Investor Version</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Detailed 5-minute presentation for VCs and angels
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Script
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              30-second clips for LinkedIn, Twitter, Instagram
            </p>
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Scripts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}