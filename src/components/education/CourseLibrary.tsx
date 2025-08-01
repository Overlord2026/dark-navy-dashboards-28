import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Upload, 
  Play, 
  Book, 
  ExternalLink, 
  Tag, 
  Clock, 
  Users,
  Star,
  Plus,
  Video,
  FileText,
  BookOpen
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  type: 'course' | 'guide' | 'book';
  category: 'Tax' | 'Retirement' | 'Estate' | 'Investment' | 'Insurance' | 'Planning';
  tags: string[];
  duration?: string;
  videoUrl?: string;
  videoProvider?: 'youtube' | 'vimeo' | 'designer';
  amazonLink?: string;
  author?: string;
  rating?: number;
  enrolledCount?: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lastUpdated: string;
}

const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'Advanced Tax Planning Strategies',
    description: 'Master complex tax optimization techniques for high-net-worth clients including estate planning integration.',
    coverImage: 'photo-1461749280684-dccba630e2f6',
    type: 'course',
    category: 'Tax',
    tags: ['Tax Optimization', 'High Net Worth', 'Estate Planning'],
    duration: '4 hours',
    videoUrl: 'https://youtube.com/watch?v=example1',
    videoProvider: 'youtube',
    rating: 4.8,
    enrolledCount: 1247,
    difficulty: 'Advanced',
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    title: 'Retirement Planning Essentials',
    description: 'Complete guide to retirement planning strategies, 401k optimization, and IRA conversions.',
    coverImage: 'photo-1487058792275-0ad4aaf24ca7',
    type: 'guide',
    category: 'Retirement',
    tags: ['401k', 'IRA', 'Retirement Income'],
    duration: '2 hours',
    videoUrl: 'https://vimeo.com/example2',
    videoProvider: 'vimeo',
    rating: 4.6,
    enrolledCount: 892,
    difficulty: 'Intermediate',
    lastUpdated: '2024-01-10'
  },
  {
    id: '3',
    title: 'The Total Money Makeover',
    description: 'Dave Ramsey\'s proven plan for financial fitness - eliminate debt and build wealth.',
    coverImage: 'photo-1581090464777-f3220bbe1b8b',
    type: 'book',
    category: 'Planning',
    tags: ['Debt Management', 'Budgeting', 'Wealth Building'],
    amazonLink: 'https://amazon.com/total-money-makeover',
    author: 'Dave Ramsey',
    rating: 4.7,
    difficulty: 'Beginner',
    lastUpdated: '2023-12-01'
  },
  {
    id: '4',
    title: 'Estate Planning Documentation',
    description: 'Comprehensive guide to wills, trusts, and estate planning documents for financial advisors.',
    coverImage: 'photo-1519389950473-47ba0277781c',
    type: 'guide',
    category: 'Estate',
    tags: ['Wills', 'Trusts', 'Estate Documents'],
    duration: '3 hours',
    rating: 4.9,
    enrolledCount: 567,
    difficulty: 'Advanced',
    lastUpdated: '2024-01-20'
  }
];

const categories = ['All', 'Tax', 'Retirement', 'Estate', 'Investment', 'Insurance', 'Planning'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

function CourseCard({ course, onClick }: { course: Course; onClick: () => void }) {
  const getTypeIcon = () => {
    switch (course.type) {
      case 'course': return <Video className="w-5 h-5" />;
      case 'guide': return <FileText className="w-5 h-5" />;
      case 'book': return <BookOpen className="w-5 h-5" />;
    }
  };

  const getCoverImage = () => {
    return `https://images.unsplash.com/${course.coverImage}?auto=format&fit=crop&w=600&h=400`;
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fade-in"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={getCoverImage()}
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            {getTypeIcon()}
            {course.type}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className={`${
            course.difficulty === 'Beginner' ? 'bg-green-500' :
            course.difficulty === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
          }`}>
            {course.difficulty}
          </Badge>
        </div>
        {course.type !== 'book' && (
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              {course.duration}
            </div>
          </div>
        )}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center gap-1 text-white text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {course.rating}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className="mb-2">
            {course.category}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{course.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {course.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {course.enrolledCount && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {course.enrolledCount.toLocaleString()} enrolled
            </div>
          )}
          {course.author && (
            <div>By {course.author}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CourseDetailModal({ course, isOpen, onClose }: { 
  course: Course | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!course) return null;

  const getCoverImage = () => {
    return `https://images.unsplash.com/${course.coverImage}?auto=format&fit=crop&w=800&h=500`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{course.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <img
              src={getCoverImage()}
              alt={course.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge>{course.category}</Badge>
              <Badge variant="outline">{course.difficulty}</Badge>
              <Badge variant="secondary">{course.type}</Badge>
            </div>
            
            {course.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{course.rating}</span>
                </div>
                {course.enrolledCount && (
                  <span className="text-muted-foreground">
                    ({course.enrolledCount.toLocaleString()} enrolled)
                  </span>
                )}
              </div>
            )}
            
            {course.duration && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{course.duration}</span>
              </div>
            )}
            
            {course.author && (
              <div>
                <span className="font-medium">Author: </span>
                {course.author}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Description</h4>
          <p className="text-muted-foreground leading-relaxed">{course.description}</p>
        </div>
        
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {course.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          {course.type === 'book' && course.amazonLink ? (
            <Button asChild className="flex items-center gap-2">
              <a href={course.amazonLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                View on Amazon
              </a>
            </Button>
          ) : (
            <Button className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Start {course.type}
            </Button>
          )}
          
          {course.videoUrl && (
            <Button variant="outline" asChild className="flex items-center gap-2">
              <a href={course.videoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Watch on {course.videoProvider}
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UploadCourseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'course',
    videoUrl: '',
    videoProvider: 'youtube',
    tags: '',
    difficulty: 'Beginner'
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Course/Guide</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input 
                placeholder="Course title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea 
                className="w-full p-2 border rounded-md min-h-[100px]"
                placeholder="Course description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-4">
            <div>
              <label className="text-sm font-medium">Cover Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Video URL (Optional)</label>
              <Input 
                placeholder="https://youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Video Provider</label>
              <Select value={formData.videoProvider} onValueChange={(value) => setFormData({...formData, videoProvider: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input 
                placeholder="tax planning, retirement, estate"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Difficulty Level</label>
              <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            console.log('Saving course:', formData);
            onClose();
          }}>
            Save Course
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CourseLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredCourses = useMemo(() => {
    return sampleCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Course & Guide Library</h1>
        <p className="text-muted-foreground">
          Access professional development courses, guides, and recommended books
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses, guides, and books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Content
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredCourses.length} of {sampleCourses.length} items
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Video className="w-3 h-3" />
            {sampleCourses.filter(c => c.type === 'course').length} Courses
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {sampleCourses.filter(c => c.type === 'guide').length} Guides
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {sampleCourses.filter(c => c.type === 'book').length} Books
          </Badge>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            onClick={() => setSelectedCourse(course)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No content found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button onClick={() => {
            setSearchTerm('');
            setSelectedCategory('All');
            setSelectedDifficulty('All');
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />

      {/* Upload Modal */}
      <UploadCourseModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </div>
  );
}