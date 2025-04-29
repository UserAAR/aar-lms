import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CustomCard } from '@/components/ui/CustomCard';
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

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  thumbnailUrl: string;
  tags: string[];
  estimatedHours: number;
  difficulty: string;
}

export function Dashboard() {
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/classroom/courses">View All Courses</Link>
        </Button>
      </div>

      {/* Recent Courses */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recent Courses</h2>
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
      </section>

      {/* Popular Projects */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Popular Projects</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-lg bg-muted animate-pulse"
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
      </section>
    </div>
  );
}
