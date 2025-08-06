import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VaultWatermark } from './VaultWatermark';
import { PatentPendingBadge } from './PatentPendingBadge';
import { 
  Download, 
  FileText, 
  Video, 
  BookOpen, 
  Users, 
  Shield, 
  Presentation,
  ExternalLink,
  Eye,
  Play
} from 'lucide-react';

interface TrainingMaterial {
  id: string;
  type: 'onboarding_slides' | 'user_manual' | 'training_video' | 'quick_guide';
  title: string;
  description: string;
  targetAudience: 'all' | 'family' | 'advisors' | 'attorneys' | 'owners';
  downloadUrl?: string;
  viewUrl?: string;
  fileSize?: string;
  duration?: string;
  downloadCount: number;
  lastUpdated: string;
}

interface TrainingMaterialsManagerProps {
  vaultId: string;
  userRole: string;
}

const materialTypes = [
  {
    type: 'onboarding_slides',
    icon: Presentation,
    color: 'bg-blue-100 text-blue-700',
    title: 'Onboarding Presentation',
    description: 'Complete slide deck for vault setup and initial training'
  },
  {
    type: 'user_manual',
    icon: BookOpen,
    color: 'bg-emerald-100 text-emerald-700',
    title: 'User Manual',
    description: 'Comprehensive guide to all vault features and functionality'
  },
  {
    type: 'training_video',
    icon: Video,
    color: 'bg-purple-100 text-purple-700',
    title: 'Training Videos',
    description: 'Step-by-step video tutorials for common tasks'
  },
  {
    type: 'quick_guide',
    icon: FileText,
    color: 'bg-amber-100 text-amber-700',
    title: 'Quick Start Guide',
    description: 'Essential steps to get started with your vault'
  }
];

const audienceGroups = [
  { value: 'all', label: 'All Users', icon: Users },
  { value: 'family', label: 'Family Members', icon: Users },
  { value: 'advisors', label: 'Financial Advisors', icon: Shield },
  { value: 'attorneys', label: 'Legal Team', icon: Shield },
  { value: 'owners', label: 'Vault Owners', icon: Shield },
];

export const TrainingMaterialsManager: React.FC<TrainingMaterialsManagerProps> = ({
  vaultId,
  userRole
}) => {
  const { t } = useTranslation();
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

  // Mock training materials data
  const [materials] = useState<TrainingMaterial[]>([
    {
      id: '1',
      type: 'onboarding_slides',
      title: 'Secure Legacy Vault™ Introduction',
      description: 'Complete onboarding presentation covering vault setup, family management, and basic features',
      targetAudience: 'all',
      downloadUrl: '/materials/vault-intro-slides.pptx',
      viewUrl: '/materials/vault-intro-slides.pdf',
      fileSize: '15.2 MB',
      downloadCount: 247,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      type: 'user_manual',
      title: 'Family Member Guide',
      description: 'Detailed manual for family members on accessing documents, setting permissions, and using triggers',
      targetAudience: 'family',
      downloadUrl: '/materials/family-user-manual.pdf',
      fileSize: '8.7 MB',
      downloadCount: 156,
      lastUpdated: '2024-01-10'
    },
    {
      id: '3',
      type: 'training_video',
      title: 'Advisor Training Series',
      description: 'Video series for financial advisors on client onboarding, document management, and compliance',
      targetAudience: 'advisors',
      viewUrl: '/materials/advisor-training-playlist',
      duration: '45 mins',
      downloadCount: 89,
      lastUpdated: '2024-01-08'
    },
    {
      id: '4',
      type: 'quick_guide',
      title: 'Legacy Copilot™ Setup',
      description: 'Quick guide to setting up and training your AI avatar for family interactions',
      targetAudience: 'owners',
      downloadUrl: '/materials/legacy-copilot-guide.pdf',
      fileSize: '3.1 MB',
      downloadCount: 134,
      lastUpdated: '2024-01-12'
    },
    {
      id: '5',
      type: 'user_manual',
      title: 'Attorney Integration Manual',
      description: 'Complete guide for legal professionals on vault integration and compliance features',
      targetAudience: 'attorneys',
      downloadUrl: '/materials/attorney-manual.pdf',
      fileSize: '12.4 MB',
      downloadCount: 67,
      lastUpdated: '2024-01-05'
    }
  ]);

  const filteredMaterials = materials.filter(material => 
    selectedAudience === 'all' || material.targetAudience === selectedAudience || material.targetAudience === 'all'
  );

  const simulateDownload = async (materialId: string) => {
    setDownloadProgress(prev => ({ ...prev, [materialId]: 0 }));
    
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setDownloadProgress(prev => ({ ...prev, [materialId]: progress }));
    }
    
    // Simulate actual download
    setTimeout(() => {
      setDownloadProgress(prev => {
        const updated = { ...prev };
        delete updated[materialId];
        return updated;
      });
    }, 500);
  };

  const getMaterialIcon = (type: string) => {
    const materialType = materialTypes.find(mt => mt.type === type);
    return materialType?.icon || FileText;
  };

  const getMaterialColor = (type: string) => {
    const materialType = materialTypes.find(mt => mt.type === type);
    return materialType?.color || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6 relative">
      <VaultWatermark />
      <PatentPendingBadge />
      
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {t('vault.training.title', 'Training Materials & Resources')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('vault.training.description', 'Download comprehensive training materials for your team and family members')}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Audience Filter */}
          <div className="flex flex-wrap gap-2">
            {audienceGroups.map((group) => {
              const Icon = group.icon;
              return (
                <Button
                  key={group.value}
                  variant={selectedAudience === group.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedAudience(group.value)}
                  className="touch-target"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {group.label}
                </Button>
              );
            })}
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((material) => {
              const Icon = getMaterialIcon(material.type);
              const isDownloading = material.id in downloadProgress;
              const progress = downloadProgress[material.id] || 0;
              
              return (
                <Card key={material.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${getMaterialColor(material.type)}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {audienceGroups.find(g => g.value === material.targetAudience)?.label}
                      </Badge>
                    </div>
                    
                    {/* Content */}
                    <div>
                      <h3 className="font-medium mb-2">{material.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {material.description}
                      </p>
                      
                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        {material.fileSize && (
                          <span>{material.fileSize}</span>
                        )}
                        {material.duration && (
                          <span>{material.duration}</span>
                        )}
                        <span>{material.downloadCount} downloads</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    {isDownloading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Downloading...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      {material.downloadUrl && (
                        <Button
                          size="sm"
                          onClick={() => simulateDownload(material.id)}
                          disabled={isDownloading}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {t('common.download', 'Download')}
                        </Button>
                      )}
                      
                      {material.viewUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(material.viewUrl, '_blank')}
                          className={material.downloadUrl ? '' : 'flex-1'}
                        >
                          {material.type === 'training_video' ? (
                            <Play className="h-4 w-4 mr-2" />
                          ) : (
                            <Eye className="h-4 w-4 mr-2" />
                          )}
                          {material.type === 'training_video' ? 'Watch' : 'Preview'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">
                {t('vault.training.noMaterials', 'No training materials available')}
              </p>
              <p className="text-sm">
                {t('vault.training.noMaterialsDescription', 'Training materials for the selected audience will appear here when available')}
              </p>
            </div>
          )}

          {/* Training Overview */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Presentation className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">
                    {t('vault.training.scheduleSession', 'Schedule a Training Session')}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('vault.training.scheduleDescription', 'Need personalized training for your team? Schedule a one-on-one session with our vault specialists.')}
                  </p>
                  <Button size="sm" className="touch-target">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t('vault.training.bookSession', 'Book Training Session')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};