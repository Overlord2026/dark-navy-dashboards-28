import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Shield, 
  Flag, 
  Eye,
  CheckCircle,
  FileText
} from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';
import complianceFlags from '@/config/compliance/flags.json';

interface ComplianceFlag {
  type: string;
  severity: 'low' | 'medium' | 'high';
  line: number;
  text: string;
  keyword: string;
  description: string;
  timestamp: string;
}

interface TranscriptLine {
  id: string;
  speaker: string;
  text: string;
  timestamp: string;
  lineNumber: number;
}

interface TranscriptComplianceFlagsProps {
  transcript?: TranscriptLine[];
  meetingId: string;
  className?: string;
}

// Mock transcript for demo
const mockTranscript: TranscriptLine[] = [
  {
    id: '1',
    speaker: 'Advisor',
    text: 'Based on our analysis, I can guarantee you\'ll see at least 12% returns annually.',
    timestamp: '00:02:15',
    lineNumber: 1
  },
  {
    id: '2',
    speaker: 'Client',
    text: 'That sounds too good to be true. Are there any risks?',
    timestamp: '00:02:22',
    lineNumber: 2
  },
  {
    id: '3',
    speaker: 'Advisor',
    text: 'Trust me, this is a risk-free investment. You can\'t lose money with this strategy.',
    timestamp: '00:02:30',
    lineNumber: 3
  },
  {
    id: '4',
    speaker: 'Client',
    text: 'What about my tax situation?',
    timestamp: '00:02:45',
    lineNumber: 4
  },
  {
    id: '5',
    speaker: 'Advisor',
    text: 'Don\'t worry about taxes, you should definitely set up a trust structure to avoid them.',
    timestamp: '00:02:52',
    lineNumber: 5
  }
];

export function TranscriptComplianceFlags({ 
  transcript = mockTranscript, 
  meetingId,
  className 
}: TranscriptComplianceFlagsProps) {
  const [flags, setFlags] = useState<ComplianceFlag[]>([]);
  const [showReview, setShowReview] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    analyzeTranscript();
  }, [transcript]);

  const analyzeTranscript = () => {
    const detectedFlags: ComplianceFlag[] = [];

    transcript.forEach((line) => {
      const text = line.text.toLowerCase();

      // Check keywords
      complianceFlags.keywords.forEach((category) => {
        category.keywords.forEach((keyword) => {
          if (text.includes(keyword.toLowerCase())) {
            detectedFlags.push({
              type: category.category,
              severity: category.severity as 'low' | 'medium' | 'high',
              line: line.lineNumber,
              text: line.text,
              keyword,
              description: category.description,
              timestamp: line.timestamp
            });
          }
        });
      });

      // Check regex patterns
      complianceFlags.patterns.forEach((pattern) => {
        const regex = new RegExp(pattern.regex, 'gi');
        if (regex.test(text)) {
          detectedFlags.push({
            type: pattern.name,
            severity: pattern.severity as 'low' | 'medium' | 'high',
            line: line.lineNumber,
            text: line.text,
            keyword: 'pattern match',
            description: pattern.description,
            timestamp: line.timestamp
          });
        }
      });
    });

    setFlags(detectedFlags);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Flag className="h-4 w-4" />;
      case 'low':
        return <Eye className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const requestReview = () => {
    analytics.track('compliance_review_requested', {
      leadId: meetingId,
      flags: flags.map(f => ({ type: f.type, severity: f.severity, line: f.line })),
      timestamp: Date.now()
    });

    setShowReview(true);

    toast({
      title: "Compliance Review Requested",
      description: "A compliance review has been scheduled for this meeting transcript.",
    });
  };

  const highRiskFlags = flags.filter(f => f.severity === 'high');
  const mediumRiskFlags = flags.filter(f => f.severity === 'medium');
  const lowRiskFlags = flags.filter(f => f.severity === 'low');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Compliance Analysis
            {flags.length > 0 && (
              <Badge variant={highRiskFlags.length > 0 ? "destructive" : "secondary"}>
                {flags.length} flag{flags.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {flags.length === 0 ? (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              <span>No compliance issues detected</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{highRiskFlags.length}</div>
                  <div className="text-sm text-muted-foreground">High Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{mediumRiskFlags.length}</div>
                  <div className="text-sm text-muted-foreground">Medium Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{lowRiskFlags.length}</div>
                  <div className="text-sm text-muted-foreground">Low Risk</div>
                </div>
              </div>

              {/* Request Review Button */}
              {(highRiskFlags.length > 0 || mediumRiskFlags.length > 1) && !showReview && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Multiple compliance flags detected. Consider requesting a compliance review.
                  </AlertDescription>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={requestReview}
                    className="mt-2"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Request Review
                  </Button>
                </Alert>
              )}

              {showReview && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Compliance review has been requested. You will be notified when complete.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Flagged Lines */}
      {flags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Flagged Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {flags.map((flag, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg bg-muted/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge className={getSeverityColor(flag.severity)}>
                    {getSeverityIcon(flag.severity)}
                    <span className="ml-1 capitalize">{flag.severity} Risk</span>
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Line {flag.line}</span>
                    <span>•</span>
                    <span>{flag.timestamp}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    {flag.description}
                  </div>
                  <div className="text-sm bg-background p-2 rounded border">
                    "{flag.text}"
                  </div>
                  {flag.keyword !== 'pattern match' && (
                    <div className="text-xs text-muted-foreground">
                      Triggered by: "{flag.keyword}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}