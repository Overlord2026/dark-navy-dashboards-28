import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  FileText, 
  UserPlus, 
  Shield, 
  Clock,
  Send,
  Upload,
  CheckCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  action: () => void;
}

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShareDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InviteCPAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ComplianceCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ScheduleMeetingModal({ isOpen, onClose }: ScheduleMeetingModalProps) {
  const [selectedClient, setSelectedClient] = useState('');
  const [meetingType, setMeetingType] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');

  const handleSchedule = () => {
    if (!selectedClient || !meetingType || !meetingDate || !meetingTime) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Meeting scheduled successfully!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Schedule Client Meeting
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Client</label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-smith">John Smith</SelectItem>
                <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                <SelectItem value="michael-brown">Michael Brown</SelectItem>
                <SelectItem value="emily-davis">Emily Davis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Meeting Type</label>
            <Select value={meetingType} onValueChange={setMeetingType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select meeting type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quarterly-review">Quarterly Review</SelectItem>
                <SelectItem value="portfolio-discussion">Portfolio Discussion</SelectItem>
                <SelectItem value="tax-planning">Tax Planning Session</SelectItem>
                <SelectItem value="estate-planning">Estate Planning</SelectItem>
                <SelectItem value="insurance-review">Insurance Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Time</label>
              <Input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSchedule} className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShareDocumentModal({ isOpen, onClose }: ShareDocumentModalProps) {
  const [documentType, setDocumentType] = useState('');
  const [recipients, setRecipients] = useState('');
  const [message, setMessage] = useState('');
  const [expirationDays, setExpirationDays] = useState('7');

  const handleShare = () => {
    if (!documentType || !recipients) {
      toast.error('Please select a document and enter recipients');
      return;
    }
    
    toast.success('Secure document link sent successfully!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Share Secure Document
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Document Type</label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="portfolio-report">Portfolio Report</SelectItem>
                <SelectItem value="tax-documents">Tax Documents</SelectItem>
                <SelectItem value="investment-proposal">Investment Proposal</SelectItem>
                <SelectItem value="insurance-policy">Insurance Policy</SelectItem>
                <SelectItem value="estate-plan">Estate Planning Documents</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Recipients (Email addresses)</label>
            <Input
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="client@email.com, spouse@email.com"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Expiration</label>
            <Select value={expirationDays} onValueChange={setExpirationDays}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Message (Optional)</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message for the recipients..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleShare} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Send Secure Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InviteCPAModal({ isOpen, onClose }: InviteCPAModalProps) {
  const [cpaEmail, setCpaEmail] = useState('');
  const [cpaName, setCpaName] = useState('');
  const [clientName, setClientName] = useState('');
  const [accessLevel, setAccessLevel] = useState('');

  const handleInvite = () => {
    if (!cpaEmail || !cpaName || !clientName || !accessLevel) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('CPA invitation sent successfully!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-purple-600" />
            Invite CPA Collaboration
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">CPA Name</label>
            <Input
              value={cpaName}
              onChange={(e) => setCpaName(e.target.value)}
              placeholder="Enter CPA's full name"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">CPA Email</label>
            <Input
              type="email"
              value={cpaEmail}
              onChange={(e) => setCpaEmail(e.target.value)}
              placeholder="cpa@firm.com"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Client/Case</label>
            <Select value={clientName} onValueChange={setClientName}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select client for collaboration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-smith">John Smith - Tax Planning</SelectItem>
                <SelectItem value="sarah-johnson">Sarah Johnson - Estate Planning</SelectItem>
                <SelectItem value="michael-brown">Michael Brown - Business Planning</SelectItem>
                <SelectItem value="emily-davis">Emily Davis - Retirement Planning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Access Level</label>
            <Select value={accessLevel} onValueChange={setAccessLevel}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select access level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view-only">View Only - Portfolio & Documents</SelectItem>
                <SelectItem value="collaborate">Collaborate - Add Notes & Recommendations</SelectItem>
                <SelectItem value="full-access">Full Access - All Client Information</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              The CPA will receive a secure invitation email with access to collaborate on this client's financial planning.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleInvite} className="flex-1">
              <UserPlus className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ComplianceCheckModal({ isOpen, onClose }: ComplianceCheckModalProps) {
  const [checkType, setCheckType] = useState('');
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [relatedClient, setRelatedClient] = useState('');

  const handleRequest = () => {
    if (!checkType || !priority) {
      toast.error('Please select check type and priority');
      return;
    }
    
    toast.success('Compliance check request submitted successfully!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            Request Compliance Check
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Check Type</label>
            <Select value={checkType} onValueChange={setCheckType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select compliance check type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suitability">Investment Suitability Review</SelectItem>
                <SelectItem value="documentation">Documentation Compliance</SelectItem>
                <SelectItem value="disclosure">Disclosure Requirements</SelectItem>
                <SelectItem value="risk-assessment">Risk Assessment Validation</SelectItem>
                <SelectItem value="fee-disclosure">Fee Disclosure Review</SelectItem>
                <SelectItem value="marketing-materials">Marketing Materials Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Priority Level</label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">Urgent - Within 24 hours</SelectItem>
                <SelectItem value="high">High - Within 3 business days</SelectItem>
                <SelectItem value="normal">Normal - Within 1 week</SelectItem>
                <SelectItem value="low">Low - Within 2 weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Related Client (Optional)</label>
            <Select value={relatedClient} onValueChange={setRelatedClient}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select related client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-smith">John Smith</SelectItem>
                <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                <SelectItem value="michael-brown">Michael Brown</SelectItem>
                <SelectItem value="emily-davis">Emily Davis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the compliance check needed, specific concerns, or additional context..."
              className="mt-1"
              rows={4}
            />
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-800">
              Your compliance team will review this request and provide feedback within the specified timeframe.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleRequest} className="flex-1">
              <Shield className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function QuickActionsPanel() {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showCPAModal, setShowCPAModal] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'schedule-meeting',
      title: 'Schedule Meeting',
      description: 'Book client consultations',
      icon: <Calendar className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      action: () => setShowScheduleModal(true)
    },
    {
      id: 'share-document',
      title: 'Share Secure Document',
      description: 'Send encrypted client files',
      icon: <FileText className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100',
      action: () => setShowDocumentModal(true)
    },
    {
      id: 'invite-cpa',
      title: 'Invite CPA',
      description: 'Collaborate with tax professionals',
      icon: <UserPlus className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      action: () => setShowCPAModal(true)
    },
    {
      id: 'compliance-check',
      title: 'Compliance Check',
      description: 'Request regulatory review',
      icon: <Shield className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      action: () => setShowComplianceModal(true)
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {quickActions.map((action) => (
              <motion.div
                key={action.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  onClick={action.action}
                  className={`w-full h-auto p-4 ${action.bgColor} border border-transparent hover:border-gray-200 transition-all duration-200`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`p-2 rounded-lg ${action.color} bg-white shadow-sm`}>
                      {action.icon}
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-foreground">{action.title}</div>
                      <div className="text-sm text-muted-foreground">{action.description}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Actions */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Actions</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1 bg-blue-100 rounded">
                  <Calendar className="h-3 w-3 text-blue-600" />
                </div>
                <span className="text-muted-foreground">Meeting scheduled with John Smith</span>
                <Badge variant="secondary" className="text-xs">2h ago</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1 bg-green-100 rounded">
                  <FileText className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-muted-foreground">Portfolio report shared with Sarah J.</span>
                <Badge variant="secondary" className="text-xs">1d ago</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1 bg-orange-100 rounded">
                  <Shield className="h-3 w-3 text-orange-600" />
                </div>
                <span className="text-muted-foreground">Compliance check completed</span>
                <Badge variant="secondary" className="text-xs">2d ago</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ScheduleMeetingModal 
        isOpen={showScheduleModal} 
        onClose={() => setShowScheduleModal(false)} 
      />
      <ShareDocumentModal 
        isOpen={showDocumentModal} 
        onClose={() => setShowDocumentModal(false)} 
      />
      <InviteCPAModal 
        isOpen={showCPAModal} 
        onClose={() => setShowCPAModal(false)} 
      />
      <ComplianceCheckModal 
        isOpen={showComplianceModal} 
        onClose={() => setShowComplianceModal(false)} 
      />
    </>
  );
}