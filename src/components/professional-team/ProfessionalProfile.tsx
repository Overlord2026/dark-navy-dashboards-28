import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Star, 
  MapPin, 
  DollarSign, 
  Check, 
  UserPlus, 
  MessageCircle, 
  Mail,
  Phone,
  Globe,
  Calendar,
  FileText,
  Languages,
  Award,
  ArrowLeft
} from "lucide-react";
import { EnhancedProfessional, PROFESSIONAL_RELATIONSHIPS } from "@/types/professionalTeam";
import { useProfessionalTeam } from "@/hooks/useProfessionalTeam";

interface ProfessionalProfileProps {
  professional: EnhancedProfessional;
  onBack: () => void;
}

export function ProfessionalProfile({ professional, onBack }: ProfessionalProfileProps) {
  const { assignProfessional, addReview, saving } = useProfessionalTeam();
  const [selectedRelationship, setSelectedRelationship] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");

  const handleAssign = async () => {
    if (!selectedRelationship) return;
    await assignProfessional(professional.id, selectedRelationship);
  };

  const handleSubmitReview = async () => {
    await addReview(professional.id, reviewRating, reviewComment);
    setReviewComment("");
    setReviewRating(5);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Marketplace
      </Button>

      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={professional.photo_url} />
              <AvatarFallback className="text-2xl">
                {professional.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl">{professional.name}</CardTitle>
                  {professional.verified && (
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Verified Professional
                    </Badge>
                  )}
                  {professional.accepting_new_clients && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Accepting New Clients
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-lg">
                  {professional.firm || professional.company}
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Badge variant="outline">{professional.type}</Badge>
                </div>
                {professional.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{professional.location}</span>
                  </div>
                )}
                {professional.ratings_average > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{professional.ratings_average.toFixed(1)}</span>
                    <span>({professional.reviews_count} reviews)</span>
                  </div>
                )}
                {professional.fee_model && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{professional.fee_model}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 md:w-48">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add to Team
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign {professional.name} to Your Team</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium">Role/Relationship</label>
                      <Select value={selectedRelationship} onValueChange={setSelectedRelationship}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PROFESSIONAL_RELATIONSHIPS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleAssign} 
                        disabled={!selectedRelationship || saving}
                        className="flex-1"
                      >
                        {saving ? 'Adding...' : 'Add to Team'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
              
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          {professional.bio && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{professional.bio}</p>
              </CardContent>
            </Card>
          )}

          {/* Specialties & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {professional.specialties && professional.specialties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Specialties
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {professional.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {professional.certifications && professional.certifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {professional.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reviews & Ratings</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Write Review</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Write a Review for {professional.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="text-sm font-medium">Rating</label>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map(num => (
                            <button
                              key={num}
                              onClick={() => setReviewRating(num)}
                              className={`h-6 w-6 ${num <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              <Star className="h-full w-full fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Comment (optional)</label>
                        <Textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience..."
                          className="mt-1"
                        />
                      </div>
                      <Button onClick={handleSubmitReview} disabled={saving} className="w-full">
                        {saving ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {professional.reviews && professional.reviews.length > 0 ? (
                <div className="space-y-4">
                  {professional.reviews.slice(0, 3).map((review, idx) => (
                    <div key={idx} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(num => (
                            <Star
                              key={num}
                              className={`h-4 w-4 ${num <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {professional.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{professional.email}</span>
                </div>
              )}
              {professional.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{professional.phone}</span>
                </div>
              )}
              {professional.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={professional.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              {professional.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{professional.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Languages */}
          {professional.languages && professional.languages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {professional.languages.map((language, idx) => (
                    <Badge key={idx} variant="outline">{language}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Availability */}
          {professional.availability && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Check calendar for available time slots
                </p>
                <Button variant="outline" className="w-full mt-3">
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Compliance Status */}
          {professional.verified && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Identity Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Credentials Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Background Check</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}