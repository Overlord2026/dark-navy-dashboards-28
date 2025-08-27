import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { getAssetDetails, getAssetTypeDisplay } from '@/services/assetRegistry';
import { batchAnalyze, getAnalysisHistory } from '@/services/scanAnalyze';
import { 
  Shield, FileText, Upload, Scan, Brain, 
  Calendar, AlertTriangle, CheckCircle, 
  TrendingUp, Eye, Download 
} from 'lucide-react';
import { toast } from 'sonner';

export default function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [advice, setAdvice] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [analysisHistory, setAnalysisHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (id) {
      loadAssetData();
    }
  }, [id]);

  const loadAssetData = async () => {
    setLoading(true);
    try {
      const [details, history] = await Promise.all([
        getAssetDetails(id),
        getAnalysisHistory(id)
      ]);

      setAsset(details.asset);
      setDocuments(details.documents);
      setAdvice(details.advice);
      setReminders(details.reminders);
      setAnalysisHistory(history);
    } catch (error) {
      console.error('Failed to load asset details:', error);
      toast.error('Failed to load asset details');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!id) return;
    
    setAnalyzing(true);
    try {
      const results = await batchAnalyze(id);
      toast.success(`Analysis complete: ${results.scan_results.length} documents processed, ${results.generated_advice.length} recommendations generated`);
      
      // Reload data to show new analysis
      await loadAssetData();
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const getValueBandDisplay = (band: string) => {
    const displays = {
      'under_100k': 'Under $100K',
      '100k_500k': '$100K - $500K',
      '500k_1m': '$500K - $1M',
      '1m_5m': '$1M - $5M',
      '5m_10m': '$5M - $10M',
      'over_10m': 'Over $10M'
    };
    return displays[band] || 'Unspecified';
  };

  const getAdvicePriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getReminderTypeDisplay = (type: string) => {
    const displays = {
      'appraisal_due': 'Appraisal Due',
      'registration_renewal': 'Registration Renewal',
      'marine_layup': 'Marine Lay-up',
      'storm_alert': 'Storm Alert',
      'umbrella_check': 'Umbrella Review',
      'policy_renewal': 'Policy Renewal'
    };
    return displays[type] || type;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading asset details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Asset Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested asset could not be found.</p>
          <Button onClick={() => navigate('/family/assets')}>Back to Assets</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/family/assets')}>
              ← Back
            </Button>
            <h1 className="text-2xl font-bold">{asset.asset_name}</h1>
            <Badge variant="secondary">{getAssetTypeDisplay(asset.asset_type)}</Badge>
          </div>
          <p className="text-muted-foreground">Asset ID: {asset.id.slice(0, 8)}...</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleAnalyze}
            disabled={analyzing || documents.length === 0}
          >
            <Brain className="h-4 w-4 mr-2" />
            {analyzing ? 'Analyzing...' : 'Analyze Coverage'}
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Asset Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Asset Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Current Value</label>
              <p className="text-lg font-semibold">
                {asset.current_value_band ? getValueBandDisplay(asset.current_value_band) : 'Not specified'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <p className="text-lg font-semibold">
                {asset.location_zip_first3 ? `${asset.location_zip_first3}XX` : 'Not specified'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <p className="text-lg font-semibold capitalize">{asset.status}</p>
            </div>
            {asset.last_appraisal_date && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Appraisal</label>
                <p className="text-lg font-semibold">
                  {new Date(asset.last_appraisal_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {asset.next_appraisal_due && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Next Appraisal Due</label>
                <p className="text-lg font-semibold">
                  {new Date(asset.next_appraisal_due).toLocaleDateString()}
                </p>
              </div>
            )}
            {asset.acquisition_date && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Acquired</label>
                <p className="text-lg font-semibold">
                  {new Date(asset.acquisition_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="advice">Advice ({advice.length})</TabsTrigger>
          <TabsTrigger value="reminders">Reminders ({reminders.length})</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">{doc.document_name}</span>
                      </div>
                      <Badge variant="outline">{doc.document_type}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Uploaded: {new Date(doc.upload_date).toLocaleDateString()}</p>
                      {doc.expiry_date && (
                        <p>Expires: {new Date(doc.expiry_date).toLocaleDateString()}</p>
                      )}
                      {doc.file_size_bytes && (
                        <p>Size: {(doc.file_size_bytes / 1024 / 1024).toFixed(1)} MB</p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Scan className="h-4 w-4 mr-1" />
                        Scan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Documents</h3>
                <p className="text-muted-foreground mb-4">
                  Upload declarations, appraisals, or surveys to get coverage analysis.
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Document
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="advice" className="space-y-4">
          {advice.length > 0 ? (
            advice.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{item.advice_summary}</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {item.advice_type.replace('_', ' ')}
                      </p>
                    </div>
                    <Badge variant={getAdvicePriorityColor(item.priority_level)}>
                      {item.priority_level}
                    </Badge>
                  </div>
                  {item.recommended_actions && item.recommended_actions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Recommended Actions:</p>
                      <ul className="text-sm space-y-1">
                        {item.recommended_actions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                            {action.action || action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    Created: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Advice Available</h3>
                <p className="text-muted-foreground mb-4">
                  Upload asset documents and run analysis to receive personalized coverage advice.
                </p>
                <Button onClick={handleAnalyze} disabled={documents.length === 0}>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Coverage
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          {reminders.length > 0 ? (
            reminders.map((reminder) => (
              <Card key={reminder.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{reminder.title}</h3>
                      <p className="text-sm text-muted-foreground">{reminder.description}</p>
                    </div>
                    <Badge variant={reminder.status === 'pending' ? 'secondary' : 'outline'}>
                      {getReminderTypeDisplay(reminder.reminder_type)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Due: {new Date(reminder.reminder_date).toLocaleDateString()}</span>
                    <span>Status: {reminder.status}</span>
                    {reminder.sent_at && (
                      <span>Sent: {new Date(reminder.sent_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Reminders</h3>
                <p className="text-muted-foreground">
                  Reminders will appear here for appraisals, renewals, and other important dates.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {analysisHistory?.extractions.length > 0 ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Documents Analyzed</p>
                      <p className="text-2xl font-bold">{analysisHistory.extractions.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Advice Generated</p>
                      <p className="text-2xl font-bold">{analysisHistory.advice_history.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Analysis</p>
                      <p className="text-lg font-semibold">
                        {analysisHistory.extractions[0] ? 
                          new Date(analysisHistory.extractions[0].processed_at).toLocaleDateString() : 
                          'Never'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {analysisHistory.extractions.map((extraction) => (
                <Card key={extraction.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Document Analysis</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Confidence:</span>
                        <Progress 
                          value={extraction.confidence_score * 100} 
                          className="w-20" 
                        />
                        <span className="text-sm font-medium">
                          {Math.round(extraction.confidence_score * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    {extraction.extracted_data.coverage_bands && (
                      <div>
                        <p className="text-sm font-medium mb-2">Coverage Found:</p>
                        <div className="space-y-2">
                          {extraction.extracted_data.coverage_bands.map((coverage, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="capitalize">{coverage.coverage_type.replace('_', ' ')}</span>
                              <span>{coverage.limit_band}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-3">
                      Processed: {new Date(extraction.processed_at).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Scan className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Analysis History</h3>
                <p className="text-muted-foreground mb-4">
                  Run document analysis to see coverage extraction and gap analysis results.
                </p>
                <Button onClick={handleAnalyze} disabled={documents.length === 0}>
                  <Brain className="h-4 w-4 mr-2" />
                  Start Analysis
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="text-xs text-muted-foreground">
        Analysis creates Coverage-RDS, Advice-RDS, Explainability-RDS • Documents secured in Vault
      </div>
    </div>
  );
}