
import React from "react";
import { BarChart3, FileText, Shield, CreditCard, Users } from "lucide-react";

export const ServicesSection: React.FC = () => {
  const services = [
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
  ];

  return (
    <section id="services" className="py-20 px-4 bg-[#F9F7E8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#222222]">Comprehensive Financial Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our team of experienced professionals provides a wide range of services to help you manage, grow, and protect your wealth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm border border-[#DCD8C0] hover:shadow-md transition-all">
              {service.icon}
              <h3 className="text-xl font-semibold mb-3 text-[#222222]">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
