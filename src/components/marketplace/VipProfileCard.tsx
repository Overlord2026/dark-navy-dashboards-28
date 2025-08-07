import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Crown, 
  Star, 
  CheckCircle, 
  Lock, 
  ExternalLink, 
  MapPin,
  Users,
  Award,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface VipProfile {
  id: string;
  name: string;
  title: string;
  organization: string;
  category: string;
  profileImage?: string;
  location: string;
  status: "reserved" | "active" | "founding_member" | "partner";
  specialties: string[];
  tier: "platinum" | "gold" | "silver";
  isVerified: boolean;
  joinedDate?: string;
  description: string;
  achievements?: string[];
}

interface VipProfileCardProps {
  profile: VipProfile;
  onViewProfile?: (profile: VipProfile) => void;
  onClaimProfile?: (profile: VipProfile) => void;
  onRequestInvite?: (profile: VipProfile) => void;
}

export function VipProfileCard({ 
  profile, 
  onViewProfile, 
  onClaimProfile, 
  onRequestInvite 
}: VipProfileCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "reserved":
        return {
          label: "Reserved",
          icon: Lock,
          color: "bg-gold/10 text-gold border-gold/20",
          bgGradient: "from-gold/5 to-gold/10"
        };
      case "founding_member":
        return {
          label: "Founding Member",
          icon: Crown,
          color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
          bgGradient: "from-purple-500/5 to-purple-500/10"
        };
      case "partner":
        return {
          label: "Equity Partner",
          icon: Star,
          color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          bgGradient: "from-emerald-500/5 to-emerald-500/10"
        };
      case "active":
      default:
        return {
          label: "Active Member",
          icon: CheckCircle,
          color: "bg-primary/10 text-primary border-primary/20",
          bgGradient: "from-primary/5 to-primary/10"
        };
    }
  };

  const getTierConfig = (tier: string) => {
    switch (tier) {
      case "platinum":
        return { color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" };
      case "gold":
        return { color: "text-gold", bg: "bg-gold/10", border: "border-gold/20" };
      case "silver":
      default:
        return { color: "text-muted-foreground", bg: "bg-muted/10", border: "border-muted/20" };
    }
  };

  const statusConfig = getStatusConfig(profile.status);
  const tierConfig = getTierConfig(profile.tier);

  const getPrimaryAction = () => {
    switch (profile.status) {
      case "reserved":
        return (
          <Button 
            onClick={() => onClaimProfile?.(profile)}
            className="w-full bg-gold hover:bg-gold/90 text-gold-foreground"
          >
            <Crown className="h-4 w-4 mr-2" />
            Claim Your VIP Portal
          </Button>
        );
      case "active":
      case "founding_member":
      case "partner":
        return (
          <Button 
            onClick={() => onViewProfile?.(profile)}
            variant="outline"
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Profile
          </Button>
        );
      default:
        return (
          <Button 
            onClick={() => onRequestInvite?.(profile)}
            variant="outline"
            className="w-full"
          >
            Request Invitation
          </Button>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl",
        profile.status === "reserved" ? "border-gold/30 hover:border-gold/50" : 
        profile.status === "founding_member" ? "border-purple-500/30 hover:border-purple-500/50" :
        profile.status === "partner" ? "border-emerald-500/30 hover:border-emerald-500/50" :
        "border-primary/20 hover:border-primary/40"
      )}>
        {/* Background gradient */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-30",
          statusConfig.bgGradient
        )} />
        
        {/* Premium corner accent */}
        {profile.tier === "platinum" && (
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] border-t-purple-500/20" />
        )}
        
        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                <AvatarImage src={profile.profileImage} alt={profile.name} />
                <AvatarFallback className={cn("font-semibold", tierConfig.bg, tierConfig.color)}>
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg truncate">{profile.name}</h3>
                  {profile.isVerified && (
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  )}
                  {profile.tier === "platinum" && (
                    <Sparkles className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm font-medium text-primary truncate">{profile.title}</p>
                <p className="text-xs text-muted-foreground truncate">{profile.organization}</p>
              </div>
            </div>
            
            <Badge className={cn("text-xs", statusConfig.color)}>
              <statusConfig.icon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {profile.location}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-3 w-3" />
              {profile.category}
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {profile.description}
          </p>

          {profile.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {profile.specialties.slice(0, 3).map((specialty, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs py-0 px-2"
                >
                  {specialty}
                </Badge>
              ))}
              {profile.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs py-0 px-2">
                  +{profile.specialties.length - 3}
                </Badge>
              )}
            </div>
          )}

          {profile.achievements && profile.achievements.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Award className="h-3 w-3" />
              <span className="truncate">{profile.achievements[0]}</span>
            </div>
          )}

          <div className="pt-2">
            {getPrimaryAction()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}