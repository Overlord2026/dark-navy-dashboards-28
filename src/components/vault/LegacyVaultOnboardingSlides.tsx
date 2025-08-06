import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Video, 
  Heart, 
  Bot,
  Users,
  Lock,
  CheckCircle,
  Play,
  Download,
  HelpCircle
} from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  bgColor?: string;
}

export function LegacyVaultOnboardingSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: "Preserve Your Family's Legacy for Generations",
      subtitle: "All your vital documents, memories, and wisdom—protected and shared your way.",
      bgColor: "bg-gradient-to-r from-navy via-primary to-emerald",
      content: (
        <div className="text-center space-y-8">
          <div className="mx-auto w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
            <Shield className="h-16 w-16 text-white" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Secure Family Legacy Vault™
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              The only place your family needs to preserve everything that matters, across generations.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 text-white/80">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <span>Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Family Collaboration</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span>AI Legacy Avatar</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "What You Can Store",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Legal Documents</h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Wills, trusts, and POAs</li>
                  <li>• Insurance policies</li>
                  <li>• Property deeds and titles</li>
                  <li>• Financial account information</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Video className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Messages & Memories</h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Video messages for future milestones</li>
                  <li>• Audio recordings and stories</li>
                  <li>• Family photos and heirlooms</li>
                  <li>• Letters and personal notes</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <Heart className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Family Heritage</h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Heirloom recipes and traditions</li>
                  <li>• Family tree and genealogy</li>
                  <li>• Cultural artifacts and stories</li>
                  <li>• Important contact information</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gold-100 rounded-lg">
                    <Lock className="h-6 w-6 text-gold-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Secure Information</h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Encrypted account credentials</li>
                  <li>• Safe deposit box locations</li>
                  <li>• Emergency contact lists</li>
                  <li>• Medical directives</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "How It Works—Step by Step",
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { icon: FileText, title: "Upload Files", desc: "Add documents, images, and videos" },
              { icon: Users, title: "Set Permissions", desc: "Choose who can access each item" },
              { icon: CheckCircle, title: "Set Milestones", desc: "Schedule releases for future events" },
              { icon: Heart, title: "Invite Collaborators", desc: "Securely invite family and advisors" },
              { icon: Shield, title: "Audit & Track", desc: "Every action is recorded" }
            ].map((step, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted/50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">Complete Workflow</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Badge className="mt-1">1</Badge>
                <div>
                  <h4 className="font-medium">Upload Files</h4>
                  <p className="text-muted-foreground">Add your most important documents, images, and videos with secure encryption.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Badge className="mt-1">2</Badge>
                <div>
                  <h4 className="font-medium">Set Permissions</h4>
                  <p className="text-muted-foreground">Choose who can access each item—family, heirs, advisors, attorneys.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Badge className="mt-1">3</Badge>
                <div>
                  <h4 className="font-medium">Set Milestones</h4>
                  <p className="text-muted-foreground">Schedule messages or unlock documents at future dates or events (graduation, marriage, etc.).</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Badge className="mt-1">4</Badge>
                <div>
                  <h4 className="font-medium">Invite Collaborators</h4>
                  <p className="text-muted-foreground">Securely invite loved ones, advisors, or legal partners with role-based access.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Badge className="mt-1">5</Badge>
                <div>
                  <h4 className="font-medium">Audit & Track</h4>
                  <p className="text-muted-foreground">Every action is recorded with complete audit trails for your peace of mind.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Next-Level Legacy—AI Avatar",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-gold to-primary rounded-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Legacy Messenger</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Record video or audio messages that can be delivered at future milestones. 
                  Share your wisdom exactly when your family needs it most.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Graduation day messages</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Wedding day advice</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Birthday celebrations</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Video className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Event Triggers</h3>
                </div>
                <p className="text-muted-foreground">
                  Set up automatic delivery based on:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Specific dates</li>
                  <li>• Age milestones</li>
                  <li>• Life events</li>
                  <li>• Family occasions</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-gold/10 to-primary/10 border-gold/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-gold to-primary rounded-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Family Avatar</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Train your AI avatar to share your life story, answer questions, 
                  and provide guidance to future generations.
                </p>
                <div className="bg-white/50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-2">Sample Conversations:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="bg-primary/10 p-2 rounded">
                      <strong>Family:</strong> "Tell me about how you met Grandma"
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <strong>Avatar:</strong> "Well, it was 1952, and I was working at..."
                    </div>
                  </div>
                </div>
                <Button className="w-full gap-2">
                  <Play className="h-4 w-4" />
                  See Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Family & Professional Collaboration",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Family Members & Heirs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Invite family members</strong>
                      <p className="text-sm text-muted-foreground">Spouse, children, grandchildren</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Assign view/edit permissions</strong>
                      <p className="text-sm text-muted-foreground">Control access by item or category</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Collaborative organization</strong>
                      <p className="text-sm text-muted-foreground">Family can help add and organize content</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Professional Advisors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Attorneys & Estate Planners</strong>
                      <p className="text-sm text-muted-foreground">Help set up legal compliance rules</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Financial Advisors</strong>
                      <p className="text-sm text-muted-foreground">Access to relevant financial documents</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <strong>Trustees & Executors</strong>
                      <p className="text-sm text-muted-foreground">Controlled access for estate administration</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Complete Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 mb-4">
                  Every action in your vault is tracked and recorded for complete transparency and security.
                </p>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <div className="flex justify-between items-center text-sm">
                      <span><strong>Sarah Johnson</strong> viewed "Will Document"</span>
                      <span className="text-muted-foreground">2 hours ago</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <div className="flex justify-between items-center text-sm">
                      <span><strong>Attorney Smith</strong> updated access rules</span>
                      <span className="text-muted-foreground">Yesterday</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border border-blue-200">
                    <div className="flex justify-between items-center text-sm">
                      <span><strong>You</strong> uploaded "Family Photos"</span>
                      <span className="text-muted-foreground">3 days ago</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Permission Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">View</Badge>
                    <span className="text-sm">Can see and read items</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">Download</Badge>
                    <span className="text-sm">Can save copies locally</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">Share</Badge>
                    <span className="text-sm">Can invite others to view</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge>Admin</Badge>
                    <span className="text-sm">Can modify access rules</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Security and Compliance",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Encryption & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">End-to-end AES-256 encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Multi-factor authentication</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Secure cloud infrastructure</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Regular security audits</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Legal Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-blue-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Estate plan alignment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Legal document verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Compliance notifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Attorney integration</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Peace of Mind
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-purple-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Complete audit logs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Automatic backups</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Tamper-evident records</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">24/7 monitoring</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 7,
      title: "Getting Started",
      content: (
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">Quick Start Checklist</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to set up your Secure Family Legacy Vault and start preserving your legacy today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="rounded-full w-6 h-6 flex items-center justify-center text-xs">1</Badge>
                  Create Your Vault
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Set up your secure account</li>
                  <li>• Configure security preferences</li>
                  <li>• Complete identity verification</li>
                  <li>• Enable two-factor authentication</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="rounded-full w-6 h-6 flex items-center justify-center text-xs">2</Badge>
                  Upload & Organize Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Add your most important documents</li>
                  <li>• Upload family photos and videos</li>
                  <li>• Record personal messages</li>
                  <li>• Organize with tags and categories</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="rounded-full w-6 h-6 flex items-center justify-center text-xs">3</Badge>
                  Assign Roles & Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Define who can access what</li>
                  <li>• Set up family member roles</li>
                  <li>• Configure advisor permissions</li>
                  <li>• Review security settings</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="rounded-full w-6 h-6 flex items-center justify-center text-xs">4</Badge>
                  Set Milestone Triggers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Create event-based releases</li>
                  <li>• Schedule future deliveries</li>
                  <li>• Set up milestone notifications</li>
                  <li>• Test trigger configurations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="rounded-full w-6 h-6 flex items-center justify-center text-xs">5</Badge>
                  Invite Collaborators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Send secure invitations</li>
                  <li>• Include family and advisors</li>
                  <li>• Verify access permissions</li>
                  <li>• Monitor collaboration activity</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 bg-gradient-to-r from-primary/5 to-gold/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  You are Ready!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Your Secure Family Legacy Vault is now protecting and preserving your family&apos;s most important assets for generations to come.
                </p>
                <Button className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Using Your Vault
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Tips & Support",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Video Walkthroughs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Getting Started (5 min)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Complete overview of setting up your first vault
                    </p>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Play className="h-3 w-3" />
                      Watch Now
                    </Button>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">AI Avatar Setup (8 min)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Step-by-step guide to creating your legacy avatar
                    </p>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Play className="h-3 w-3" />
                      Watch Now
                    </Button>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Family Collaboration (6 min)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      How to invite and manage family member access
                    </p>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Play className="h-3 w-3" />
                      Watch Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Helpful Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    "How to Maximize Your Legacy Vault" Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Document Checklist for Families
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Shield className="h-4 w-4" />
                    Security Best Practices
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Users className="h-4 w-4" />
                    Family Sharing Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  FAQs & Live Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">How secure is my data?</h4>
                    <p className="text-sm text-muted-foreground">
                      We use bank-level AES-256 encryption and maintain SOC 2 compliance with multiple security audits annually.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Can I change permissions later?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can modify access permissions at any time through your vault settings.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">What happens in an emergency?</h4>
                    <p className="text-sm text-muted-foreground">
                      Emergency contacts can be granted immediate access through pre-configured protocols.
                    </p>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Need More Help?</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Our support team is available 24/7 to help with any questions.
                    </p>
                    <div className="space-y-2">
                      <Button className="w-full gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Start Live Chat
                      </Button>
                      <Button variant="outline" className="w-full">
                        Browse Full FAQ
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-background">
      <div className={`${currentSlideData.bgColor || 'bg-background'} ${currentSlideData.bgColor ? 'text-white' : ''}`}>
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Shield className={`h-6 w-6 ${currentSlideData.bgColor ? 'text-white' : 'text-primary'}`} />
              <span className="font-semibold">Secure Legacy Vault™</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-80">
                {currentSlide + 1} of {slides.length}
              </span>
            </div>
          </div>

          {/* Slide Content */}
          <div className="min-h-[600px]">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {currentSlideData.title}
              </h1>
              {currentSlideData.subtitle && (
                <p className="text-xl opacity-90 max-w-4xl">
                  {currentSlideData.subtitle}
                </p>
              )}
            </div>
            
            <div>
              {currentSlideData.content}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              onClick={prevSlide}
              variant={currentSlideData.bgColor ? "secondary" : "outline"}
              className="gap-2"
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide
                      ? (currentSlideData.bgColor ? 'bg-white' : 'bg-primary')
                      : (currentSlideData.bgColor ? 'bg-white/30' : 'bg-muted')
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextSlide}
              variant={currentSlideData.bgColor ? "secondary" : "outline"}
              className="gap-2"
              disabled={currentSlide === slides.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}