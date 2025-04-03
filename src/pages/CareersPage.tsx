
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Financial Advisor",
      location: "New York, NY",
      type: "Full-Time",
      description: "We're seeking an experienced financial advisor with 10+ years of experience in wealth management for high-net-worth individuals."
    },
    {
      title: "Estate Planning Specialist",
      location: "Remote / New York, NY",
      type: "Full-Time",
      description: "Looking for an experienced estate planning specialist with a background in legal and financial advisory for high-net-worth families."
    },
    {
      title: "Client Services Associate",
      location: "New York, NY",
      type: "Full-Time",
      description: "Join our team as a client services associate to provide exceptional support to our clients and advisory team."
    }
  ];

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
          
          <h1 className="text-4xl font-bold mb-8 text-[#222222]">Careers</h1>
          
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-[#222222]">Join Our Team</h2>
            <p className="text-lg text-gray-700 mb-6">
              At Boutique Family Office, we're building a team of exceptional professionals who are passionate about providing comprehensive wealth management solutions to high-net-worth individuals and families.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              We offer competitive compensation, excellent benefits, and a collaborative culture that promotes growth and development. If you're interested in joining our team, explore our current openings below.
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold mb-6 text-[#222222]">Current Openings</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-[#DCD8C0]">
                <h3 className="text-xl font-semibold mb-2 text-[#222222]">{position.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{position.location}</span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{position.type}</span>
                </div>
                <p className="text-gray-600 mb-4">{position.description}</p>
                <Button variant="outline">View Details</Button>
              </div>
            ))}
          </div>
          
          <div className="bg-[#1B1B32] text-white p-8 rounded-lg shadow-md text-center mb-16">
            <h2 className="text-2xl font-semibold mb-4">Don't see a position that fits?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              We're always interested in connecting with talented professionals. Send us your resume for future opportunities.
            </p>
            <Button size="lg" className="bg-white text-[#1B1B32] hover:bg-white/90">
              Submit Your Resume
            </Button>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-[#DCD8C0]">
            <h2 className="text-2xl font-semibold mb-6 text-center text-[#222222]">Why Work With Us</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-xl font-medium mb-3 text-[#222222]">Professional Growth</h3>
                <p className="text-gray-600">
                  We invest in our team's professional development with ongoing education and mentorship.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-medium mb-3 text-[#222222]">Collaborative Culture</h3>
                <p className="text-gray-600">
                  Work in a supportive environment that values teamwork and knowledge sharing.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-medium mb-3 text-[#222222]">Work-Life Balance</h3>
                <p className="text-gray-600">
                  We respect and encourage a healthy balance between professional and personal life.
                </p>
              </div>
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
