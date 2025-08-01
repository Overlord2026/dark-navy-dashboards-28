import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Home, MapPin, TrendingUp, DollarSign, Calendar, Users, Plus } from "lucide-react";

export const WealthPropertiesPage = () => {
  const properties = [
    {
      id: 1,
      name: "Primary Residence",
      address: "123 Oak Street, Beverly Hills, CA",
      type: "Residential",
      status: "Owned",
      purchasePrice: 2500000,
      currentValue: 3200000,
      purchaseDate: "2019-06-15",
      appreciation: 28,
      image: "/api/placeholder/400/300"
    },
    {
      id: 2,
      name: "Vacation Home",
      address: "456 Beach Drive, Malibu, CA",
      type: "Vacation",
      status: "Owned",
      purchasePrice: 1800000,
      currentValue: 2100000,
      purchaseDate: "2021-03-20",
      appreciation: 16.7,
      image: "/api/placeholder/400/300"
    },
    {
      id: 3,
      name: "Rental Property",
      address: "789 Main Street, Santa Monica, CA",
      type: "Investment",
      status: "Rental",
      purchasePrice: 950000,
      currentValue: 1150000,
      purchaseDate: "2020-08-10",
      appreciation: 21.1,
      monthlyRent: 4500,
      image: "/api/placeholder/400/300"
    }
  ];

  const totalValue = properties.reduce((sum, property) => sum + property.currentValue, 0);
  const totalPurchasePrice = properties.reduce((sum, property) => sum + property.purchasePrice, 0);
  const totalAppreciation = ((totalValue - totalPurchasePrice) / totalPurchasePrice) * 100;

  const marketData = [
    {
      location: "Beverly Hills",
      change: "+8.3%",
      trend: "up",
      medianPrice: "$3.2M"
    },
    {
      location: "Malibu",
      change: "+5.7%",
      trend: "up",
      medianPrice: "$2.8M"
    },
    {
      location: "Santa Monica",
      change: "+6.1%",
      trend: "up",
      medianPrice: "$1.4M"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Property Portfolio</h1>
        <p className="text-muted-foreground">
          Manage and track your real estate investments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              {properties.length} properties
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appreciation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{totalAppreciation.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              ${((totalValue - totalPurchasePrice) / 1000).toFixed(0)}K gain
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Rental Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,500</div>
            <p className="text-xs text-muted-foreground">
              From 1 rental property
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Excellent</div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Properties List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Property Portfolio</CardTitle>
              <CardDescription>Overview of your real estate holdings</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-48">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{property.name}</h3>
                          <Badge variant="outline">{property.type}</Badge>
                          <Badge className={property.status === 'Rental' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                            {property.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4" />
                          {property.address}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Purchased: {new Date(property.purchaseDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${(property.currentValue / 1000000).toFixed(2)}M</div>
                        <div className="text-sm text-green-600 font-medium">+{property.appreciation}%</div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Purchase Price</div>
                        <div className="font-medium">${(property.purchasePrice / 1000000).toFixed(2)}M</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Current Value</div>
                        <div className="font-medium">${(property.currentValue / 1000000).toFixed(2)}M</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Appreciation</div>
                        <div className="font-medium text-green-600">
                          ${((property.currentValue - property.purchasePrice) / 1000).toFixed(0)}K
                        </div>
                      </div>
                      {property.monthlyRent && (
                        <div>
                          <div className="text-sm text-muted-foreground">Monthly Rent</div>
                          <div className="font-medium">${property.monthlyRent.toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline">View Details</Button>
                      <Button variant="outline">Market Analysis</Button>
                      {property.status === 'Rental' && (
                        <Button variant="outline">
                          <Users className="h-4 w-4 mr-2" />
                          Tenant Info
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Data */}
      <Card>
        <CardHeader>
          <CardTitle>Local Market Trends</CardTitle>
          <CardDescription>Recent market performance in your property locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {marketData.map((market, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{market.location}</h3>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">{market.change}</div>
                <div className="text-sm text-muted-foreground">
                  Median: {market.medianPrice}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};