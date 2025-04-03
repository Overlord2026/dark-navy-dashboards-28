
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      title: "Chief Executive Officer",
      image: "/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png",
      bio: "With over 20 years of experience in wealth management, Sarah leads our team with expertise in strategic financial planning for high-net-worth clients."
    },
    {
      name: "Michael Chen",
      title: "Chief Investment Officer",
      image: "/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png",
      bio: "Michael brings 15 years of investment banking experience to develop sophisticated portfolio strategies that align with clients' long-term goals."
    },
    {
      name: "James Wilson",
      title: "Estate Planning Director",
      image: "/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png",
      bio: "Former trust attorney with expertise in complex estate structures and generational wealth transfer strategies."
    },
    {
      name: "Rebecca Martinez",
      title: "Tax Strategy Specialist",
      image: "/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png",
      bio: "CPA with 12 years of experience in tax optimization strategies for high-net-worth individuals and family offices."
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
          
          <h1 className="text-4xl font-bold mb-8 text-[#222222]">Our Team</h1>
          
          <p className="text-lg text-gray-700 mb-12 max-w-3xl">
            Our team of experienced professionals brings expertise from diverse backgrounds in finance, law, accounting, and business management to provide comprehensive wealth management solutions.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-[#DCD8C0] flex flex-col">
                <div className="mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-64 object-cover rounded-md"
                  />
                </div>
                <h2 className="text-xl font-semibold text-[#222222]">{member.name}</h2>
                <p className="text-primary font-medium mb-3">{member.title}</p>
                <p className="text-gray-600 flex-grow mb-4">{member.bio}</p>
                <Button variant="outline" className="w-full">View Profile</Button>
              </div>
            ))}
          </div>
          
          <div className="text-center bg-[#1B1B32] text-white p-8 rounded-lg shadow-md mb-16">
            <h2 className="text-2xl font-semibold mb-4">Join Our Team</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              We're always looking for talented professionals who are passionate about helping clients achieve their financial goals.
            </p>
            <Button size="lg" className="bg-white text-[#1B1B32] hover:bg-white/90" asChild>
              <Link to="/careers">View Career Opportunities</Link>
            </Button>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm border border-[#DCD8C0]">
            <h2 className="text-2xl font-semibold mb-6 text-center text-[#222222]">Schedule a Meeting with Our Team</h2>
            <p className="text-center text-gray-700 mb-6">
              Interested in learning more about how we can help you achieve your financial goals? Schedule a consultation with one of our advisors.
            </p>
            <div className="flex justify-center">
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
