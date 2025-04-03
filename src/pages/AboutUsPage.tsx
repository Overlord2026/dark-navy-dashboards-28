
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F7E8]">
      {/* Header */}
      <header className="w-full flex justify-center items-center py-4 border-b border-[#DCD8C0] bg-[#F9F7E8] sticky top-0 z-50">
        <div className="container flex justify-between items-center max-w-7xl px-4">
          <div className="flex items-center">
            <Link to="/home">
              <img 
                src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
                alt="Boutique Family Office Logo" 
                className="h-16 w-auto"
              />
            </Link>
          </div>
          <div className="hidden md:flex gap-8 text-[#222222]">
            <Link to="/services" className="hover:text-primary font-medium">Services</Link>
            <Link to="/about" className="hover:text-primary font-medium">About Us</Link>
            <Link to="/contact" className="hover:text-primary font-medium">Contact</Link>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/advisor/login">Advisor Login</Link>
            </Button>
            <Button className="bg-black text-white hover:bg-black/80" asChild>
              <Link to="/login">Client Login</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Button variant="ghost" className="mb-6" asChild>
            <Link to="/home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <h1 className="text-4xl font-bold mb-8 text-[#222222]">About Boutique Family Office</h1>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16 items-start">
            <div>
              <p className="text-lg text-gray-700 mb-6">
                Founded on principles of trust, expertise, and personalized service, Boutique Family Office was established to provide comprehensive wealth management solutions to high-net-worth individuals and families.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Our approach is both strategic and holistic, addressing all aspects of financial well-being while focusing on long-term legacy building and wealth preservation across generations.
              </p>
              <p className="text-lg text-gray-700">
                With decades of combined experience in financial services, our team of dedicated professionals works closely with each client to understand their unique needs, goals, and aspirations.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-[#222222]">Our Values</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#1B1B32] flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h3 className="text-xl font-medium mb-1 text-[#222222]">Integrity</h3>
                    <p className="text-gray-600">We maintain the highest ethical standards and always act in our clients' best interests.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#1B1B32] flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h3 className="text-xl font-medium mb-1 text-[#222222]">Excellence</h3>
                    <p className="text-gray-600">We strive for excellence in everything we do, from investment strategies to client service.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#1B1B32] flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h3 className="text-xl font-medium mb-1 text-[#222222]">Transparency</h3>
                    <p className="text-gray-600">We believe in clear, open communication and full disclosure about our services and fees.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#1B1B32] flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h3 className="text-xl font-medium mb-1 text-[#222222]">Innovation</h3>
                    <p className="text-gray-600">We continuously seek innovative solutions to help our clients navigate complex financial landscapes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="py-12 px-8 bg-[#1B1B32] text-white rounded-lg shadow-md mb-16">
            <h2 className="text-3xl font-semibold mb-6 text-center">Our Mission</h2>
            <p className="text-xl text-center max-w-3xl mx-auto">
              To empower our clients to achieve financial security and build lasting legacies through personalized wealth management strategies and exceptional service.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-[#DCD8C0] mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-[#222222]">Why Choose Us?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-medium mb-2 text-[#222222]">Personalized Service</h3>
                <p className="text-gray-600">
                  We limit our client base to ensure each relationship receives the attention it deserves. Your dedicated advisor will get to know you, your family, and your goals intimately.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-[#222222]">Fiduciary Responsibility</h3>
                <p className="text-gray-600">
                  As fiduciaries, we are legally obligated to act in your best interest at all times, providing unbiased advice and recommendations.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-[#222222]">Comprehensive Approach</h3>
                <p className="text-gray-600">
                  We take a holistic view of your financial life, integrating all aspects into a cohesive strategy aligned with your goals.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 text-[#222222]">Expert Team</h3>
                <p className="text-gray-600">
                  Our team includes certified financial planners, investment advisors, tax specialists, and estate planning professionals with decades of combined experience.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6 text-[#222222]">Ready to take the next step?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-black text-white hover:bg-black/80" asChild>
                <Link to="/login">Access Client Portal</Link>
              </Button>
              <Button size="lg" className="bg-black text-white hover:bg-black/80" asChild>
                <Link to="/contact">Contact an Advisor</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

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
                <li><Link to="/services" className="hover:text-primary">Wealth Management</Link></li>
                <li><Link to="/services" className="hover:text-primary">Estate Planning</Link></li>
                <li><Link to="/services" className="hover:text-primary">Tax Planning</Link></li>
                <li><Link to="/services" className="hover:text-primary">Risk Management</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link to="/team" className="hover:text-primary">Our Team</Link></li>
                <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link to="/disclosures" className="hover:text-primary">Disclosures</Link></li>
                <li><Link to="/accessibility" className="hover:text-primary">Accessibility</Link></li>
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
