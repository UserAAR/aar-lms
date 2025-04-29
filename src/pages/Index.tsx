import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CustomCard } from '@/components/ui/CustomCard';
import { CustomButton } from '@/components/ui/CustomButton';
import { useEffect, useState } from 'react';
import api from '@/services/api';

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnailUrl: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  thumbnailUrl: string;
  tags: string[];
  estimatedHours: number;
  difficulty: string;
}

const Index = () => {
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [popularProjects, setPopularProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [coursesRes, projectsRes] = await Promise.all([
          api.get('/api/classroom/courses'),
          api.get('/api/projects'),
        ]);

        // API yanıtlarını kontrol et ve güvenli bir şekilde işle
        const courses = Array.isArray(coursesRes.data) ? coursesRes.data : [];
        const projects = Array.isArray(projectsRes.data) ? projectsRes.data : [];

        // Get 3 recent courses
        setRecentCourses(courses.slice(0, 3));
        
        // Get 3 popular projects
        setPopularProjects(projects.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setError('Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        // Hata durumunda boş array'ler set et
        setRecentCourses([]);
        setPopularProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Welcome to AAR/LMS Academy
              </h1>
              <p className="text-lg mb-6 text-muted-foreground">
                Your journey to becoming a top-tier developer starts here.
                Access world-class courses, collaborate on real projects, and join
                a community of like-minded professionals.
              </p>
              <div className="flex flex-wrap gap-4">
                <CustomButton size="lg" variant="primary">
                  <Link to="/classroom/courses">Explore Courses</Link>
                </CustomButton>
                <CustomButton size="lg" variant="outline">
                  <Link to="/projects">Browse Projects</Link>
                </CustomButton>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="AAR/LMS Academy"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gold/20 backdrop-blur-sm p-4 rounded-lg border border-gold/50 w-40">
                <p className="font-semibold text-sm">
                  Join <span className="text-gold">10,000+</span> developers
                  learning with us
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Learning Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Continue Learning</h2>
            <Button variant="outline" asChild>
              <Link to="/classroom/courses">View All Courses</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-lg bg-muted animate-pulse"
                ></div>
              ))}
            </div>
          ) : recentCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentCourses.map((course) => (
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
              <p className="text-muted-foreground">Henüz kurs bulunmuyor.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Projects</h2>
            <Button variant="outline" asChild>
              <Link to="/projects">View All Projects</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-lg bg-background animate-pulse"
                ></div>
              ))}
            </div>
          ) : popularProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularProjects.map((project) => (
                <Link to={`/projects/${project.id}`} key={project.id}>
                  <CustomCard className="h-full">
                    <div className="aspect-video w-full mb-4">
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="rounded-md object-cover w-full h-full"
                      />
                    </div>
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.shortDescription}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-full bg-muted text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {project.estimatedHours} hours
                      </span>
                      <span className="text-xs font-medium uppercase">
                        {project.difficulty}
                      </span>
                    </div>
                  </CustomCard>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Henüz proje bulunmuyor.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-navy text-white rounded-lg p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-transparent"></div>
            <div className="relative z-10 max-w-lg">
              <h2 className="text-3xl font-bold mb-4">Ready to level up your skills?</h2>
              <p className="mb-6">
                Join our community of developers and take your career to the next level with hands-on projects, expert-led courses, and networking opportunities.
              </p>
              <CustomButton size="lg" variant="accent">
                Start Learning Now
              </CustomButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
