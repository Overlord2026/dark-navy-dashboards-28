
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle, Shield, Users, BarChart3, FileText, CreditCard } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F7E8]">
      {/* Header */}
      <header className="w-full flex justify-center items-center py-4 border-b border-[#DCD8C0] bg-[#F9F7E8] sticky top-0 z-50">
        <div className="container flex justify-between items-center max-w-7xl px-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
              alt="Boutique Family Office Logo" 
              className="h-16 w-auto"
            />
          </div>
          <div className="hidden md:flex gap-8 text-[#222222]">
            <a href="#services" className="hover:text-primary font-medium">Services</a>
            <a href="#about" className="hover:text-primary font-medium">About Us</a>
            <a href="#contact" className="hover:text-primary font-medium">Contact</a>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/advisor/login">Advisor Login</Link>
            </Button>
            <Button className="bg-black text-white hover:bg-black/80" asChild>
              <Link to="/">Client Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-[#1B1B32] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Financial Expertise Tailored for Your Legacy</h1>
            <p className="text-xl mb-8 text-gray-300">
              Boutique Family Office provides comprehensive wealth management services designed specifically for high-net-worth individuals and families.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-[#1B1B32] hover:bg-white/90" asChild>
                <Link to="/">
                  Client Portal 
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <a href="#services">Explore Services</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-[#F9F7E8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#222222]">Comprehensive Financial Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our team of experienced professionals provides a wide range of services to help you manage, grow, and protect your wealth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-12 w-12 mb-4 text-primary" />,
                title: "Wealth Management",
                description: "Strategic investment planning and portfolio management tailored to your financial goals."
              },
              {
                icon: <FileText className="h-12 w-12 mb-4 text-primary" />,
                title: "Estate Planning",
                description: "Comprehensive legacy planning to protect and transfer your wealth to future generations."
              },
              {
                icon: <Shield className="h-12 w-12 mb-4 text-primary" />,
                title: "Risk Management",
                description: "Identify and mitigate risks through insurance solutions and protective strategies."
              },
              {
                icon: <CreditCard className="h-12 w-12 mb-4 text-primary" />,
                title: "Banking & Lending",
                description: "Access to premium banking services and customized lending solutions."
              },
              {
                icon: <Users className="h-12 w-12 mb-4 text-primary" />,
                title: "Family Governance",
                description: "Facilitate family meetings and develop governance structures for multigenerational wealth."
              },
              {
                icon: <FileText className="h-12 w-12 mb-4 text-primary" />,
                title: "Tax Planning",
                description: "Strategic tax planning to optimize your financial position and minimize tax liabilities."
              }
            ].map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-[#DCD8C0] hover:shadow-md transition-all">
                {service.icon}
                <h3 className="text-xl font-semibold mb-3 text-[#222222]">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="about" className="py-20 px-4 bg-[#1B1B32] text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="hidden md:block">
            <img 
              src="/lovable-uploads/4f186128-9b08-4965-a540-64cf9b0ec9ee.png" 
              alt="Financial Advisors" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Boutique Family Office</h2>
            <div className="space-y-6">
              {[
                {
                  title: "Personalized Service",
                  description: "Our advisors provide dedicated attention to your unique financial situation."
                },
                {
                  title: "Expertise & Experience",
                  description: "Our team brings decades of experience in wealth management and financial planning."
                },
                {
                  title: "Fiduciary Responsibility",
                  description: "We always act in your best interest, providing objective advice and solutions."
                },
                {
                  title: "Comprehensive Approach",
                  description: "We address all aspects of your financial life for a holistic wealth strategy."
                }
              ].map((point, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-1">{point.title}</h3>
                    <p className="text-gray-300">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="contact" className="py-16 px-4 bg-[#F9F7E8]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#222222]">Ready to Secure Your Financial Future?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Take the first step towards comprehensive wealth management with Boutique Family Office. Our advisors are ready to help you achieve your financial goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-black text-white hover:bg-black/80" asChild>
              <Link to="/login">Access Client Portal</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-black text-black hover:bg-black/10" asChild>
              <a href="mailto:contact@boutiquefamilyoffice.com">Contact an Advisor</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[#1B1B32] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img 
                src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
                alt="Boutique Family Office Logo" 
                className="h-16 w-auto mb-4"
              />
              <p className="text-gray-300">
                Comprehensive wealth management for high-net-worth individuals and families.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-primary">Wealth Management</a></li>
                <li><a href="#" className="hover:text-primary">Estate Planning</a></li>
                <li><a href="#" className="hover:text-primary">Tax Planning</a></li>
                <li><a href="#" className="hover:text-primary">Risk Management</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Our Team</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Disclosures</a></li>
                <li><a href="#" className="hover:text-primary">Accessibility</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Boutique Family Office. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
