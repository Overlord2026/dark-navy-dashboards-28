
import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Billing: React.FC = () => {
  return (
    <ThreeColumnLayout activeMainItem="billing" title="Billing">
      <div className="mx-auto w-full max-w-6xl space-y-6 p-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your billing information, payment methods, and subscription plan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your active subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">Premium Family Office</span>
                  <span className="bg-green-500/20 text-green-600 text-xs py-1 px-2 rounded-full">
                    Active
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Billing cycle: Monthly</p>
                  <p>Next payment: June 15, 2025</p>
                  <p>Amount: $299.00</p>
                </div>
                <div className="pt-4">
                  <Button variant="outline">Change Plan</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-slate-800 p-2 rounded mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 05/2027</p>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button variant="outline">Update Card</Button>
                  <Button variant="outline">Add New Method</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your recent invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-3">Date</th>
                      <th className="text-left pb-3">Description</th>
                      <th className="text-left pb-3">Amount</th>
                      <th className="text-left pb-3">Status</th>
                      <th className="text-right pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">May 15, 2025</td>
                      <td>Premium Family Office - Monthly</td>
                      <td>$299.00</td>
                      <td>
                        <span className="bg-green-500/20 text-green-600 text-xs py-1 px-2 rounded-full">
                          Paid
                        </span>
                      </td>
                      <td className="text-right">
                        <Button variant="ghost" size="sm">View Invoice</Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Apr 15, 2025</td>
                      <td>Premium Family Office - Monthly</td>
                      <td>$299.00</td>
                      <td>
                        <span className="bg-green-500/20 text-green-600 text-xs py-1 px-2 rounded-full">
                          Paid
                        </span>
                      </td>
                      <td className="text-right">
                        <Button variant="ghost" size="sm">View Invoice</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3">Mar 15, 2025</td>
                      <td>Premium Family Office - Monthly</td>
                      <td>$299.00</td>
                      <td>
                        <span className="bg-green-500/20 text-green-600 text-xs py-1 px-2 rounded-full">
                          Paid
                        </span>
                      </td>
                      <td className="text-right">
                        <Button variant="ghost" size="sm">View Invoice</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Billing;
