
import React from "react";
import { HeaderComponent } from "@/components/home/HeaderComponent";
import { LogoHeroSection } from "@/components/home/LogoHeroSection";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { CallToActionSection } from "@/components/home/CallToActionSection";
import { FooterSection } from "@/components/home/FooterSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F7E8]">
      <HeaderComponent />
      <LogoHeroSection />
      <HeroSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
}
