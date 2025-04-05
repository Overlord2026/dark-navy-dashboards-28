
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { 
  HomeLoansContent,
  PersonalLoansContent,
  CommercialLoansContent,
  SecuritiesBasedLoansContent,
  SpecialtyLoansContent
} from "@/components/lending";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LendingPage = () => {
  return (
    <ThreeColumnLayout activeMainItem="education-solutions" title="Lending Solutions">
      <div className="p-6 mx-auto max-w-7xl animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Lending Solutions</h1>
        <p className="text-muted-foreground mb-6">
          Explore our comprehensive lending solutions tailored to your financial needs.
        </p>

        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
            <TabsTrigger value="home">Home Loans</TabsTrigger>
            <TabsTrigger value="personal">Personal Loans</TabsTrigger>
            <TabsTrigger value="commercial">Commercial Loans</TabsTrigger>
            <TabsTrigger value="securities">Securities-Based</TabsTrigger>
            <TabsTrigger value="specialty">Specialty Lending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="home">
            <HomeLoansContent />
          </TabsContent>
          
          <TabsContent value="personal">
            <PersonalLoansContent />
          </TabsContent>
          
          <TabsContent value="commercial">
            <CommercialLoansContent />
          </TabsContent>
          
          <TabsContent value="securities">
            <SecuritiesBasedLoansContent />
          </TabsContent>
          
          <TabsContent value="specialty">
            <SpecialtyLoansContent />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default LendingPage;
