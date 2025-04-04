
import React from "react";
import { Link } from "react-router-dom";

export const FooterSection: React.FC = () => {
  return (
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
  );
};
