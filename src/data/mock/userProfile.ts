export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone?: string;
  title?: string;
  suffix?: string;
  dateOfBirth?: Date | string;
  gender?: string;
  maritalStatus?: string;
  addresses: Address[];
  role: "client" | "advisor" | "admin" | "developer" | "system_administrator";
  advisorId?: string;
  profileImage?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  preferences: UserPreferences;
  // Add missing fields
  displayName?: string;
  investorType?: string;
  name?: string;
}

interface Address {
  type: "home" | "work" | "mailing" | "other";
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary: boolean;
}

interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboardLayout?: string[];
  language: string;
}

export const mockUserProfile: UserProfile = {
  id: "usr_123456789",
  firstName: "Tom",
  lastName: "Brady",
  middleName: "",
  email: "tom.brady@example.com",
  phone: "+1 (555) 123-4567",
  title: "Mr",
  suffix: "",
  dateOfBirth: new Date("1985-05-03"),
  gender: "Male",
  maritalStatus: "Married",
  addresses: [
    {
      type: "home",
      street1: "123 Main Street",
      street2: "Apt 4B",
      city: "Boston",
      state: "MA",
      zipCode: "02108",
      country: "United States",
      isPrimary: true
    },
    {
      type: "mailing",
      street1: "456 Business Ave",
      street2: "Suite 300",
      city: "Boston",
      state: "MA",
      zipCode: "02110",
      country: "United States",
      isPrimary: false
    }
  ],
  role: "client",
  advisorId: "adv_987654321",
  profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
  lastLogin: "2024-04-04T14:32:15Z",
  createdAt: "2023-01-15T09:20:34Z",
  updatedAt: "2024-04-04T14:32:15Z",
  preferences: {
    theme: "system",
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    dashboardLayout: ["financialOverview", "netWorth", "recentActivity", "quickActions"],
    language: "en-US"
  },
  displayName: "Tom Brady",
  investorType: "Growth Investor",
  name: "Tom Brady"
};
