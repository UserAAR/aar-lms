import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CustomCard } from '@/components/ui/CustomCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/services/api';

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnailUrl: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  category: string;
  level: string;
}

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/api/classroom/courses');
        const coursesData = Array.isArray(response.data) ? response.data : [];
        setCourses(coursesData);
        setFilteredCourses(coursesData);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setError('Kurslar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = [...courses];

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Seviye filtresi
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategory, selectedLevel, courses]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-destructive mb-4">Hata</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Sayfayı Yenile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Button asChild>
          <Link to="/classroom/courses/new">Create Course</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Backend Development">Backend Development</SelectItem>
            <SelectItem value="Frontend Development">Frontend Development</SelectItem>
            <SelectItem value="Data Science">Data Science</SelectItem>
            <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Select Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-muted animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link to={`/classroom/courses/${course.id}`} key={course.id}>
              <CustomCard className="h-full">
                <div className="aspect-video w-full relative mb-4">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="rounded-md object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                    <div
                      className="h-full bg-turquoise"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {course.instructor}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {course.completedLessons}/{course.totalLessons} lessons
                  </span>
                  <span className="text-xs font-medium">
                    {course.progress}% complete
                  </span>
                </div>
              </CustomCard>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Kurs bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
