import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Home, 
  DollarSign, 
  Shield, 
  ChevronDown,
  ChevronRight,
  Eye,
  Settings,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Download
} from 'lucide-react';

interface EntityNode {
  id: string;
  name: string;
  type: 'LLC' | 'Corporation' | 'Trust' | 'Partnership' | 'Individual';
  status: 'Active' | 'Inactive' | 'Pending';
  ownership?: number;
  parent?: string;
  children?: string[];
  assets?: Array<{
    name: string;
    type: string;
    value: number;
  }>;
  details: {
    jurisdiction: string;
    formation: string;
    manager?: string;
    trustee?: string;
  };
}

const mockEntityData: EntityNode[] = [
  {
    id: 'smith-family',
    name: 'Smith Family',
    type: 'Individual',
    status: 'Active',
    children: ['holdings-llc', 'family-trust'],
    details: {
      jurisdiction: 'Multiple',
      formation: 'Natural',
    }
  },
  {
    id: 'holdings-llc',
    name: 'Smith Holdings LLC',
    type: 'LLC',
    status: 'Active',
    ownership: 100,
    parent: 'smith-family',
    children: ['property-llc', 'investment-llc'],
    assets: [
      { name: 'Cash & Equivalents', type: 'Cash', value: 500000 },
      { name: 'Membership Interests', type: 'Equity', value: 3000000 }
    ],
    details: {
      jurisdiction: 'Delaware',
      formation: '2020-03-15',
      manager: 'John Smith'
    }
  },
  {
    id: 'family-trust',
    name: 'Smith Family Trust',
    type: 'Trust',
    status: 'Active',
    ownership: 100,
    parent: 'smith-family',
    children: ['education-fund'],
    assets: [
      { name: 'Family Residence', type: 'Real Estate', value: 2500000 },
      { name: 'Investment Portfolio', type: 'Securities', value: 1800000 }
    ],
    details: {
      jurisdiction: 'Nevada',
      formation: '2018-06-20',
      trustee: 'John & Jane Smith'
    }
  },
  {
    id: 'property-llc',
    name: 'Property Holdings LLC',
    type: 'LLC',
    status: 'Active',
    ownership: 100,
    parent: 'holdings-llc',
    assets: [
      { name: 'Commercial Building A', type: 'Real Estate', value: 1200000 },
      { name: 'Apartment Complex', type: 'Real Estate', value: 2300000 }
    ],
    details: {
      jurisdiction: 'Texas',
      formation: '2021-01-10',
      manager: 'Smith Holdings LLC'
    }
  },
  {
    id: 'investment-llc',
    name: 'Investment Management LLC',
    type: 'LLC',
    status: 'Active',
    ownership: 100,
    parent: 'holdings-llc',
    assets: [
      { name: 'Stock Portfolio', type: 'Securities', value: 1500000 },
      { name: 'Private Equity Stakes', type: 'Private Equity', value: 800000 }
    ],
    details: {
      jurisdiction: 'Delaware',
      formation: '2020-09-15',
      manager: 'John Smith'
    }
  },
  {
    id: 'education-fund',
    name: 'Education Fund LLC',
    type: 'LLC',
    status: 'Active',
    ownership: 100,
    parent: 'family-trust',
    assets: [
      { name: '529 Plans', type: 'Education', value: 400000 },
      { name: 'Scholarship Fund', type: 'Cash', value: 200000 }
    ],
    details: {
      jurisdiction: 'California',
      formation: '2019-08-01',
      manager: 'Smith Family Trust'
    }
  }
];

export const FamilyEntityTree: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['smith-family', 'holdings-llc', 'family-trust']));
  const [zoomLevel, setZoomLevel] = useState(1);

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'LLC':
      case 'Corporation':
        return <Building2 className="h-4 w-4" />;
      case 'Trust':
        return <Shield className="h-4 w-4" />;
      case 'Partnership':
        return <Users className="h-4 w-4" />;
      case 'Individual':
        return <Users className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalValue = (entity: EntityNode): number => {
    return entity.assets?.reduce((sum, asset) => sum + asset.value, 0) || 0;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: amount >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const renderEntity = (entity: EntityNode, level: number = 0): React.ReactNode => {
    const hasChildren = entity.children && entity.children.length > 0;
    const isExpanded = expandedNodes.has(entity.id);
    const isSelected = selectedEntity === entity.id;
    const totalValue = getTotalValue(entity);

    return (
      <motion.div
        key={entity.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: level * 0.1 }}
        className="relative"
        style={{ marginLeft: level * 24 }}
      >
        {/* Connection Line */}
        {level > 0 && (
          <div 
            className="absolute top-0 left-0 w-6 h-6 border-l-2 border-b-2 border-muted-foreground/30"
            style={{ marginLeft: -24, marginTop: 12 }}
          />
        )}

        {/* Entity Card */}
        <Card 
          className={`mb-3 transition-all cursor-pointer hover:shadow-md ${
            isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
          }`}
          onClick={() => setSelectedEntity(isSelected ? null : entity.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpanded(entity.id);
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
                
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${
                    entity.type === 'Individual' ? 'bg-blue-100' :
                    entity.type === 'Trust' ? 'bg-purple-100' :
                    'bg-emerald-100'
                  }`}>
                    {getEntityIcon(entity.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{entity.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {entity.type}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(entity.status)}`}>
                        {entity.status}
                      </Badge>
                      {entity.ownership && (
                        <Badge variant="secondary" className="text-xs">
                          {entity.ownership}% owned
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                {totalValue > 0 && (
                  <div className="text-sm font-medium">
                    {formatCurrency(totalValue)}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {entity.details.jurisdiction}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t space-y-3"
              >
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Formation Date</p>
                    <p className="font-medium">{entity.details.formation}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Jurisdiction</p>
                    <p className="font-medium">{entity.details.jurisdiction}</p>
                  </div>
                  {entity.details.manager && (
                    <div>
                      <p className="text-muted-foreground">Manager</p>
                      <p className="font-medium">{entity.details.manager}</p>
                    </div>
                  )}
                  {entity.details.trustee && (
                    <div>
                      <p className="text-muted-foreground">Trustee</p>
                      <p className="font-medium">{entity.details.trustee}</p>
                    </div>
                  )}
                </div>

                {entity.assets && entity.assets.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-2">Assets</p>
                    <div className="space-y-2">
                      {entity.assets.map((asset, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{asset.name}</p>
                              <p className="text-xs text-muted-foreground">{asset.type}</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium">{formatCurrency(asset.value)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Children */}
        {hasChildren && isExpanded && entity.children && (
          <div className="relative">
            {entity.children.map(childId => {
              const childEntity = mockEntityData.find(e => e.id === childId);
              return childEntity ? renderEntity(childEntity, level + 1) : null;
            })}
          </div>
        )}
      </motion.div>
    );
  };

  const rootEntities = mockEntityData.filter(entity => !entity.parent);
  const totalFamilyValue = mockEntityData.reduce((sum, entity) => sum + getTotalValue(entity), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Family Entity Structure</h3>
          <p className="text-sm text-muted-foreground">
            Total Family Assets: {formatCurrency(totalFamilyValue)}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm px-2">{Math.round(zoomLevel * 100)}%</span>
          <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <Card className="p-4">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-100 rounded"></div>
            <span>Business Entity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-100 rounded"></div>
            <span>Trust</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>Individual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Pending</span>
          </div>
        </div>
      </Card>

      {/* Entity Tree */}
      <Card className="p-6">
        <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
          <div className="space-y-4">
            {rootEntities.map(entity => renderEntity(entity, 0))}
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Entities</p>
              <p className="text-lg font-semibold">{mockEntityData.length - 1}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Assets</p>
              <p className="text-lg font-semibold">{formatCurrency(totalFamilyValue)}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Trusts</p>
              <p className="text-lg font-semibold">
                {mockEntityData.filter(e => e.type === 'Trust').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">LLCs</p>
              <p className="text-lg font-semibold">
                {mockEntityData.filter(e => e.type === 'LLC').length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};