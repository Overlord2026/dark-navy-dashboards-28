import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, Download, Star, Clock } from "lucide-react";

export const GuideOfTheMonth = () => {
  const featuredGuide = {
    title: "The Family Office Guide to Annuities",
    subtitle: "A comprehensive analysis of annuity strategies for ultra-high-net-worth families",
    author: "BFO Research Team",
    duration: "45 min read",
    rating: 4.9,
    thumbnail: "/api/placeholder/300/200",
    description: "This month's featured guide covers advanced annuity strategies specifically designed for family offices, including tax optimization, estate planning integration, and institutional-grade products.",
    highlights: [
      "Tax-advantaged strategies",
      "Estate planning integration", 
      "Institutional product access",
      "Risk management frameworks"
    ],
    downloadCount: "2,847",
    type: "premium"
  };

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 font-semibold">
            ⭐ Guide of the Month
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-slate-700">{featuredGuide.rating}</span>
          </div>
        </div>
        
        <div>
          <CardTitle className="font-serif text-xl text-slate-800 leading-tight mb-2">
            {featuredGuide.title}
          </CardTitle>
          <p className="text-sm text-slate-600 leading-relaxed">
            {featuredGuide.subtitle}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Thumbnail */}
        <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700 aspect-video flex items-center justify-center">
          <div className="text-center text-white">
            <BookOpen className="h-12 w-12 mx-auto mb-2 text-amber-400" />
            <div className="text-sm font-medium">Premium Guide</div>
          </div>
          <div className="absolute top-3 right-3 bg-black/50 rounded-full p-2">
            <Play className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-700 leading-relaxed">
          {featuredGuide.description}
        </p>

        {/* Highlights */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-slate-800">Key Topics:</h4>
          <ul className="space-y-1">
            {featuredGuide.highlights.map((highlight, index) => (
              <li key={index} className="flex items-center gap-2 text-xs text-slate-600">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            {featuredGuide.duration}
          </div>
          <div className="flex items-center gap-2">
            <Download className="h-3 w-3" />
            {featuredGuide.downloadCount} downloads
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button className="w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white">
            <BookOpen className="h-4 w-4 mr-2" />
            Read Guide
          </Button>
          <Button variant="outline" className="w-full border-slate-300 text-slate-700">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Additional Content Teasers */}
        <div className="pt-4 border-t border-amber-200">
          <h4 className="font-semibold text-sm text-slate-800 mb-3">More This Month:</h4>
          <div className="space-y-2">
            {[
              { title: "Variable Annuity Deep Dive", type: "Video", duration: "18 min" },
              { title: "Tax Strategy Webinar", type: "Live Event", duration: "Dec 15" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded border border-amber-100 hover:bg-amber-50/50 cursor-pointer">
                <div>
                  <div className="text-xs font-medium text-slate-700">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.type}</div>
                </div>
                <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                  {item.duration}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};