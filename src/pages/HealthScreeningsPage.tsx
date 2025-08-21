import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calendar,
  FileText,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ConsentPassport } from '@/components/health/ConsentPassport';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  getScreenings, 
  isScreeningCovered, 
  ScreeningRule, 
  ScreeningFacts 
} from '@/features/health/screening/rules';
import { gateScreening, ScreeningGateResult } from '@/features/health/screening/api';

export default function HealthScreeningsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [screenings, setScreenings] = useState<ScreeningRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingScreening, setProcessingScreening] = useState<string | null>(null);
  
  // Mock user facts - in real app, get from user profile/FHIR
  const mockFacts: ScreeningFacts = {
    age: 52, // Mock age for demo
    sex: 'female',
    plan: {
      preventive_coverage: true,
      specialist_referral_required: false
    }
  };

  useEffect(() => {
    loadScreenings();
  }, []);

  const loadScreenings = () => {
    setIsLoading(true);
    try {
      const applicableScreenings = getScreenings(mockFacts);
      setScreenings(applicableScreenings);
    } catch (error) {
      console.error('Failed to load screenings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load screening recommendations."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReceipt = async (screening: ScreeningRule) => {
    setProcessingScreening(screening.key);
    
    try {
      // Check consent automatically in gateScreening
      const result: ScreeningGateResult = gateScreening(screening, mockFacts, true, 'care_coordination');
      
      toast({
        title: result.authorized ? "Screening Authorized" : "Screening Denied",
        description: `Health-RDS generated: ${result.reasons.join(', ')}`,
        variant: result.authorized ? "default" : "destructive"
      });
      
      console.info('screening.receipt_generated', {
        screening_key: screening.key,
        authorized: result.authorized,
        reasons: result.reasons,
        zk_predicates_used: Object.keys(result.zk_predicates).filter(k => result.zk_predicates[k])
      });
      
    } catch (error) {
      console.error('Failed to generate screening receipt:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate screening receipt."
      });
    } finally {
      setProcessingScreening(null);
    }
  };

  const getGuidelineGrade = (guideline: string): { variant: 'default' | 'secondary' | 'destructive' | 'outline', text: string } => {
    if (guideline.includes('Grade A')) {
      return { variant: 'default', text: 'Grade A' };
    } else if (guideline.includes('Grade B')) {
      return { variant: 'secondary', text: 'Grade B' };
    } else if (guideline.includes('Grade C')) {
      return { variant: 'outline', text: 'Grade C' };
    }
    return { variant: 'outline', text: 'Other' };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/healthcare')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Healthcare
          </Button>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading screening recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/healthcare')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Healthcare
        </Button>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Health Screenings</h1>
        <p className="text-muted-foreground mt-2">
          Evidence-based screening recommendations with coverage verification and compliance receipts.
        </p>
      </div>

      {/* ZK Privacy Notice */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Zero-Knowledge Privacy Protection
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Screening eligibility uses zero-knowledge age predicates (e.g., age≥45: true/false) 
                without storing actual dates of birth. Only boolean eligibility flags are recorded.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demographics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Screening Profile
          </CardTitle>
          <CardDescription>
            Current demographics and plan coverage for screening recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Coverage Type</p>
              <Badge variant={mockFacts.plan.preventive_coverage ? "default" : "destructive"}>
                {mockFacts.plan.preventive_coverage ? "Preventive Covered" : "No Preventive Coverage"}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Referral Requirements</p>
              <Badge variant={mockFacts.plan.specialist_referral_required ? "outline" : "secondary"}>
                {mockFacts.plan.specialist_referral_required ? "Referral Required" : "Direct Access"}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Eligible Screenings</p>
              <Badge variant="outline">
                {screenings.length} Recommended
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screenings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Screenings</CardTitle>
          <CardDescription>
            USPSTF-recommended screenings based on your current eligibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          {screenings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No screening recommendations available for current profile.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Screening</TableHead>
                  <TableHead>Guideline</TableHead>
                  <TableHead>Interval</TableHead>
                  <TableHead>Plan Coverage</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {screenings.map((screening) => {
                  const covered = isScreeningCovered(screening, mockFacts);
                  const grade = getGuidelineGrade(screening.guideline);
                  
                  return (
                    <TableRow key={screening.key}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{screening.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {screening.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={grade.variant}>
                          {grade.text}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{screening.interval}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {covered ? (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                          <span className="text-sm">
                            {covered ? "Covered" : "Not Covered"}
                          </span>
                          {screening.planCoverage.requires_referral && (
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateReceipt(screening)}
                          disabled={processingScreening === screening.key}
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          {processingScreening === screening.key 
                            ? "Generating..." 
                            : "Generate Receipt"
                          }
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Consent Management */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Consent Management</h2>
        <ConsentPassport />
      </div>

      {/* Guidelines Reference */}
      <Card className="border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/10">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              USPSTF Recommendation Grades
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div><strong>Grade A:</strong> High certainty of substantial net benefit</div>
              <div><strong>Grade B:</strong> High certainty of moderate net benefit</div>
              <div><strong>Grade C:</strong> Individual decision based on patient context</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}