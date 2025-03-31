import { useState, useEffect } from "react";
import { FamilyOffice, Service, TeamMember, Review } from "@/types/familyoffice";
import { fetchFamilyOffices } from '../api/marketplaceApiService';

export function useFamilyOfficeData() {
  const [isLoading, setIsLoading] = useState(true);
  const [familyOffices, setFamilyOffices] = useState<FamilyOffice[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const apiFamilyOffices = await fetchFamilyOffices();
        
        if (apiFamilyOffices.length > 0) {
          setFamilyOffices(apiFamilyOffices);
        } else {
          const sampleServices: Service[] = [
            {
              id: "s1",
              name: "Wealth Management",
              description: "Comprehensive wealth management services tailored to high-net-worth individuals and families."
            },
            {
              id: "s2",
              name: "Tax Planning",
              description: "Strategic tax planning to minimize tax burden and maximize wealth preservation."
            },
            {
              id: "s3",
              name: "Estate Planning",
              description: "Comprehensive estate planning services to protect and transfer wealth across generations."
            },
            {
              id: "s4",
              name: "Private Banking",
              description: "Exclusive banking services for high-net-worth clients."
            }
          ];

          const sampleTeamMembers: TeamMember[] = [
            {
              id: "tm1",
              name: "John Smith",
              title: "Managing Director",
              image: "/lovable-uploads/9d138e85-d6e9-4083-ad34-147b3fc524ab.png",
              bio: "Over 25 years of experience in wealth management for ultra-high-net-worth clients."
            },
            {
              id: "tm2",
              name: "Jane Doe",
              title: "Senior Wealth Advisor",
              image: "/lovable-uploads/de09b008-ad83-47b7-a3bf-d51532be0261.png",
              bio: "Specializes in multi-generational wealth planning and family governance."
            }
          ];

          const sampleReviews: Review[] = [
            {
              id: "r1",
              clientName: "Anonymous Client",
              rating: 5,
              date: "2023-08-15",
              comment: "Exceptional service and attention to detail. They have transformed our family's approach to wealth management.",
              response: null
            },
            {
              id: "r2",
              clientName: "Legacy Client",
              rating: 4,
              date: "2023-07-22",
              comment: "Very professional team with deep expertise in complex tax planning strategies.",
              response: "Thank you for your kind words! We're glad to be of service to your family."
            }
          ];

          const sampleFamilyOffices: FamilyOffice[] = [
            {
              id: "fo1",
              name: "Alpine Family Office",
              description: "A boutique multi-family office serving high-net-worth families with comprehensive wealth management solutions.",
              location: "New York, NY",
              foundedYear: 2005,
              clientCount: 45,
              aum: 3.5,
              minimumAssets: 10,
              tier: "advanced",
              wealthTiers: ["hnw", "uhnw"],
              rating: 4.8,
              reviewCount: 26,
              services: sampleServices,
              team: sampleTeamMembers,
              reviews: sampleReviews,
              website: "https://example.com"
            },
            {
              id: "fo2",
              name: "Horizon Wealth Partners",
              description: "A holistic family office focused on integrated wealth management and legacy planning for affluent families.",
              location: "Chicago, IL",
              foundedYear: 2012,
              clientCount: 30,
              aum: 1.8,
              minimumAssets: 5,
              tier: "intermediate",
              wealthTiers: ["affluent", "hnw"],
              rating: 4.5,
              reviewCount: 18,
              services: sampleServices.slice(0, 3),
              team: sampleTeamMembers.slice(0, 1),
              reviews: sampleReviews.slice(0, 1)
            },
            {
              id: "fo3",
              name: "Legacy Trust Company",
              description: "A century-old family office with expertise in generational wealth transfer and trust management.",
              location: "Boston, MA",
              foundedYear: 1923,
              clientCount: 75,
              aum: 8.2,
              minimumAssets: 25,
              tier: "advanced",
              wealthTiers: ["uhnw"],
              rating: 4.9,
              reviewCount: 42,
              services: [...sampleServices, {
                id: "s5",
                name: "Family Governance",
                description: "Structured governance frameworks for complex family systems."
              }],
              team: [...sampleTeamMembers, {
                id: "tm3",
                name: "Robert Johnson",
                title: "Chief Investment Officer",
                image: "/lovable-uploads/7faf1d1a-8aff-4541-8400-18aa687704e7.png",
                bio: "Former hedge fund manager with 30+ years of investment experience."
              }],
              reviews: sampleReviews
            }
          ];

          setFamilyOffices(sampleFamilyOffices);
        }
      } catch (err) {
        console.error("Error loading family office data:", err);
        setError("Failed to load family office data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    familyOffices,
    isLoading,
    error,
    refetch: async () => {
      console.log("API Integration Placeholder: refetch family office data");
    }
  };
}
