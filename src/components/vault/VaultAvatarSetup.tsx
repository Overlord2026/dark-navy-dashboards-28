import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bot, Upload, Mic, Video, Play, Pause, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface VaultAvatarSetupProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export function VaultAvatarSetup({ onClose, onSuccess }: VaultAvatarSetupProps) {
  const [step, setStep] = useState(1);
  const [avatarData, setAvatarData] = useState({
    name: '',
    personalityTraits: [] as string[],
    voiceSample: null as File | null,
    trainingVideo: null as File | null,
    keyMessages: [] as string[]
  });
  const [newTrait, setNewTrait] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const addPersonalityTrait = () => {
    if (newTrait.trim() && !avatarData.personalityTraits.includes(newTrait.trim())) {
      setAvatarData(prev => ({
        ...prev,
        personalityTraits: [...prev.personalityTraits, newTrait.trim()]
      }));
      setNewTrait('');
    }
  };

  const addKeyMessage = () => {
    if (newMessage.trim()) {
      setAvatarData(prev => ({
        ...prev,
        keyMessages: [...prev.keyMessages, newMessage.trim()]
      }));
      setNewMessage('');
    }
  };

  const handleVoiceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAvatarData(prev => ({ ...prev, voiceSample: file }));
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setAvatarData(prev => ({ ...prev, trainingVideo: file }));
    }
  };

  const sampleQuestions = [
    "What values were most important to you in life?",
    "What advice would you give to your children/grandchildren?",
    "What was your proudest achievement?",
    "How did you and your spouse/partner meet?",
    "What traditions should the family continue?",
    "What lessons did you learn from your biggest challenges?",
    "What would you want your legacy to be?",
    "What stories from your childhood shaped who you became?"
  ];

  if (onClose) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Create Your Legacy Avatar
            </DialogTitle>
          </DialogHeader>
          <VaultAvatarSetupContent />
        </DialogContent>
      </Dialog>
    );
  }

  return <VaultAvatarSetupContent />;

  function VaultAvatarSetupContent() {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-gold to-primary rounded-full flex items-center justify-center">
            <Bot className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold">Create Your AI Legacy Avatar</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preserve your wisdom, stories, and personality for future generations. 
            Your AI avatar will be able to share your life experiences and values with your family.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= i
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i}
              </div>
              {i < 4 && (
                <div
                  className={`w-12 h-1 ${
                    step > i ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="avatar-name">Avatar Name</Label>
                <Input
                  id="avatar-name"
                  value={avatarData.name}
                  onChange={(e) => setAvatarData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Grandpa Joe, Mom, Dad"
                />
              </div>

              <div>
                <Label>Personality Traits</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newTrait}
                    onChange={(e) => setNewTrait(e.target.value)}
                    placeholder="e.g., wise, funny, caring"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPersonalityTrait())}
                  />
                  <Button type="button" onClick={addPersonalityTrait} variant="outline">
                    Add
                  </Button>
                </div>
                {avatarData.personalityTraits.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {avatarData.personalityTraits.map((trait) => (
                      <Badge key={trait} variant="secondary">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Voice Training</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Upload Voice Sample</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    onChange={handleVoiceUpload}
                    accept="audio/*"
                    className="hidden"
                    id="voice-upload"
                  />
                  <label
                    htmlFor="voice-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <Mic className="h-8 w-8 mb-4 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Upload an audio recording (at least 2 minutes recommended)
                    </p>
                  </label>
                </div>
                {avatarData.voiceSample && (
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{avatarData.voiceSample.name}</p>
                  </div>
                )}
              </div>

              <div>
                <Label>Or Record Now</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Button
                    type="button"
                    variant={isRecording ? "destructive" : "outline"}
                    onClick={() => setIsRecording(!isRecording)}
                    className="gap-2"
                  >
                    {isRecording ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                  {isRecording && (
                    <span className="text-sm text-muted-foreground animate-pulse">
                      Recording... {Math.floor(Math.random() * 60)}s
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Video Training</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Training Video</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    onChange={handleVideoUpload}
                    accept="video/*"
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <Video className="h-8 w-8 mb-4 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Upload a video of yourself speaking (5-10 minutes recommended)
                    </p>
                  </label>
                </div>
                {avatarData.trainingVideo && (
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{avatarData.trainingVideo.name}</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Suggested Topics to Cover:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Share your life story and key experiences</li>
                  <li>• Discuss your values and beliefs</li>
                  <li>• Talk about family traditions and memories</li>
                  <li>• Give advice to future generations</li>
                  <li>• Share what you're most proud of</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Key Messages & Wisdom</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Important Messages</Label>
                <div className="space-y-2 mt-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a key message or piece of wisdom you want to share..."
                    rows={3}
                  />
                  <Button type="button" onClick={addKeyMessage} variant="outline" className="w-full">
                    Add Message
                  </Button>
                </div>
                {avatarData.keyMessages.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {avatarData.keyMessages.map((message, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gold-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Sample Questions Your Avatar Can Answer:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {sampleQuestions.map((question, index) => (
                    <div key={index} className="text-muted-foreground">
                      • {question}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : onClose?.()}
          >
            {step === 1 ? 'Cancel' : 'Previous'}
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (step < 4) {
                setStep(step + 1);
              } else {
                // Create avatar
                onSuccess?.();
              }
            }}
          >
            {step === 4 ? 'Create Avatar' : 'Next'}
          </Button>
        </div>
      </div>
    );
  }
}