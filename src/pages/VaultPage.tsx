import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Folder, Upload, FileText, Key, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const sampleFolders = [
  { name: 'Wills & Trusts', icon: FileText, count: 3, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { name: 'Insurance Policies', icon: Shield, count: 5, color: 'text-green-600', bgColor: 'bg-green-50' },
  { name: 'Tax Documents', icon: FileText, count: 12, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { name: 'Property Deeds', icon: FileText, count: 2, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { name: 'Passwords & IDs', icon: Key, count: 8, color: 'text-red-600', bgColor: 'bg-red-50' },
  { name: 'Financial Statements', icon: CreditCard, count: 6, color: 'text-cyan-600', bgColor: 'bg-cyan-50' }
];

export default function VaultPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Secure Digital Vault
          </h1>
          <p className="text-muted-foreground mt-2">
            Store and organize your important documents with bank-level security
          </p>
        </div>
        <Badge variant="secondary" className="text-sm bg-green-100 text-green-700">
          Free Feature
        </Badge>
      </div>

      {/* Security Info */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Shield className="h-12 w-12 text-primary" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Bank-Level Security</h3>
              <p className="text-muted-foreground">
                Your documents are encrypted with 256-bit SSL and stored in SOC 2 compliant data centers. 
                Only you have access to your files.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Drop files here or click to upload</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supports PDF, DOC, DOCX, JPG, PNG files up to 10MB
            </p>
            <Button>Choose Files</Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Folders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Your Document Folders</CardTitle>
          <p className="text-sm text-muted-foreground">Sample folders showing how your documents will be organized</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleFolders.map((folder, index) => (
              <motion.div
                key={folder.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`w-16 h-16 ${folder.bgColor} rounded-lg flex items-center justify-center`}>
                        <folder.icon className={`w-8 h-8 ${folder.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{folder.name}</h3>
                        <p className="text-sm text-muted-foreground">{folder.count} documents</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Vault Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Security & Privacy</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• End-to-end encryption</li>
                <li>• Multi-factor authentication</li>
                <li>• Zero-knowledge architecture</li>
                <li>• Regular security audits</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Organization & Access</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Smart folder organization</li>
                <li>• Quick search and tags</li>
                <li>• Family member sharing</li>
                <li>• Emergency access protocols</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}