
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AccessibilityPage() {
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
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" className="mb-6" asChild>
            <Link to="/home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <h1 className="text-4xl font-bold mb-8 text-[#222222]">Accessibility</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-[#DCD8C0] prose max-w-none">
            <p className="text-gray-700">Last updated: April 3, 2025</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#222222]">Our Commitment</h2>
            <p className="text-gray-700">
              Boutique Family Office is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#222222]">Conformance Status</h2>
            <p className="text-gray-700">
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. Boutique Family Office's website is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#222222]">Accessibility Features</h2>
            <p className="text-gray-700">
              Our website provides the following accessibility features:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Text alternatives for non-text content</li>
              <li>Captions and other alternatives for multimedia</li>
              <li>Content can be presented in different ways</li>
              <li>Content is easier to see and hear</li>
              <li>Users have enough time to read and use the content</li>
              <li>Content does not cause seizures or physical reactions</li>
              <li>Users can easily navigate, find content, and determine where they are</li>
              <li>Content is readable and understandable</li>
              <li>Content appears and operates in predictable ways</li>
              <li>Users are helped to avoid and correct mistakes</li>
              <li>Content is compatible with current and future user tools</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#222222]">Feedback</h2>
            <p className="text-gray-700">
              We welcome your feedback on the accessibility of the Boutique Family Office website. Please let us know if you encounter accessibility barriers:
            </p>
            <address className="text-gray-700 not-italic">
              Boutique Family Office<br />
              123 Financial District<br />
              New York, NY 10001<br />
              Email: accessibility@boutiquefamilyoffice.com<br />
              Phone: (555) 123-4567
            </address>
            
            <p className="text-gray-700 mt-4">
              We try to respond to feedback within 3 business days.
            </p>
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
