import React, { useState } from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useProfessionalNetwork } from '@/hooks/useProfessionalNetwork';
import { Star, MapPin, Phone, Mail, Award, Clock, Users, MessageSquare, Plus } from 'lucide-react';

export default function ProfessionalNetworkPage() {
  const { professionals, reviews, loading, saving, fetchProfessionals, fetchReviews, submitReview, registerProfessional } = useProfessionalNetwork();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    review_text: '',
    service_type: ''
  });
  const [registerData, setRegisterData] = useState({
    professional_type: 'cpa' as const,
    firm_name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    license_number: '',
    license_state: '',
    specialties: [] as string[],
    bio: '',
    years_experience: 0,
    credentials: [] as string[],
    hourly_rate: 0
  });

  const professionalTypes = [
    { value: 'all', label: 'All Professionals' },
    { value: 'cpa', label: 'CPA' },
    { value: 'tax_attorney', label: 'Tax Attorney' },
    { value: 'estate_attorney', label: 'Estate Attorney' },
    { value: 'enrolled_agent', label: 'Enrolled Agent' },
    { value: 'financial_advisor', label: 'Financial Advisor' }
  ];

  const filteredProfessionals = selectedType === 'all' 
    ? professionals 
    : professionals.filter(p => p.professional_type === selectedType);

  const handleViewProfessional = (professionalId: string) => {
    setSelectedProfessional(professionalId);
    fetchReviews(professionalId);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfessional) return;
    
    try {
      await submitReview({
        ...reviewData,
        professional_id: selectedProfessional,
        is_verified: false
      });
      setIsReviewDialogOpen(false);
      setReviewData({ rating: 5, review_text: '', service_type: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerProfessional({
        ...registerData,
        availability_status: 'available',
        rating: 0,
        review_count: 0,
        is_verified: false,
        compliance_status: 'pending',
        onboarding_completed: false,
        white_label_enabled: false
      });
      setIsRegisterDialogOpen(false);
      setRegisterData({
        professional_type: 'cpa',
        firm_name: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        license_number: '',
        license_state: '',
        specialties: [],
        bio: '',
        years_experience: 0,
        credentials: [],
        hourly_rate: 0
      });
    } catch (error) {
      console.error('Error registering professional:', error);
    }
  };

  if (loading) {
    return (
      <ThreeColumnLayout activeMainItem="professionals" title="Professional Network">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading professional network...</p>
          </div>
        </div>
      </ThreeColumnLayout>
    );
  }

  const selectedProf = selectedProfessional ? professionals.find(p => p.id === selectedProfessional) : null;

  return (
    <ThreeColumnLayout activeMainItem="professionals" title="Professional Network">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Professional Network</h1>
            <p className="text-muted-foreground">
              Connect with verified financial professionals
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Join Network
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Join Professional Network</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Professional Type</Label>
                      <Select value={registerData.professional_type} onValueChange={(value: any) => setRegisterData(prev => ({ ...prev, professional_type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpa">CPA</SelectItem>
                          <SelectItem value="tax_attorney">Tax Attorney</SelectItem>
                          <SelectItem value="estate_attorney">Estate Attorney</SelectItem>
                          <SelectItem value="enrolled_agent">Enrolled Agent</SelectItem>
                          <SelectItem value="financial_advisor">Financial Advisor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Firm Name</Label>
                      <Input
                        value={registerData.firm_name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, firm_name: e.target.value }))}
                        placeholder="Your firm name"
                      />
                    </div>
                    <div>
                      <Label>First Name</Label>
                      <Input
                        value={registerData.first_name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, first_name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input
                        value={registerData.last_name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, last_name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={registerData.phone}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>License Number</Label>
                      <Input
                        value={registerData.license_number}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, license_number: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>License State</Label>
                      <Input
                        value={registerData.license_state}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, license_state: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Years Experience</Label>
                      <Input
                        type="number"
                        value={registerData.years_experience}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, years_experience: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label>Hourly Rate</Label>
                      <Input
                        type="number"
                        value={registerData.hourly_rate}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, hourly_rate: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Bio</Label>
                    <Textarea
                      value={registerData.bio}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Professionals</p>
                  <p className="text-2xl font-bold">{professionals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Verified</p>
                  <p className="text-2xl font-bold">{professionals.filter(p => p.is_verified).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold">{professionals.filter(p => p.availability_status === 'available').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="directory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="directory">Directory</TabsTrigger>
            {selectedProfessional && <TabsTrigger value="profile">Professional Profile</TabsTrigger>}
          </TabsList>

          <TabsContent value="directory" className="space-y-4">
            <div className="flex items-center space-x-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {professionalTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfessionals.map(prof => (
                <Card key={prof.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewProfessional(prof.id)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{prof.first_name} {prof.last_name}</CardTitle>
                        <p className="text-muted-foreground text-sm">{prof.firm_name}</p>
                      </div>
                      {prof.is_verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Award className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="outline">
                        {prof.professional_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                      
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm">{prof.rating.toFixed(1)} ({prof.review_count} reviews)</span>
                      </div>

                      {prof.specialties && prof.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {prof.specialties.slice(0, 3).map((specialty, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm capitalize">{prof.availability_status}</span>
                        </div>
                        {prof.hourly_rate && prof.hourly_rate > 0 && (
                          <span className="text-sm font-medium">${prof.hourly_rate}/hr</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {selectedProf && (
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{selectedProf.first_name} {selectedProf.last_name}</CardTitle>
                      <p className="text-muted-foreground">{selectedProf.firm_name}</p>
                      <div className="flex items-center mt-2">
                        <Star className="h-5 w-5 text-yellow-500 mr-1" />
                        <span className="font-medium">{selectedProf.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground ml-1">({selectedProf.review_count} reviews)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {selectedProf.is_verified && (
                        <Badge className="bg-green-100 text-green-800 mb-2">
                          <Award className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <div className="space-y-1">
                        {selectedProf.hourly_rate && selectedProf.hourly_rate > 0 && (
                          <p className="text-lg font-semibold">${selectedProf.hourly_rate}/hr</p>
                        )}
                        <Badge variant="outline" className="capitalize">
                          {selectedProf.availability_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedProf.bio && (
                    <div>
                      <h3 className="font-semibold mb-2">About</h3>
                      <p className="text-muted-foreground">{selectedProf.bio}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Professional Details</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Type:</strong> {selectedProf.professional_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                        {selectedProf.years_experience && selectedProf.years_experience > 0 && (
                          <p><strong>Experience:</strong> {selectedProf.years_experience} years</p>
                        )}
                        {selectedProf.license_number && (
                          <p><strong>License:</strong> {selectedProf.license_number} ({selectedProf.license_state})</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Contact Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          <a href={`mailto:${selectedProf.email}`} className="text-blue-600 hover:underline">
                            {selectedProf.email}
                          </a>
                        </div>
                        {selectedProf.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            <a href={`tel:${selectedProf.phone}`} className="text-blue-600 hover:underline">
                              {selectedProf.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedProf.specialties && selectedProf.specialties.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProf.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProf.credentials && selectedProf.credentials.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Credentials</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProf.credentials.map((credential, idx) => (
                          <Badge key={idx} variant="outline">
                            {credential}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button className="flex-1">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Professional
                    </Button>
                    <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Star className="mr-2 h-4 w-4" />
                          Write Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Write a Review</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                          <div>
                            <Label>Rating</Label>
                            <Select value={reviewData.rating.toString()} onValueChange={(value) => setReviewData(prev => ({ ...prev, rating: parseInt(value) }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">5 - Excellent</SelectItem>
                                <SelectItem value="4">4 - Very Good</SelectItem>
                                <SelectItem value="3">3 - Good</SelectItem>
                                <SelectItem value="2">2 - Fair</SelectItem>
                                <SelectItem value="1">1 - Poor</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Service Type</Label>
                            <Input
                              value={reviewData.service_type}
                              onChange={(e) => setReviewData(prev => ({ ...prev, service_type: e.target.value }))}
                              placeholder="e.g., Tax Planning, Estate Planning"
                            />
                          </div>
                          <div>
                            <Label>Review</Label>
                            <Textarea
                              value={reviewData.review_text}
                              onChange={(e) => setReviewData(prev => ({ ...prev, review_text: e.target.value }))}
                              placeholder="Share your experience..."
                              rows={4}
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={saving}>
                            {saving ? 'Submitting...' : 'Submit Review'}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Reviews Section */}
                  <div>
                    <h3 className="font-semibold mb-4">Reviews</h3>
                    {reviews.length === 0 ? (
                      <p className="text-muted-foreground">No reviews yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map(review => (
                          <Card key={review.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                  {review.service_type && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      {review.service_type}
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              {review.review_text && (
                                <p className="text-sm text-muted-foreground">{review.review_text}</p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
}