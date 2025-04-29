import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CustomCard } from '@/components/ui/CustomCard';
import { CustomButton } from '@/components/ui/CustomButton';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, Clock, Play, FileText, Award } from 'lucide-react';
import api from '@/services/api';

export function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/classroom/courses/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Failed to fetch course:', error);
        toast({
          title: 'Error',
          description: 'Failed to load course details. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, toast]);

  const formatDuration = (duration: string) => {
    const [minutes, seconds] = duration.split(':').map(Number);
    return `${minutes}m ${seconds}s`;
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'quiz':
        return <FileText className="h-4 w-4" />;
      case 'assignment':
        return <FileText className="h-4 w-4" />;
      case 'exercise':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-3/4 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="mt-8">
              <div className="h-10 bg-muted rounded w-full"></div>
              <div className="mt-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
        <p className="text-muted-foreground">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/classroom/courses" className="text-primary hover:underline mt-4 inline-block">
          Browse All Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge 
            className={
              course.level === 'Beginner' ? 'bg-green-500' :
              course.level === 'Intermediate' ? 'bg-yellow-500' :
              'bg-red-500'
            }
          >
            {course.level}
          </Badge>
          <Badge variant="outline">{course.category}</Badge>
          <span className="text-sm text-muted-foreground flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {course.totalLessons} lessons
          </span>
        </div>
      </div>

      {/* Course Banner */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-lg mb-8">
        <img
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {course.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-background/50">
            <div
              className="h-full bg-turquoise"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="curriculum">
            <TabsList className="mb-6">
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum" className="space-y-6">
              <div className="space-y-4">
                {course.modules.map((module: any) => (
                  <Accordion
                    type="single"
                    collapsible
                    key={module.id}
                    defaultValue={module.id.toString()}
                  >
                    <AccordionItem value={module.id.toString()} className="border rounded-md">
                      <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
                        <div className="flex justify-between items-center w-full pr-4">
                          <span className="font-medium">{module.title}</span>
                          <div className="flex items-center space-x-3">
                            <span className="text-xs text-muted-foreground">
                              {module.lessons.length} lessons
                            </span>
                            <span className="text-xs font-medium">
                              {module.progress}% complete
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="px-4 py-2 space-y-1">
                          {module.lessons.map((lesson: any) => (
                            <div
                              key={lesson.id}
                              className={`flex items-center p-2 rounded-md ${
                                lesson.completed ? 'bg-muted/50' : 'hover:bg-muted/30'
                              }`}
                            >
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                lesson.completed ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted'
                              }`}>
                                {lesson.completed ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  getLessonIcon(lesson.type)
                                )}
                              </div>
                              <div className="ml-3 flex-grow">
                                <Link to={`/classroom/lessons/${lesson.id}`} className="font-medium text-sm hover:underline">
                                  {lesson.title}
                                </Link>
                                <p className="text-xs text-muted-foreground">
                                  {formatDuration(lesson.duration)} • {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                                </p>
                              </div>
                              {!lesson.completed && (
                                <CustomButton size="sm" variant="ghost" asChild>
                                  <Link to={`/classroom/lessons/${lesson.id}`}>
                                    {
                                      lesson.type === 'video' ? 'Watch' :
                                      lesson.type === 'quiz' ? 'Take Quiz' :
                                      lesson.type === 'assignment' ?  'Submit' :
                                      'Start'
                                    }
                                  </Link>
                                </CustomButton>
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="overview">
              <div className="prose max-w-none">
                <h2 className="text-xl font-bold mb-4">About This Course</h2>
                <p className="text-muted-foreground mb-6">{course.description}</p>
                
                <h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Understanding core Spring Boot concepts and architecture</li>
                  <li>Building RESTful APIs and web services</li>
                  <li>Working with Spring Data JPA for database operations</li>
                  <li>Implementing authentication and authorization</li>
                  <li>Testing Spring Boot applications</li>
                  <li>Deploying Spring Boot applications to production</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6 mb-3">Prerequisites</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Basic Java programming knowledge</li>
                  <li>Familiarity with object-oriented programming concepts</li>
                  <li>Understanding of RESTful web services (helpful but not required)</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="resources">
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Course Resources</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomCard className="flex items-center p-4">
                    <div className="bg-primary/10 p-3 rounded-lg mr-4">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Course Slides</h3>
                      <p className="text-xs text-muted-foreground">PDF, 24 pages</p>
                    </div>
                    <CustomButton size="sm" variant="outline" className="ml-auto">
                      Download
                    </CustomButton>
                  </CustomCard>
                  
                  <CustomCard className="flex items-center p-4">
                    <div className="bg-primary/10 p-3 rounded-lg mr-4">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Source Code</h3>
                      <p className="text-xs text-muted-foreground">GitHub Repository</p>
                    </div>
                    <CustomButton size="sm" variant="outline" className="ml-auto">
                      Access
                    </CustomButton>
                  </CustomCard>
                  
                  <CustomCard className="flex items-center p-4">
                    <div className="bg-primary/10 p-3 rounded-lg mr-4">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Exercise Files</h3>
                      <p className="text-xs text-muted-foreground">ZIP, 15.2 MB</p>
                    </div>
                    <CustomButton size="sm" variant="outline" className="ml-auto">
                      Download
                    </CustomButton>
                  </CustomCard>
                  
                  <CustomCard className="flex items-center p-4">
                    <div className="bg-primary/10 p-3 rounded-lg mr-4">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Cheat Sheet</h3>
                      <p className="text-xs text-muted-foreground">PDF, 2 pages</p>
                    </div>
                    <CustomButton size="sm" variant="outline" className="ml-auto">
                      Download
                    </CustomButton>
                  </CustomCard>
                </div>
                
                <h3 className="text-lg font-semibold mt-6 mb-3">External Resources</h3>
                <div className="space-y-2">
                  <CustomCard className="flex items-center p-4">
                    <div className="bg-primary/10 p-3 rounded-lg mr-4">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Spring Documentation</h3>
                      <p className="text-xs text-muted-foreground">Official Spring Framework documentation</p>
                    </div>
                    <CustomButton size="sm" variant="outline" className="ml-auto">
                      Visit
                    </CustomButton>
                  </CustomCard>
                  
                  <CustomCard className="flex items-center p-4">
                    <div className="bg-primary/10 p-3 rounded-lg mr-4">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Spring Guides</h3>
                      <p className="text-xs text-muted-foreground">Step-by-step guides for common tasks</p>
                    </div>
                    <CustomButton size="sm" variant="outline" className="ml-auto">
                      Visit
                    </CustomButton>
                  </CustomCard>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="discussion">
              <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Course Discussion</h2>
                <p className="text-muted-foreground">
                  Join the conversation with fellow students and instructors.
                </p>
                
                {/* Discussion form and threads would go here */}
                <div className="border rounded-md p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    Discussions are not yet available for this course.
                  </p>
                  <CustomButton>Start a Discussion</CustomButton>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Progress Card */}
          <CustomCard>
            <div className="text-center mb-4">
              <div className="inline-flex mb-2">
                <div className="relative h-24 w-24">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      className="text-muted stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    ></circle>
                    {/* Progress circle */}
                    <circle
                      className="text-turquoise stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - course.progress / 100)}`}
                      transform="rotate(-90 50 50)"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{course.progress}%</span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                {course.completedLessons} of {course.totalLessons} lessons completed
              </p>
            </div>

            {course.progress > 0 && course.progress < 100 ? (
              <CustomButton variant="primary" className="w-full">
                Continue Learning
              </CustomButton>
            ) : course.progress === 0 ? (
              <CustomButton variant="primary" className="w-full">
                Start Course
              </CustomButton>
            ) : (
              <div className="flex items-center justify-center p-3 bg-green-500/10 rounded-md">
                <Award className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium text-green-500">Course Completed!</span>
              </div>
            )}
          </CustomCard>

          {/* Instructor Card */}
          <CustomCard>
            <h3 className="font-semibold mb-4">Instructor</h3>
            <div className="flex items-start">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={course.instructorAvatar} />
                <AvatarFallback>{course.instructor[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{course.instructor}</h4>
                <p className="text-xs text-muted-foreground mb-2">Senior Developer & Educator</p>
                <p className="text-sm text-muted-foreground">
                  Experienced Java developer specializing in Spring Framework with over 10 years of industry experience.
                </p>
              </div>
            </div>
          </CustomCard>

          {/* Course Info */}
          <CustomCard>
            <h3 className="font-semibold mb-4">Course Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lessons</span>
                <span>{course.totalLessons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span>14 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Level</span>
                <span>{course.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span>{course.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>October 2023</span>
              </div>
            </div>
          </CustomCard>
        </div>
      </div>
    </div>
  );
}
