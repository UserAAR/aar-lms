
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomCard } from '@/components/ui/CustomCard';
import { CustomButton } from '@/components/ui/CustomButton';
import api from '@/services/api';

export function Classroom() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/classroom/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Split courses by progress
  const inProgressCourses = courses.filter((course) => course.progress > 0 && course.progress < 100);
  const notStartedCourses = courses.filter((course) => course.progress === 0);
  const completedCourses = courses.filter((course) => course.progress === 100);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Classroom</h1>
        <p className="text-muted-foreground">
          Access your courses and track your learning progress.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-48 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* In Progress Courses */}
          <section>
            <h2 className="text-2xl font-bold mb-6">In Progress</h2>
            {inProgressCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses.map((course) => (
                  <Link to={`/classroom/courses/${course.id}`} key={course.id}>
                    <CustomCard className="h-full">
                      <div className="aspect-video w-full relative mb-4 overflow-hidden rounded-md">
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <CustomButton size="sm">Continue Learning</CustomButton>
                        </div>
                      </div>
                      <h3 className="font-semibold mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {course.instructor} • {course.level}
                      </p>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full">
                        <div
                          className="h-full bg-turquoise rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </CustomCard>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-muted/30 rounded-lg">
                <p className="mb-4 text-muted-foreground">You haven't started any courses yet.</p>
                <CustomButton asChild>
                  <Link to="/classroom/courses">Browse Courses</Link>
                </CustomButton>
              </div>
            )}
          </section>

          {/* Not Started Courses */}
          {notStartedCourses.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Not Started</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notStartedCourses.map((course) => (
                  <Link to={`/classroom/courses/${course.id}`} key={course.id}>
                    <CustomCard className="h-full">
                      <div className="aspect-video w-full mb-4 overflow-hidden rounded-md">
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {course.instructor} • {course.level}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span>{course.totalLessons} lessons</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                          Not Started
                        </span>
                      </div>
                    </CustomCard>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Completed Courses */}
          {completedCourses.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Completed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((course) => (
                  <Link to={`/classroom/courses/${course.id}`} key={course.id}>
                    <CustomCard className="h-full">
                      <div className="aspect-video w-full mb-4 overflow-hidden rounded-md">
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                            Completed
                          </span>
                        </div>
                      </div>
                      <h3 className="font-semibold mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {course.instructor} • {course.level}
                      </p>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span>{course.totalLessons}/{course.totalLessons} lessons</span>
                        <span className="font-medium">100%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </CustomCard>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
