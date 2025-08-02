import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Video, MapPin, Phone, MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const meetingTypes = [
  { value: 'video', label: 'Video Call (Zoom/Teams)', icon: Video },
  { value: 'phone', label: 'Phone Call', icon: Phone },
  { value: 'in-person', label: 'In-Person Meeting', icon: MapPin },
  { value: 'in-app', label: 'In-App Chat', icon: MessageSquare }
];

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
];

export default function ConsultationBookingPage() {
  const { professionalId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    meetingType: '',
    preferredDate: '',
    preferredTime: '',
    duration: '60',
    subject: '',
    description: '',
    urgency: 'normal'
  });

  // Mock professional data - in real app, this would be fetched
  const professional = {
    id: professionalId,
    name: 'Jennifer Walsh',
    title: 'Senior Portfolio Manager',
    firm: 'Walsh Wealth Management',
    specialty: 'ESG Investing & Risk Management',
    rate: '$450/hour',
    responseTime: '< 3 hours',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // In a real app, this would submit to your booking API
      console.log('Booking request:', { professionalId, ...bookingData });
      
      toast({
        title: "Consultation Request Sent!",
        description: `${professional.name} will respond within ${professional.responseTime}`,
      });
      
      navigate('/marketplace', { 
        state: { message: 'Consultation request sent successfully!' }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send consultation request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return bookingData.meetingType && bookingData.preferredDate && bookingData.preferredTime;
      case 2:
        return bookingData.subject.trim().length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/marketplace')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Professional Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <img
                    src={professional.image}
                    alt={professional.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{professional.name}</h3>
                    <p className="text-muted-foreground">{professional.title}</p>
                    <p className="font-medium">{professional.firm}</p>
                  </div>
                  <Badge variant="outline">{professional.specialty}</Badge>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span className="font-medium">{professional.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span className="font-medium">{professional.responseTime}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule Consultation
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Step {currentStep} of 3</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${(currentStep / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Step 1: Meeting Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Meeting Preferences</h3>
                    
                    {/* Meeting Type */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Meeting Type</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {meetingTypes.map((type) => {
                          const IconComponent = type.icon;
                          return (
                            <button
                              key={type.value}
                              onClick={() => handleInputChange('meetingType', type.value)}
                              className={`p-4 border rounded-lg text-left transition-colors ${
                                bookingData.meetingType === type.value
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <IconComponent className="w-5 h-5" />
                                <span className="font-medium">{type.label}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Preferred Date</label>
                      <Input
                        type="date"
                        value={bookingData.preferredDate}
                        onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Preferred Time</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleInputChange('preferredTime', time)}
                            className={`p-2 text-sm border rounded-md transition-colors ${
                              bookingData.preferredTime === time
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Duration</label>
                      <Select value={bookingData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 2: Consultation Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Consultation Details</h3>
                    
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Subject *</label>
                      <Input
                        placeholder="What would you like to discuss?"
                        value={bookingData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Please provide more details about your needs, goals, or specific questions..."
                        value={bookingData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Urgency Level</label>
                      <Select value={bookingData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General discussion</SelectItem>
                          <SelectItem value="normal">Normal - Standard consultation</SelectItem>
                          <SelectItem value="high">High - Time-sensitive matter</SelectItem>
                          <SelectItem value="urgent">Urgent - Immediate attention needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Confirm */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Review Your Request</h3>
                    
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Meeting Type:</span>
                          <p className="font-medium">
                            {meetingTypes.find(t => t.value === bookingData.meetingType)?.label}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <p className="font-medium">{bookingData.duration} minutes</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <p className="font-medium">{new Date(bookingData.preferredDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>
                          <p className="font-medium">{bookingData.preferredTime}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm">Subject:</span>
                        <p className="font-medium">{bookingData.subject}</p>
                      </div>
                      {bookingData.description && (
                        <div>
                          <span className="text-muted-foreground text-sm">Description:</span>
                          <p className="text-sm">{bookingData.description}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-900">What happens next?</p>
                          <ul className="mt-2 space-y-1 text-blue-700">
                            <li>• {professional.name} will receive your consultation request</li>
                            <li>• You'll hear back within {professional.responseTime}</li>
                            <li>• Once approved, you'll receive meeting details and confirmation</li>
                            <li>• Any documents can be shared securely through our platform</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    Back
                  </Button>
                  
                  {currentStep < 3 ? (
                    <Button 
                      onClick={handleNext}
                      disabled={!isStepValid()}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit}
                      className="gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Send Request
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}