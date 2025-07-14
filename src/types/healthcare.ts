// Healthcare-specific types for integration
export interface HealthcareProvider {
  id: string;
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  rating?: number;
}

export interface HealthcareDocument {
  id: string;
  name: string;
  type: string;
  category: string;
  file_path?: string;
  content_type?: string;
  size?: number;
  created_at: string;
  updated_at: string;
  is_private: boolean;
  shared: boolean;
  tags?: string[];
}

export interface HealthcareMetric {
  id: string;
  type: string;
  value: string;
  unit?: string;
  date: string;
  notes?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface HealthcareAlert {
  id: string;
  type: 'appointment' | 'medication' | 'test' | 'general';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'dismissed' | 'resolved';
  due_date?: string;
  created_at: string;
}

export interface HealthcareGoal {
  id: string;
  title: string;
  description?: string;
  target_value?: string;
  current_value?: string;
  target_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  category: string;
}

// Navigation and component types
export interface HealthcareNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  description?: string;
}

export interface HealthCardProps {
  title: string;
  value?: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  status?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
  className?: string;
}

// Theme types
export interface HealthcareTheme {
  isLightTheme: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}