
import React from 'react';
import { Link } from 'react-router-dom';

import { useUser } from '@/context/UserContext';
import { AdminActions } from '@/components/dashboard/AdminActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageTransition, StaggerContainer } from '@/components/animations/PageTransition';
import { motion } from 'framer-motion';
import { 
  Home, 
  Target, 
  CreditCard, 
  GraduationCap, 
  Users, 
  MessageSquare, 
  Settings,
  ArrowRight 
} from 'lucide-react';

export function HomePage() {
  const { userProfile } = useUser();

  const navigationItems = [
    {
      title: "Home Dashboard",
      description: "Overview of your family office",
      href: "/home-tab",
      icon: Home,
      color: "bg-blue-500"
    },
    {
      title: "Goals & Aspirations",
      description: "Set and track financial goals",
      href: "/goals",
      icon: Target,
      color: "bg-green-500"
    },
    {
      title: "Accounts",
      description: "Portfolio and account management",
      href: "/accounts-tab",
      icon: CreditCard,
      color: "bg-purple-500"
    },
    {
      title: "Education",
      description: "Financial education resources",
      href: "/education-tab",
      icon: GraduationCap,
      color: "bg-orange-500"
    },
    {
      title: "Family Wealth",
      description: "Wealth management tools",
      href: "/family-wealth-tab",
      icon: Users,
      color: "bg-indigo-500"
    },
    {
      title: "Collaboration",
      description: "Family member collaboration",
      href: "/collaboration-tab",
      icon: MessageSquare,
      color: "bg-pink-500"
    },
    {
      title: "Settings",
      description: "Account and system settings",
      href: "/settings-tab",
      icon: Settings,
      color: "bg-gray-500"
    }
  ];

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
          <StaggerContainer className="space-y-8">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <h1 className="text-4xl font-bold mb-2">Welcome to <img src="/brand/bfo-logo-gold.svg" alt="BFO" className="inline h-8 w-auto" /></h1>
              <p className="text-xl text-muted-foreground">
                Comprehensive wealth management and family office solutions
              </p>
            </motion.div>

            {userProfile && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      Welcome back, {userProfile.name || userProfile.email}
                    </CardTitle>
                    <CardDescription>
                      Role: {userProfile.role} • Last login: Today
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )}

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <h2 className="text-2xl font-semibold mb-6">Navigate Your Platform</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {navigationItems.map((item) => (
                  <Button
                    key={item.href}
                    variant="outline"
                    className="h-auto p-6 flex flex-col items-start space-y-3 hover:shadow-lg transition-all duration-200 group"
                    asChild
                  >
                    <Link to={item.href}>
                      <div className={`p-3 rounded-lg ${item.color} text-white group-hover:scale-110 transition-transform`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-base">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </Button>
                ))}
              </div>
            </motion.div>

            {userProfile && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <AdminActions />
              </motion.div>
            )}
          </StaggerContainer>
        </div>
      </PageTransition>
  );
}
