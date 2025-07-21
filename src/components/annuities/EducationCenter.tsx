import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Video, MessageCircle, FileText, Play, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EducationCenter = () => {
  const navigate = useNavigate();

  const bookChapters = [
    {
      id: "basics",
      title: "Chapter 1: Annuity Basics",
      description: "Understanding what annuities are and how they work",
      duration: "15 min read",
      completed: false
    },
    {
      id: "types",
      title: "Chapter 2: Types of Annuities",
      description: "Fixed, variable, immediate, and deferred annuities explained",
      duration: "20 min read",
      completed: false
    },
    {
      id: "fees",
      title: "Chapter 3: Understanding Fees",
      description: "How to identify and evaluate annuity fees and charges",
      duration: "18 min read",
      completed: false
    },
    {
      id: "riders",
      title: "Chapter 4: Riders and Benefits",
      description: "Optional features and when they make sense",
      duration: "12 min read",
      completed: false
    },
    {
      id: "fiduciary",
      title: "Chapter 5: Fiduciary vs Commission",
      description: "Understanding how advisors are compensated",
      duration: "10 min read",
      completed: false
    }
  ];

  const videos = [
    {
      id: "intro",
      title: "Introduction to Annuities",
      description: "A beginner-friendly overview of annuities",
      duration: "12:30",
      thumbnail: "/placeholder.svg"
    },
    {
      id: "comparison",
      title: "Fixed vs Variable Annuities",
      description: "Key differences explained with examples",
      duration: "8:45",
      thumbnail: "/placeholder.svg"
    },
    {
      id: "fees",
      title: "Hidden Fees Exposed",
      description: "Real contract analysis showing fee structures",
      duration: "15:20",
      thumbnail: "/placeholder.svg"
    },
    {
      id: "reviews",
      title: "Real Contract Reviews",
      description: "Analyzing actual annuity contracts",
      duration: "20:15",
      thumbnail: "/placeholder.svg"
    }
  ];

  const faqCategories = [
    {
      category: "Basics",
      questions: [
        "What is an annuity?",
        "How do annuities work?",
        "Are annuities right for me?",
        "What's the difference between immediate and deferred?"
      ]
    },
    {
      category: "Fees & Costs",
      questions: [
        "What fees should I expect?",
        "How much do annuities typically cost?",
        "What are surrender charges?",
        "How do advisor commissions work?"
      ]
    },
    {
      category: "Tax Implications",
      questions: [
        "How are annuities taxed?",
        "What about tax-deferred growth?",
        "Are there penalties for early withdrawal?",
        "How does the tax treatment compare to other investments?"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Education Center</h1>
        <p className="text-muted-foreground">
          Learn everything you need to know about annuities before making any decisions
        </p>
      </div>

      <Tabs defaultValue="chapters" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chapters">Book Chapters</TabsTrigger>
          <TabsTrigger value="videos">Video Library</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="chat">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="chapters" className="space-y-4">
          <div className="grid gap-4">
            {bookChapters.map((chapter) => (
              <Card key={chapter.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Book className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{chapter.title}</CardTitle>
                        <CardDescription>{chapter.description}</CardDescription>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {chapter.duration}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={() => navigate(`/annuities/learn/${chapter.id}`)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Read Chapter
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="relative mb-3">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-32 object-cover rounded-lg bg-muted"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center">
                        <Play className="h-6 w-6 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={() => navigate(`/annuities/videos/${video.id}`)}>
                    <Video className="h-4 w-4 mr-2" />
                    Watch Video
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <div className="grid gap-6">
            {faqCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.questions.map((question, qIndex) => (
                      <Button 
                        key={qIndex}
                        variant="ghost" 
                        className="w-full justify-start text-left"
                        onClick={() => navigate(`/annuities/faq/${category.category.toLowerCase()}/${qIndex}`)}
                      >
                        <HelpCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        {question}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>AI Annuity Assistant</CardTitle>
                  <CardDescription>
                    Get instant answers to your annuity questions from our AI trained on consumer-first principles
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Popular Questions:</h4>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-left">
                      "Should I buy an annuity for retirement income?"
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      "How do I know if my annuity has high fees?"
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      "What's the difference between fixed and variable annuities?"
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left">
                      "Is my current annuity a good deal?"
                    </Button>
                  </div>
                </div>
                <Button onClick={() => navigate("/annuities/chat")} className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Start AI Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};