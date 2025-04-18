
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PersonalInfoFieldsProps {
  formData: {
    name: string;
    company: string;
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function PersonalInfoFields({ formData, handleChange }: PersonalInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input 
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input 
            id="company"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone"
            name="phone"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            name="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleChange}
            type="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input 
          id="website"
          name="website"
          placeholder="https://example.com"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input 
          id="address"
          name="address"
          placeholder="123 Main St, City, State, Zip"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
    </>
  );
}
