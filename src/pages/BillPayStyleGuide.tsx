
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CreditCard, Plus, Check, ArrowUp, Wallet, Receipt, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const BillPayStyleGuide = () => {
  return (
    <ThreeColumnLayout title="Bill Pay Style Guide">
      <div className="space-y-12 px-4 py-6 max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bill Pay Module Style Guide</h1>
          <p className="text-muted-foreground">
            A comprehensive guide for design system components used in the Bill Pay module
          </p>
        </header>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Color Palette</CardTitle>
            <CardDescription>
              The primary colors used throughout the Bill Pay module
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <div className="h-20 rounded-md bg-primary"></div>
                <p className="mt-2 font-medium">Primary Yellow</p>
                <p className="text-xs text-muted-foreground">
                  #FFC90E (--primary)
                </p>
                <p className="text-xs text-muted-foreground">
                  Buttons, accents, important indicators
                </p>
              </div>
              
              <div className="flex flex-col">
                <div className="h-20 rounded-md bg-[#222222]"></div>
                <p className="mt-2 font-medium">Rich Black</p>
                <p className="text-xs text-muted-foreground">#222222</p>
                <p className="text-xs text-muted-foreground">
                  Text, icons, dark backgrounds
                </p>
              </div>
              
              <div className="flex flex-col">
                <div className="h-20 rounded-md bg-[#E9E7D8]"></div>
                <p className="mt-2 font-medium">Soft Cream</p>
                <p className="text-xs text-muted-foreground">#E9E7D8</p>
                <p className="text-xs text-muted-foreground">
                  Secondary backgrounds, hover states
                </p>
              </div>

              <div className="flex flex-col">
                <div className="h-20 rounded-md bg-[#F9F7E8]"></div>
                <p className="mt-2 font-medium">Light Background</p>
                <p className="text-xs text-muted-foreground">#F9F7E8</p>
                <p className="text-xs text-muted-foreground">
                  Main background in light mode
                </p>
              </div>

              <div className="flex flex-col">
                <div className="h-20 rounded-md bg-green-600"></div>
                <p className="mt-2 font-medium">Success Green</p>
                <p className="text-xs text-muted-foreground">#16A34A</p>
                <p className="text-xs text-muted-foreground">
                  Confirmations, completed states
                </p>
              </div>

              <div className="flex flex-col">
                <div className="h-20 rounded-md bg-amber-500"></div>
                <p className="mt-2 font-medium">Warning Amber</p>
                <p className="text-xs text-muted-foreground">#F59E0B</p>
                <p className="text-xs text-muted-foreground">
                  Due soon, approaching deadlines
                </p>
              </div>

              <div className="flex flex-col">
                <div className="h-20 rounded-md bg-red-600"></div>
                <p className="mt-2 font-medium">Error Red</p>
                <p className="text-xs text-muted-foreground">#DC2626</p>
                <p className="text-xs text-muted-foreground">
                  Errors, overdue items
                </p>
              </div>

              <div className="flex flex-col">
                <div className="h-20 rounded-md bg-blue-600"></div>
                <p className="mt-2 font-medium">Info Blue</p>
                <p className="text-xs text-muted-foreground">#2563EB</p>
                <p className="text-xs text-muted-foreground">
                  Information, links, actions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Typography</CardTitle>
            <CardDescription>
              Font styles and hierarchies used in Bill Pay
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Primary Font: Inter</h2>
                <p className="mb-2">
                  Inter is the primary font family used throughout the application for its excellent legibility and modern aesthetics.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">Heading 1</h1>
                  <p className="text-sm text-muted-foreground">3xl (30px) | Bold | Used for page titles</p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-semibold">Heading 2</h2>
                  <p className="text-sm text-muted-foreground">2xl (24px) | Semibold | Section headers</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium">Heading 3</h3>
                  <p className="text-sm text-muted-foreground">xl (20px) | Medium | Card titles</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium">Heading 4</h4>
                  <p className="text-sm text-muted-foreground">lg (18px) | Medium | Subsection headers</p>
                </div>
                
                <div>
                  <p className="text-base">Body Text</p>
                  <p className="text-sm text-muted-foreground">base (16px) | Regular | Main content</p>
                </div>
                
                <div>
                  <p className="text-sm">Small Text</p>
                  <p className="text-sm text-muted-foreground">sm (14px) | Regular | Secondary information</p>
                </div>
                
                <div>
                  <p className="text-xs">Extra Small Text</p>
                  <p className="text-sm text-muted-foreground">xs (12px) | Regular | Labels, captions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Buttons</CardTitle>
            <CardDescription>
              Button styles and variants for different actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Primary Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-col items-center">
                    <Button size="lg">Default Button</Button>
                    <p className="mt-2 text-xs text-muted-foreground">Default</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Button size="lg" disabled>Disabled</Button>
                    <p className="mt-2 text-xs text-muted-foreground">Disabled</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Button size="sm">Small</Button>
                    <p className="mt-2 text-xs text-muted-foreground">Small</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      With Icon
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground">With Icon</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Secondary Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-col items-center">
                    <Button variant="outline">Outline</Button>
                    <p className="mt-2 text-xs text-muted-foreground">Outline</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Button variant="ghost">Ghost</Button>
                    <p className="mt-2 text-xs text-muted-foreground">Ghost</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Button variant="link">Link</Button>
                    <p className="mt-2 text-xs text-muted-foreground">Link</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contextual Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-col items-center">
                    <Button variant="success" className="bg-green-600 hover:bg-green-700">
                      <Check className="mr-2 h-4 w-4" />
                      Success
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground">Success</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Button variant="destructive">Destructive</Button>
                    <p className="mt-2 text-xs text-muted-foreground">Destructive</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Button variant="warning" className="bg-yellow-500 hover:bg-yellow-600">Warning</Button>
                    <p className="mt-2 text-xs text-muted-foreground">Warning</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Icon Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-col items-center">
                    <Button size="icon">
                      <Plus className="h-5 w-5" />
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground">Icon Only</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Button variant="outline" size="icon">
                      <Calendar className="h-5 w-5" />
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground">Outline Icon</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Button variant="ghost" size="icon">
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                    <p className="mt-2 text-xs text-muted-foreground">Ghost Icon</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-100 rounded-md">
              <h4 className="font-medium mb-2">Usage Guidelines</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Use primary buttons for main calls to action (Pay Now, Add Bill)</li>
                <li>Use outline buttons for secondary actions (Schedule, Remind Me)</li>
                <li>Use ghost buttons for tertiary actions (View All, Cancel)</li>
                <li>Always include an icon with buttons that initiate a workflow</li>
                <li>Maintain 16px spacing (gap-4) between buttons in a row</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Form Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Form Inputs</CardTitle>
            <CardDescription>
              Input fields, selects, and form controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Text Inputs</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="default-input">Default Input</label>
                    <Input id="default-input" placeholder="Enter information" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="disabled-input">Disabled Input</label>
                    <Input id="disabled-input" placeholder="Disabled" disabled />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="error-input">Error Input</label>
                    <Input id="error-input" placeholder="Error state" className="border-red-500" />
                    <p className="mt-1 text-xs text-red-500">This field is required</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Input With Icons</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="dollar-input">Amount Input</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <Input id="dollar-input" placeholder="0.00" className="pl-8" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="search-input">Search Input</label>
                    <div className="relative">
                      <Input id="search-input" placeholder="Search bills..." />
                      <button className="absolute right-2 top-2.5 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="calendar-input">Date Input</label>
                    <div className="relative">
                      <Input id="calendar-input" placeholder="Select date" />
                      <button className="absolute right-2 top-2.5 text-gray-500">
                        <Calendar className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-100 rounded-md">
              <h4 className="font-medium mb-2">Form Field Guidelines</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Always include a visible label above input fields</li>
                <li>Use placeholder text to provide examples, not to replace labels</li>
                <li>Position helper text below the input field</li>
                <li>For required fields, use an asterisk (*) after the label</li>
                <li>Maintain 16px spacing (gap-4) between form fields</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Cards and Containers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Cards and Containers</CardTitle>
            <CardDescription>
              Standard card layouts and content containers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Standard Card</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Card Title</CardTitle>
                      <CardDescription>Card description or subtitle</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>This is the standard card layout used for containing grouped content.</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dashboard Card</h3>
                  <Card className="bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                          <p className="text-sm text-muted-foreground">Total Unpaid</p>
                          <p className="text-2xl font-semibold">$597.29</p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full">
                          <CircleDollarSign className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Bill Card</h3>
                  <div className="flex items-center justify-between p-3 bg-background border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Receipt className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">Water Bill</span>
                        <span className="text-sm text-muted-foreground">Utilities</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold">$42.50</span>
                        <Badge variant="warning">Due Soon • Apr 25</Badge>
                      </div>
                      <Button variant="secondary" size="sm">Pay Now</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Quick Pay Card</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">Auto Insurance</span>
                        <span className="text-sm text-muted-foreground">Acct: ****4567</span>
                      </div>
                    </div>
                    <Button variant="outline">
                      <ArrowUp className="h-4 w-4 mr-2" />
                      Pay $112.40
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-100 rounded-md">
                <h4 className="font-medium mb-2">Card Guidelines</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Use a consistent padding (p-4 to p-6) for all cards</li>
                  <li>Include hover states for interactive cards</li>
                  <li>Use rounded corners (rounded-lg) consistently</li>
                  <li>Maintain 16-24px spacing between cards (gap-4 to gap-6)</li>
                  <li>Use subtle shadows for elevation (hover:shadow-md)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges and Status Indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Badges and Status Indicators</CardTitle>
            <CardDescription>
              Visual indicators for bill status and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Badge variant="default">Default</Badge>
                  <p className="text-xs text-muted-foreground">General information</p>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <Badge variant="secondary">New</Badge>
                  <p className="text-xs text-muted-foreground">New items</p>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <Badge variant="outline">Scheduled</Badge>
                  <p className="text-xs text-muted-foreground">Scheduled payments</p>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <Badge variant="destructive">Overdue</Badge>
                  <p className="text-xs text-muted-foreground">Overdue bills</p>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <Badge className="bg-amber-500">Due Soon</Badge>
                  <p className="text-xs text-muted-foreground">Due within 3 days</p>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <Badge className="bg-green-600">Completed</Badge>
                  <p className="text-xs text-muted-foreground">Completed actions</p>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <Badge className="bg-blue-600">Upcoming</Badge>
                  <p className="text-xs text-muted-foreground">Upcoming bills</p>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <Badge className="bg-purple-600">Autopay</Badge>
                  <p className="text-xs text-muted-foreground">Automatic payments</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-100 rounded-md">
                <h4 className="font-medium mb-2">Badge Guidelines</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Use consistent colors to indicate status across the application</li>
                  <li>Keep badges concise (1-2 words maximum)</li>
                  <li>Always ensure sufficient contrast against backgrounds</li>
                  <li>For numerical badges, use a circular shape with no text</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Behavior */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Responsive Behavior</CardTitle>
            <CardDescription>
              How components adapt across different screen sizes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Breakpoint Guidelines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border p-4 rounded-md">
                    <p className="font-medium">Mobile</p>
                    <p className="text-sm text-muted-foreground">Up to 639px</p>
                    <p className="text-sm mt-2">Single column layout</p>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <p className="font-medium">Tablet</p>
                    <p className="text-sm text-muted-foreground">640px to 1023px</p>
                    <p className="text-sm mt-2">Two column layout</p>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <p className="font-medium">Desktop</p>
                    <p className="text-sm text-muted-foreground">1024px to 1279px</p>
                    <p className="text-sm mt-2">Multi-column layout</p>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <p className="font-medium">Large Screen</p>
                    <p className="text-sm text-muted-foreground">1280px and above</p>
                    <p className="text-sm mt-2">Maximum width containers</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Responsive Adaptations</h3>
                <div className="space-y-4">
                  <div className="border p-4 rounded-md">
                    <p className="font-medium">Bill Cards</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                      <li>Mobile: Stack all elements vertically</li>
                      <li>Tablet: Show minimal information horizontally</li>
                      <li>Desktop: Show full information horizontally</li>
                    </ul>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <p className="font-medium">Dashboard Stats</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                      <li>Mobile: 2x2 grid</li>
                      <li>Tablet+: 4x1 row</li>
                    </ul>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <p className="font-medium">Navigation</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                      <li>Mobile: Bottom tab bar or hamburger menu</li>
                      <li>Tablet: Collapsible sidebar</li>
                      <li>Desktop: Full sidebar with secondary navigation</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-100 rounded-md">
                <h4 className="font-medium mb-2">Responsive Design Guidelines</h4>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Always design mobile-first, then expand to larger screens</li>
                  <li>Use Tailwind's responsive prefixes consistently (sm:, md:, lg:, xl:)</li>
                  <li>Maintain tap target sizes of at least 44x44px on mobile</li>
                  <li>Ensure text remains readable at all screen sizes (minimum 14px font)</li>
                  <li>Consider touch vs mouse interactions when designing responsive behaviors</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

export default BillPayStyleGuide;
