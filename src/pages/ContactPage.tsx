
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
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
          
          <h1 className="text-4xl font-bold mb-8 text-[#222222]">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-[#222222]">Get in Touch</h2>
              <p className="text-gray-700 mb-8">
                We're here to answer your questions and help you take the next step towards comprehensive wealth management. Reach out to us using the contact form or through any of our contact methods below.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-[#1B1B32] flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium mb-1 text-[#222222]">Phone</h3>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-[#1B1B32] flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium mb-1 text-[#222222]">Email</h3>
                    <p className="text-gray-600">contact@boutiquefamilyoffice.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-[#1B1B32] flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium mb-1 text-[#222222]">Office</h3>
                    <p className="text-gray-600">
                      123 Financial District<br />
                      New York, NY 10001<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white p-8 rounded-lg shadow-sm border border-[#DCD8C0]">
                <h2 className="text-2xl font-semibold mb-6 text-[#222222]">Send Us a Message</h2>
                
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B1B32]" 
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B1B32]" 
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B1B32]" 
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B1B32]" 
                      placeholder="How can we help you?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea 
                      id="message" 
                      rows={4} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1B1B32]" 
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>
                  
                  <Button type="submit" className="bg-black text-white hover:bg-black/80 w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1B1B32] text-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">Schedule a Consultation</h2>
            <p className="text-center mb-6">
              Interested in learning more about our services? Schedule a no-obligation consultation with one of our advisors.
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="bg-white text-[#1B1B32] hover:bg-white/90">
                Book a Meeting
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
