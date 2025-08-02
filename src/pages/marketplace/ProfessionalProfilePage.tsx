import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Phone, 
  Mail, 
  Globe, 
  ArrowLeft, 
  Shield, 
  Award, 
  TrendingUp,
  FileText,
  Clock,
  Users,
  CheckCircle,
  Verified
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfessionalProfilePage() {
  const { professionalId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock professional data - in real app, this would be fetched
  const professional = {
    id: professionalId,
    name: 'Jennifer Walsh',
    title: 'Senior Portfolio Manager',
    firm: 'Walsh Wealth Management',
    type: 'Financial Advisor',
    location: 'Boston, MA',
    verified: true,
    rating: 4.9,
    reviews: 89,
    experience: 15,
    responseTime: '< 3 hours',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    bio: `Jennifer specializes in sustainable investing and comprehensive wealth management for high-net-worth families. With over 15 years of experience in the financial services industry, she has helped hundreds of families achieve their financial goals through personalized investment strategies and comprehensive financial planning.

    Her expertise in ESG investing has made her a sought-after advisor for families looking to align their investments with their values while maintaining strong financial performance. Jennifer holds the CFP, CFA, and CIMA certifications and is a member of the Boston Estate Planning Council.`,
    
    specialties: ['ESG Investing', 'Risk Management', 'Tax Planning', 'Estate Planning', 'Alternative Investments'],
    credentials: ['CFP', 'CFA', 'CIMA'],
    languages: ['English', 'Spanish'],
    clientTypes: ['High Net Worth Families', 'Family Offices', 'Individuals'],
    minAssets: '$3M+',
    rate: '$450/hour',
    
    services: [
      {
        name: 'Comprehensive Financial Planning',
        description: 'Complete financial assessment and strategic planning',
        duration: '2-3 hours',
        price: '$1,200'
      },
      {
        name: 'ESG Portfolio Review',
        description: 'Sustainable investment analysis and recommendations',
        duration: '1-2 hours',
        price: '$600'
      },
      {
        name: 'Risk Assessment Consultation',
        description: 'Portfolio risk analysis and mitigation strategies',
        duration: '1 hour',
        price: '$450'
      }
    ],

    reviewsList: [
      {
        id: 1,
        author: 'Sarah M.',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Jennifer provided exceptional guidance on our ESG investing strategy. Her expertise and personalized approach made all the difference.',
        verified: true
      },
      {
        id: 2,
        author: 'Michael R.',
        rating: 5,
        date: '1 month ago',
        comment: 'Outstanding service and deep knowledge of tax-efficient investing. Highly recommend for complex financial situations.',
        verified: true
      },
      {
        id: 3,
        author: 'Lisa K.',
        rating: 4,
        date: '2 months ago',
        comment: 'Very professional and responsive. Helped us restructure our portfolio for better risk management.',
        verified: true
      }
    ],

    availability: [
      { day: 'Monday', slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'] },
      { day: 'Tuesday', slots: ['10:00 AM', '1:00 PM', '3:00 PM'] },
      { day: 'Wednesday', slots: ['9:00 AM', '11:00 AM', '2:00 PM'] },
      { day: 'Thursday', slots: ['10:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'] },
      { day: 'Friday', slots: ['9:00 AM', '11:00 AM'] }
    ],

    contact: {
      phone: '+1 (617) 555-0123',
      email: 'jennifer@walshwealth.com',
      website: 'https://walshwealth.com',
      linkedIn: 'https://linkedin.com/in/jenniferwalshs'
    }
  };

  const handleBookConsultation = () => {
    navigate(`/marketplace/booking/${professional.id}`);
  };

  const handleSendMessage = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Direct messaging will be available in the next update.",
    });
  };

  const handleContactPhone = () => {
    window.open(`tel:${professional.contact.phone}`);
  };

  const handleContactEmail = () => {
    window.open(`mailto:${professional.contact.email}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/marketplace')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Profile Image & Basic Info */}
              <div className="flex flex-col items-center lg:items-start">
                <Avatar className="w-32 h-32 border-4 border-border mb-4">
                  <AvatarImage src={professional.image} alt={professional.name} />
                  <AvatarFallback className="text-2xl">
                    {professional.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center lg:text-left space-y-2">
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <h1 className="text-3xl font-bold">{professional.name}</h1>
                    {professional.verified && (
                      <Verified className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  <p className="text-xl text-muted-foreground">{professional.title}</p>
                  <p className="font-semibold">{professional.firm}</p>
                  <Badge variant="outline">{professional.type}</Badge>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex-1 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-bold">{professional.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{professional.reviewsList.length} reviews</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="font-bold mb-1">{professional.experience}+</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="font-bold mb-1">{professional.responseTime}</div>
                    <div className="text-sm text-muted-foreground">Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="font-bold mb-1">{professional.minAssets}</div>
                    <div className="text-sm text-muted-foreground">Min. Assets</div>
                  </div>
                </div>

                {/* Location & Contact */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{professional.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Responds in {professional.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{professional.clientTypes.join(', ')}</span>
                  </div>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" onClick={handleBookConsultation} className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Book Consultation
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleSendMessage} className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Send Message
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleContactPhone} className="gap-2">
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleContactEmail} className="gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle>About {professional.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {professional.bio.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0">
                          {paragraph.trim()}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Specialties */}
                <Card>
                  <CardHeader>
                    <CardTitle>Specialties & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {professional.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Credentials */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Credentials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {professional.credentials.map((credential, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{credential}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {professional.languages.map((language, index) => (
                        <div key={index}>{language}</div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Rate */}
                <Card>
                  <CardHeader>
                    <CardTitle>Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{professional.rate}</div>
                    <div className="text-sm text-muted-foreground">Consultation rate</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professional.services.map((service, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Duration:</span>
                        <span className="font-medium">{service.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Price:</span>
                        <span className="font-bold text-primary">{service.price}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4" onClick={handleBookConsultation}>
                      Book This Service
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {professional.reviewsList.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.author}</span>
                          {review.verified && (
                            <Badge variant="outline" className="text-xs">Verified</Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Review Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div>
                        <div className="text-3xl font-bold">{professional.rating}</div>
                        <div className="flex justify-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(professional.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Based on {professional.reviewsList.length} reviews
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>This Week's Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {professional.availability.map((day, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="font-medium mb-2">{day.day}</div>
                      <div className="flex flex-wrap gap-2">
                        {day.slots.map((slot, slotIndex) => (
                          <Badge key={slotIndex} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                            {slot}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" onClick={handleBookConsultation}>
                  Book Available Time
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{professional.contact.phone}</div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{professional.contact.email}</div>
                      <div className="text-sm text-muted-foreground">Email</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">walshwealth.com</div>
                      <div className="text-sm text-muted-foreground">Website</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Office Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Thursday:</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Friday:</span>
                      <span>9:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekend:</span>
                      <span>By appointment only</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <strong>Response Time:</strong> {professional.responseTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}