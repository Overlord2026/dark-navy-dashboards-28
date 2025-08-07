import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Image, Video, Archive, Check, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExportItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: 'document' | 'image' | 'video' | 'archive';
  size?: string;
  format?: string;
}

export function PressKitExports() {
  const [downloadingItems, setDownloadingItems] = useState<Set<string>>(new Set());
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const exportItems: ExportItem[] = [
    {
      id: 'pitch-deck',
      name: 'Pitch Deck PDF',
      description: 'Complete investor presentation slides',
      icon: <FileText className="h-5 w-5" />,
      type: 'document',
      size: '2.4 MB',
      format: 'PDF'
    },
    {
      id: 'one-pager',
      name: 'Executive Summary',
      description: 'One-page company overview',
      icon: <FileText className="h-5 w-5" />,
      type: 'document',
      size: '480 KB',
      format: 'PDF'
    },
    {
      id: 'logos',
      name: 'Brand Assets',
      description: 'Logos, icons, and brand guidelines',
      icon: <Image className="h-5 w-5" />,
      type: 'archive',
      size: '12 MB',
      format: 'ZIP'
    },
    {
      id: 'screenshots',
      name: 'Platform Screenshots',
      description: 'High-resolution UI screenshots',
      icon: <Image className="h-5 w-5" />,
      type: 'archive',
      size: '8.2 MB',
      format: 'ZIP'
    },
    {
      id: 'demo-video',
      name: 'Demo Video',
      description: '2-minute platform demonstration',
      icon: <Video className="h-5 w-5" />,
      type: 'video',
      size: '45 MB',
      format: 'MP4'
    },
    {
      id: 'founder-bios',
      name: 'Founder Biographies',
      description: 'Leadership team profiles and photos',
      icon: <FileText className="h-5 w-5" />,
      type: 'document',
      size: '1.2 MB',
      format: 'PDF'
    },
    {
      id: 'press-release',
      name: 'Press Release Template',
      description: 'Ready-to-publish announcement',
      icon: <FileText className="h-5 w-5" />,
      type: 'document',
      size: '320 KB',
      format: 'DOCX'
    },
    {
      id: 'complete-kit',
      name: 'Complete Press Kit',
      description: 'All assets in one package',
      icon: <Archive className="h-5 w-5" />,
      type: 'archive',
      size: '68 MB',
      format: 'ZIP'
    }
  ];

  const pressReleaseText = `FOR IMMEDIATE RELEASE

Boutique Family Office Marketplace™ Launches: Democratizing the 1% Experience for Every Family

[City, Date] – Boutique Family Office Marketplace™, a first-of-its-kind digital platform, today announced the launch of its all-in-one solution for managing family wealth, health, and legacy. Built by industry veterans and backed by proprietary technology, the platform enables families, advisors, athletes, and professionals to access world-class tools, education, and collaboration—previously reserved for billionaires.

"For too long, the best resources have been locked away for the ultra-wealthy. We're changing that," said Tony Gomes, Founder and CEO. "Now, every family can build their own legacy and collaborate with the top minds in health and wealth, all in one secure platform."

Key features include:
• Persona-based dashboards for every stakeholder
• AI copilot and compliance engine
• Secure Family Legacy Vault™ with event-based triggers
• Viral onboarding and equity for top VIPs and pros

"We're inviting a select group of founding members—including athletes, executives, and elite firms—to join us for early access. Our mission: bring world-class family office services to millions worldwide."

Learn more at [your launch URL] or request a demo at [contact email].

Media Contact:
Tony Gomes, CEO
Tony@awmfl.com`;

  const handleDownload = async (itemId: string) => {
    setDownloadingItems(prev => new Set(prev).add(itemId));
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setDownloadingItems(prev => {
      const updated = new Set(prev);
      updated.delete(itemId);
      return updated;
    });
  };

  const copyPressRelease = () => {
    navigator.clipboard.writeText(pressReleaseText);
    setCopiedText('press-release');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'document': return 'text-blue-500';
      case 'image': return 'text-green-500';
      case 'video': return 'text-purple-500';
      case 'archive': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Press Kit & Exports</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Professional media assets ready for investors, journalists, and strategic partners.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          onClick={() => handleDownload('complete-kit')}
          disabled={downloadingItems.has('complete-kit')}
          className="bg-gold hover:bg-gold/90 text-gold-foreground"
        >
          {downloadingItems.has('complete-kit') ? (
            <>Preparing...</>
          ) : (
            <>
              <Archive className="h-4 w-4 mr-2" />
              Download Complete Kit
            </>
          )}
        </Button>
        
        <Button variant="outline" onClick={copyPressRelease}>
          {copiedText === 'press-release' ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Press Release
            </>
          )}
        </Button>
      </div>

      {/* Export Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exportItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={getIconColor(item.type)}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-base">{item.name}</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.format}
                      </Badge>
                      {item.size && (
                        <Badge variant="outline" className="text-xs">
                          {item.size}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleDownload(item.id)}
                  disabled={downloadingItems.has(item.id)}
                >
                  {downloadingItems.has(item.id) ? (
                    <>Downloading...</>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Press Release Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Press Release Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-6 rounded-lg text-sm leading-relaxed max-h-64 overflow-y-auto font-mono">
            <pre className="whitespace-pre-wrap">{pressReleaseText}</pre>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={copyPressRelease}>
              {copiedText === 'press-release' ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Text
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => handleDownload('press-release')}>
              <Download className="h-4 w-4 mr-2" />
              Download DOCX
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}