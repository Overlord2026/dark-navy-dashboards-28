import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Video, 
  Mic, 
  FileText, 
  Camera, 
  Shield, 
  Users, 
  Settings, 
  Play, 
  Eye,
  CheckCircle,
  Calendar,
  Lock,
  TreePine
} from 'lucide-react';

export const FamilyLegacyAvatarWireframe = () => {
  const [uploadProgress, setUploadProgress] = useState({
    voice: 0,
    video: 60,
    photos: 80,
    documents: 40,
    qa: 20
  });

  const [controls, setControls] = useState({
    allowQA: true,
    restrictTopics: false,
    auditLogging: true
  });

  const uploadSteps = [
    { icon: Mic, label: "Voice Recordings", progress: uploadProgress.voice, color: "text-gold-primary" },
    { icon: Video, label: "Video Messages", progress: uploadProgress.video, color: "text-aqua-primary" },
    { icon: Camera, label: "Photos & Memories", progress: uploadProgress.photos, color: "text-success" },
    { icon: FileText, label: "Key Documents", progress: uploadProgress.documents, color: "text-gold-primary" },
    { icon: Settings, label: "Q&A Training", progress: uploadProgress.qa, color: "text-aqua-primary" }
  ];

  const eventTriggers = [
    "Upon passing",
    "18th birthday of heir",
    "21st birthday of heir", 
    "Wedding anniversary",
    "Graduation milestone",
    "Custom date"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-primary via-surface to-navy-light p-4 relative overflow-hidden">
      {/* Watermark */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <TreePine className="w-96 h-96 text-gold-primary" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-12">
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4 leading-tight">
              Meet Your Family Vault Avatar
            </h1>
            <p className="text-xl md:text-2xl text-gold-primary font-semibold">
              Your Legacy, Alive for Generations
            </p>
          </div>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Create an AI-powered avatar that preserves your wisdom, stories, and guidance 
            for your family to access across generations.
          </p>
        </div>

        {/* Upload Content Steps */}
        <Card className="bg-card-bg/80 backdrop-blur border-border">
          <CardHeader>
            <CardTitle className="text-2xl text-text-primary flex items-center gap-3">
              <Upload className="text-gold-primary" />
              Build Your Avatar
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {uploadSteps.map((step, index) => (
              <div key={index} className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-surface flex items-center justify-center">
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  <h3 className="font-semibold text-text-primary">{step.label}</h3>
                </div>
                <div className="space-y-2">
                  <Progress value={step.progress} className="h-2" />
                  <p className="text-sm text-text-secondary text-center">{step.progress}% Complete</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  disabled={step.progress === 100}
                >
                  {step.progress === 100 ? <CheckCircle className="w-4 h-4 mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                  {step.progress === 100 ? 'Complete' : 'Upload'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Event-Gated Activation */}
          <Card className="bg-card-bg/80 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="text-xl text-text-primary flex items-center gap-3">
                <Calendar className="text-aqua-primary" />
                Activation Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-text-secondary">Choose when your avatar becomes available to heirs:</p>
              <div className="space-y-3">
                {eventTriggers.map((trigger, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
                    <span className="text-text-primary">{trigger}</span>
                    <Switch checked={index === 0} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Avatar Preview Panel */}
          <Card className="bg-card-bg/80 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="text-xl text-text-primary flex items-center gap-3">
                <Eye className="text-success" />
                Avatar Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video Preview */}
              <div className="aspect-video bg-surface rounded-lg flex items-center justify-center relative overflow-hidden">
                <Play className="w-12 h-12 text-gold-primary" />
                <Badge className="absolute top-3 right-3 bg-success text-white">AI Generated</Badge>
              </div>
              
              {/* Sample Responses */}
              <div className="space-y-3">
                <div className="p-4 bg-surface/50 rounded-lg">
                  <p className="text-text-secondary text-sm mb-2">Sample Question:</p>
                  <p className="text-text-primary">"What advice would you give me about starting my career?"</p>
                </div>
                <div className="p-4 bg-aqua-primary/10 rounded-lg border border-aqua-primary/20">
                  <p className="text-text-secondary text-sm mb-2">Avatar Response:</p>
                  <p className="text-text-primary">"Remember, success isn't just about the destination, but the journey and the people you help along the way..."</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secure Vault Integration */}
        <Card className="bg-gradient-to-r from-card-bg/80 to-surface/60 backdrop-blur border-border">
          <CardContent className="py-6">
            <div className="flex items-center justify-center gap-4 text-center">
              <Shield className="w-8 h-8 text-success" />
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Protected by BFO Family Vault Encryption</h3>
                <p className="text-text-secondary">Bank-grade security for your most precious memories</p>
              </div>
              <TreePine className="w-8 h-8 text-gold-primary" />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Consent & Control Toggles */}
          <Card className="bg-card-bg/80 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="text-xl text-text-primary flex items-center gap-3">
                <Lock className="text-gold-primary" />
                Privacy Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text-primary">Allow Q&A Interactions</h4>
                    <p className="text-sm text-text-secondary">Enable family members to ask questions</p>
                  </div>
                  <Switch 
                    checked={controls.allowQA}
                    onCheckedChange={(checked) => setControls(prev => ({ ...prev, allowQA: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text-primary">Restrict Sensitive Topics</h4>
                    <p className="text-sm text-text-secondary">Limit discussions on specified subjects</p>
                  </div>
                  <Switch 
                    checked={controls.restrictTopics}
                    onCheckedChange={(checked) => setControls(prev => ({ ...prev, restrictTopics: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text-primary">Enable Audit Logging</h4>
                    <p className="text-sm text-text-secondary">Track all avatar interactions</p>
                  </div>
                  <Switch 
                    checked={controls.auditLogging}
                    onCheckedChange={(checked) => setControls(prev => ({ ...prev, auditLogging: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Family Management Panel */}
          <Card className="bg-card-bg/80 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="text-xl text-text-primary flex items-center gap-3">
                <Users className="text-aqua-primary" />
                Family Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto p-4 flex-col">
                  <Users className="w-6 h-6 mb-2 text-aqua-primary" />
                  <span>Assign Heirs</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col">
                  <Upload className="w-6 h-6 mb-2 text-gold-primary" />
                  <span>Add Content</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col">
                  <FileText className="w-6 h-6 mb-2 text-success" />
                  <span>Access Logs</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col">
                  <Settings className="w-6 h-6 mb-2 text-text-secondary" />
                  <span>Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Avatar & Ethics */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-card-bg/80 backdrop-blur border-border">
            <CardContent className="py-8 text-center">
              <Button size="lg" className="bg-gold-primary text-navy-primary hover:bg-gold-primary/90 text-xl px-8 py-4">
                <Play className="w-6 h-6 mr-3" />
                Test Your Avatar
              </Button>
              <p className="text-text-secondary mt-4">
                Experience how your heirs will interact with your avatar
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card-bg/80 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="text-lg text-text-primary">Ethics & Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-text-secondary">
              <p>• AI responses are generated, not recordings</p>
              <p>• All interactions are logged and auditable</p>
              <p>• Family members are notified of AI nature</p>
              <p>• Content remains encrypted and private</p>
              <p>• You maintain full control over access</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};