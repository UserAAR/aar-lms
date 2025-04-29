
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomCard } from '@/components/ui/CustomCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomButton } from '@/components/ui/CustomButton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';
import { CalendarDays, Clock, Search, Users } from 'lucide-react';

interface ProjectType {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  estimatedHours: number;
  thumbnailUrl: string;
  shortDescription: string;
  tags: string[];
  collaborators: number;
  applications: number;
  deadline: string;
}

export function Projects() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { toast } = useToast();

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        let url = '/api/projects';
        if (activeCategory !== 'all') {
          url += `?category=${activeCategory}`;
        }
        
        const response = await api.get(url);
        setProjects(response.data);
        setFilteredProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load projects. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [activeCategory, toast]);

  // Filter projects based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProjects(projects);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        project.tags.some((tag) => tag.toLowerCase().includes(query))
    );

    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const handleTabChange = (value: string) => {
    setActiveCategory(value);
  };

  // Calculate days until deadline
  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Project Opportunities</h1>
        <p className="text-muted-foreground">
          Find and apply to exciting developer projects to build your portfolio and skills.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-full md:w-auto">
          <Tabs 
            value={activeCategory} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="frontend">Frontend</TabsTrigger>
              <TabsTrigger value="backend">Backend</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
              <TabsTrigger value="data-science">Data Science</TabsTrigger>
              <TabsTrigger value="cloud">Cloud</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-lg overflow-hidden">
                <div className="h-48 bg-muted"></div>
              </div>
              <div className="mt-3 h-5 bg-muted rounded w-3/4"></div>
              <div className="mt-2 h-4 bg-muted rounded w-full"></div>
              <div className="mt-2 h-4 bg-muted rounded w-5/6"></div>
              <div className="mt-4 flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-6 bg-muted rounded-full w-16"></div>
                ))}
              </div>
            </div>
          ))
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Link to={`/projects/${project.id}`} key={project.id}>
              <CustomCard className="h-full flex flex-col">
                <div className="aspect-video w-full relative overflow-hidden rounded-md mb-4">
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      project.difficulty === 'beginner' ? 'bg-green-500' :
                      project.difficulty === 'intermediate' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                  >
                    {project.difficulty}
                  </Badge>
                </div>
                
                <h2 className="text-lg font-semibold mb-2">{project.title}</h2>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">
                  {project.shortDescription}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-auto">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {project.estimatedHours} hours
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-3 w-3" />
                    {project.collaborators} contributors
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="mr-1 h-3 w-3" />
                    <span className={
                      calculateDaysRemaining(project.deadline) < 3 ? "text-destructive" : ""
                    }>
                      {calculateDaysRemaining(project.deadline)} days left
                    </span>
                  </div>
                </div>
              </CustomCard>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">
              No projects found matching your search criteria.
            </p>
            <CustomButton onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}>
              Clear Filters
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  );
}
