
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ServicesPage() {
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
          
          <h1 className="text-4xl font-bold mb-8 text-[#222222]">Our Services</h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#DCD8C0]">
              <h2 className="text-2xl font-semibold mb-4 text-[#222222]">Wealth Management</h2>
              <p className="text-gray-600 mb-4">
                Strategic investment planning and portfolio management tailored to your financial goals and risk tolerance.
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Personalized investment strategies</li>
                <li>Portfolio diversification</li>
                <li>Asset allocation</li>
                <li>Regular portfolio reviews</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#DCD8C0]">
              <h2 className="text-2xl font-semibold mb-4 text-[#222222]">Estate Planning</h2>
              <p className="text-gray-600 mb-4">
                Comprehensive legacy planning to protect and transfer your wealth to future generations efficiently.
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Trust establishment and management</li>
                <li>Inheritance planning</li>
                <li>Legacy preservation</li>
                <li>Charitable giving strategies</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#DCD8C0]">
              <h2 className="text-2xl font-semibold mb-4 text-[#222222]">Tax Planning</h2>
              <p className="text-gray-600 mb-4">
                Strategic tax planning to optimize your financial position and minimize tax liabilities.
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Tax-efficient investment strategies</li>
                <li>Income tax planning</li>
                <li>Capital gains strategies</li>
                <li>Retirement tax planning</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#DCD8C0]">
              <h2 className="text-2xl font-semibold mb-4 text-[#222222]">Risk Management</h2>
              <p className="text-gray-600 mb-4">
                Identify and mitigate risks through insurance solutions and protective strategies.
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Insurance needs analysis</li>
                <li>Policy review and optimization</li>
                <li>Asset protection strategies</li>
                <li>Business continuity planning</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#DCD8C0]">
              <h2 className="text-2xl font-semibold mb-4 text-[#222222]">Banking & Lending</h2>
              <p className="text-gray-600 mb-4">
                Access to premium banking services and customized lending solutions.
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Securities-based lending</li>
                <li>Mortgage solutions</li>
                <li>Business financing</li>
                <li>Private banking services</li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-[#DCD8C0]">
              <h2 className="text-2xl font-semibold mb-4 text-[#222222]">Family Governance</h2>
              <p className="text-gray-600 mb-4">
                Facilitate family meetings and develop governance structures for multigenerational wealth.
              </p>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Family mission and values development</li>
                <li>Next generation education</li>
                <li>Family meeting facilitation</li>
                <li>Conflict resolution strategies</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-[#1B1B32] text-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Ready to get started?</h2>
            <p className="mb-6">
              Our team of experienced advisors is ready to help you build a comprehensive wealth management strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-[#1B1B32] hover:bg-white/90" asChild>
                <Link to="/login">Access Client Portal</Link>
              </Button>
              <Button size="lg" className="bg-white text-[#1B1B32] hover:bg-white/90" asChild>
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
