import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAssets, getAssetsSummary, getAssetTypeDisplay } from '@/services/assetRegistry';
import { getRemindersdashboard } from '@/services/reminders';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Home, Car, Anchor, Palette, Gem, 
  Umbrella, Waves, Mountain, Building, 
  Plus, Calendar, AlertTriangle, TrendingUp 
} from 'lucide-react';

export function AssetsPage() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [reminders, setReminders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    loadAssetsData();
  }, [selectedType]);

  const loadAssetsData = async () => {
    setLoading(true);
    try {
      const [assetsData, summaryData, remindersData] = await Promise.all([
        getAssets(selectedType !== 'all' ? { asset_type: selectedType } : {}),
        getAssetsSummary(),
        getRemindersdashboard()
      ]);

      setAssets(assetsData);
      setSummary(summaryData);
      setReminders(remindersData);
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssetIcon = (type: string) => {
    const icons = {
      'home_high_value': Home,
      'exotic_auto': Car,
      'marine_boat': Anchor,
      'marine_yacht': Anchor,
      'fine_art': Palette,
      'jewelry': Gem,
      'umbrella': Umbrella,
      'flood': Waves,
      'earthquake': Mountain,
      'landlord_property': Building,
      'entity_owned': Building
    };
    return icons[type] || Shield;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'sold': return 'secondary';
      case 'disposed': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading assets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bfo-navy">
      <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Asset Registry</h1>
          <p className="text-white/70">High Net Worth Assets & Coverage</p>
        </div>
        <Button onClick={() => navigate('/family/assets/new')} className="bg-bfo-gold text-black hover:bg-bfo-gold/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70">Total Assets</p>
                  <p className="text-2xl font-bold text-white">{summary.total_assets}</p>
                </div>
                <Shield className="h-8 w-8 text-bfo-gold" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70">Portfolio Value</p>
                  <p className="text-2xl font-bold text-white">{summary.total_value_band}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70">Reminders</p>
                  <p className="text-2xl font-bold text-white">{reminders?.upcoming_count || 0}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/70">Action Items</p>
                  <p className="text-2xl font-bold text-white">{summary.pending_advice}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="assets" className="w-full">
        <TabsList>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
          <TabsTrigger value="advice">Advice</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <div className="flex gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="home_high_value">High-Value Home</SelectItem>
                <SelectItem value="exotic_auto">Exotic Auto</SelectItem>
                <SelectItem value="marine_boat">Boat</SelectItem>
                <SelectItem value="marine_yacht">Yacht</SelectItem>
                <SelectItem value="fine_art">Fine Art</SelectItem>
                <SelectItem value="jewelry">Jewelry</SelectItem>
                <SelectItem value="umbrella">Umbrella</SelectItem>
                <SelectItem value="cyber">Cyber Liability</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset) => {
              const Icon = getAssetIcon(asset.asset_type);
              return (
                <Card 
                  key={asset.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20"
                  onClick={() => navigate(`/family/assets/${asset.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-bfo-gold" />
                        <CardTitle className="text-lg text-white">{asset.asset_name}</CardTitle>
                      </div>
                      <Badge variant={getStatusColor(asset.status)}>
                        {asset.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Type:</span>
                        <span className="text-white">{getAssetTypeDisplay(asset.asset_type)}</span>
                      </div>
                      {asset.current_value_band && (
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Value:</span>
                          <span className="text-white">{getValueBandDisplay(asset.current_value_band)}</span>
                        </div>
                      )}
                      {asset.location_zip_first3 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Location:</span>
                          <span className="text-white">{asset.location_zip_first3}XX</span>
                        </div>
                      )}
                      {asset.next_appraisal_due && (
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Next Appraisal:</span>
                          <span className="text-white">{new Date(asset.next_appraisal_due).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {assets.length === 0 && (
            <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
              <CardContent className="text-center py-12">
                <Shield className="h-12 w-12 mx-auto mb-4 text-bfo-gold" />
                <h3 className="text-lg font-semibold mb-2 text-white">No Assets Found</h3>
                <p className="text-white/70 mb-4">
                  Start building your asset registry by adding your first high-value asset.
                </p>
                <Button onClick={() => navigate('/family/assets/new')} className="bg-bfo-gold text-black hover:bg-bfo-gold/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Asset
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          {reminders?.pending_reminders.map((reminder) => (
            <Card key={reminder.id} className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{reminder.title}</h3>
                    <p className="text-sm text-white/70">{reminder.description}</p>
                    <p className="text-xs text-white/50 mt-1">
                      Due: {new Date(reminder.reminder_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={reminder.reminder_date <= new Date().toISOString().split('T')[0] ? 'destructive' : 'secondary'}>
                    {reminder.reminder_type.replace('_', ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="advice">
          <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
            <CardContent className="text-center py-12">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-bfo-gold" />
              <h3 className="text-lg font-semibold mb-2 text-white">Coverage Analysis</h3>
              <p className="text-white/70">
                Upload asset documents to receive personalized coverage advice and gap analysis.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-xs text-white/50">
        Asset values banded for privacy • Documents stored in Vault • Creates Asset-RDS receipts
      </div>
      </div>
    </div>
  );
}