import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Upload, 
  Play, 
  Download,
  FileText,
  Shield,
  AlertCircle,
  Users
} from 'lucide-react';

export const ComplianceQuickActions: React.FC = () => {
  const [showNewPolicy, setShowNewPolicy] = useState(false);
  const [showSECFiling, setShowSECFiling] = useState(false);

  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-primary/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">Common compliance tasks and tools</p>
        </div>
        <Badge variant="outline" className="bg-success/10 text-success">
          <Shield className="h-3 w-3 mr-1" />
          Audit Ready
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Dialog open={showNewPolicy} onOpenChange={setShowNewPolicy}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-primary/5">
              <Plus className="h-5 w-5" />
              <span className="text-xs">New Policy</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Policy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="policy-title">Policy Title</Label>
                <Input id="policy-title" placeholder="Enter policy title..." />
              </div>
              <div>
                <Label htmlFor="policy-type">Policy Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select policy type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="privacy">Privacy Policy</SelectItem>
                    <SelectItem value="conduct">Code of Conduct</SelectItem>
                    <SelectItem value="trading">Trading Policy</SelectItem>
                    <SelectItem value="supervision">Supervision Policy</SelectItem>
                    <SelectItem value="cybersecurity">Cybersecurity Policy</SelectItem>
                    <SelectItem value="aml">AML/BSA Policy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="policy-description">Description</Label>
                <Textarea id="policy-description" placeholder="Policy description..." />
              </div>
              <Button className="w-full btn-primary-gold">Create Policy</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showSECFiling} onOpenChange={setShowSECFiling}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-primary/5">
              <Upload className="h-5 w-5" />
              <span className="text-xs">SEC Filing</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload SEC Filing</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="filing-type">Filing Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select filing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adv">Form ADV</SelectItem>
                    <SelectItem value="adv-annual">ADV Annual Amendment</SelectItem>
                    <SelectItem value="adv-other">ADV Other-Than-Annual</SelectItem>
                    <SelectItem value="pf">Form PF</SelectItem>
                    <SelectItem value="13f">Form 13F</SelectItem>
                    <SelectItem value="crs">Form CRS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filing-period">Filing Period</Label>
                <Input type="date" id="filing-period" />
              </div>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag & drop your filing here or click to browse</p>
                <Button variant="outline" size="sm" className="mt-2">Browse Files</Button>
              </div>
              <Button className="w-full btn-primary-gold">Upload Filing</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-primary/5">
          <Play className="h-5 w-5" />
          <span className="text-xs">Mock Audit</span>
        </Button>

        <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-primary/5">
          <Download className="h-5 w-5" />
          <span className="text-xs">Export Log</span>
        </Button>
      </div>

      <div className="mt-4 pt-4 border-t border-primary/10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4 text-primary" />
              <span>24 Active Policies</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-warning" />
              <span>3 Pending Reviews</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-success" />
              <span>8 Staff Certified</span>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            Last Audit: May 2024
          </Badge>
        </div>
      </div>
    </div>
  );
};