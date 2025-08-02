import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Send, Download, Eye, Save } from "lucide-react";

export const ProposalGenerator = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clientName: "",
    proposalType: "",
    investmentAmount: "",
    timeHorizon: "",
    riskTolerance: "",
    incomeGoal: "",
    notes: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateProposal = () => {
    toast({
      title: "Proposal Generated",
      description: "Your custom annuity proposal has been created successfully.",
    });
  };

  const handleSaveTemplate = () => {
    toast({
      title: "Template Saved",
      description: "Proposal template saved for future use.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Proposal Form */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-slate-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Proposal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
                placeholder="Enter client name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposalType">Proposal Type</Label>
              <Select value={formData.proposalType} onValueChange={(value) => handleInputChange("proposalType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select proposal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                  <SelectItem value="income-focused">Income-Focused Strategy</SelectItem>
                  <SelectItem value="growth-protection">Growth & Protection</SelectItem>
                  <SelectItem value="estate-planning">Estate Planning Integration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="investmentAmount">Investment Amount</Label>
                <Input
                  id="investmentAmount"
                  value={formData.investmentAmount}
                  onChange={(e) => handleInputChange("investmentAmount", e.target.value)}
                  placeholder="$500,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeHorizon">Time Horizon</Label>
                <Select value={formData.timeHorizon} onValueChange={(value) => handleInputChange("timeHorizon", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate Income</SelectItem>
                    <SelectItem value="5-years">5-10 Years</SelectItem>
                    <SelectItem value="10-years">10+ Years</SelectItem>
                    <SelectItem value="lifetime">Lifetime Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <Select value={formData.riskTolerance} onValueChange={(value) => handleInputChange("riskTolerance", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incomeGoal">Income Goal</Label>
                <Input
                  id="incomeGoal"
                  value={formData.incomeGoal}
                  onChange={(e) => handleInputChange("incomeGoal", e.target.value)}
                  placeholder="$5,000/month"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Special considerations, client preferences, etc."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Proposal Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-slate-800">Proposal Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview */}
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
              <h4 className="font-semibold text-sm text-slate-800 mb-2">Proposal Preview</h4>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Client: {formData.clientName || "Client Name"}</div>
                <div>Type: {formData.proposalType || "Proposal Type"}</div>
                <div>Amount: {formData.investmentAmount || "Investment Amount"}</div>
                <div>Timeline: {formData.timeHorizon || "Time Horizon"}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                onClick={handleGenerateProposal}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Proposal
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" onClick={handleSaveTemplate}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Send to Client
                </Button>
              </div>
            </div>

            {/* Recent Proposals */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="font-semibold text-sm text-slate-800 mb-3">Recent Proposals</h4>
              <div className="space-y-2">
                {[
                  { client: "Johnson Family", type: "Income Strategy", date: "Dec 10" },
                  { client: "Smith Trust", type: "Estate Planning", date: "Dec 8" }
                ].map((proposal, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <div>
                      <div className="text-xs font-medium text-slate-700">{proposal.client}</div>
                      <div className="text-xs text-slate-500">{proposal.type}</div>
                    </div>
                    <div className="text-xs text-slate-500">{proposal.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};