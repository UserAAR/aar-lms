import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomCard } from '@/components/ui/CustomCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarDays, Clock, User } from 'lucide-react';
import api from '@/services/api';

const applicationSchema = z.object({
  fullName: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  experienceLevel: z.string({ required_error: 'Please select your experience level' }),
  skills: z.array(z.string()).min(1, { message: 'Select at least one skill' }),
  motivation: z.string().min(50, { message: 'Please write at least 50 characters' }),
  availability: z.number().min(5, { message: 'Minimum 5 hours required' }).max(40, { message: 'Maximum 40 hours allowed' }),
  termsAgreed: z.boolean().refine((val) => val === true, { message: 'You must agree to the terms' }),
});

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      experienceLevel: '',
      skills: [],
      motivation: '',
      availability: 10,
      termsAgreed: false,
    },
  });

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project details. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id, toast]);

  const calculateDaysRemaining = (deadline: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const onSubmit = async (values: z.infer<typeof applicationSchema>) => {
    setIsSubmitting(true);
    try {
      // This would typically include the project ID and other form values
      await api.post('/api/applications', {
        projectId: Number(id),
        ...values,
      });
      
      setIsApplicationDialogOpen(false);
      form.reset();
      
      toast({
        title: 'Application Submitted',
        description: 'Your application has been successfully submitted.',
      });
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-3/4 bg-muted rounded"></div>
        <div className="h-96 bg-muted rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-6 bg-muted rounded w-1/4 mt-6"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-muted rounded"></div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <p className="text-muted-foreground">
          The project you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className="capitalize">
            {project.category}
          </Badge>
          <Badge 
            className={`${
              project.difficulty === 'beginner' ? 'bg-green-500' :
              project.difficulty === 'intermediate' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
          >
            {project.difficulty}
          </Badge>
          <span className="text-sm text-muted-foreground flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {project.estimatedHours} hours estimated
          </span>
          <span className="text-sm text-muted-foreground flex items-center">
            <CalendarDays className="h-3.5 w-3.5 mr-1" />
            <span className={calculateDaysRemaining(project.deadline) < 3 ? "text-destructive font-medium" : ""}>
              {calculateDaysRemaining(project.deadline)} days remaining
            </span>
          </span>
        </div>
      </div>

      {/* Project Image */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg mb-8">
        <img
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Project Description */}
          <section>
            <h2 className="text-xl font-bold mb-3">Project Description</h2>
            <p className="text-muted-foreground mb-4">{project.longDescription}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </section>

          {/* Requirements */}
          <section>
            <h2 className="text-xl font-bold mb-3">Requirements</h2>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {project.requirements.map((req: string, index: number) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </section>

          {/* Milestones */}
          <section>
            <h2 className="text-xl font-bold mb-3">Project Milestones</h2>
            <div className="space-y-3">
              {project.milestones.map((milestone: any) => (
                <div
                  key={milestone.id}
                  className={`p-3 border rounded-md ${
                    milestone.completed ? 'bg-muted/50' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full mr-3 ${
                        milestone.completed ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                        {milestone.title}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Button */}
          <CustomCard>
            <h3 className="font-semibold mb-4">Interested in this project?</h3>
            <CustomButton 
              variant="primary" 
              className="w-full"
              onClick={() => setIsApplicationDialogOpen(true)}
            >
              Apply Now
            </CustomButton>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Deadline: {new Date(project.deadline).toLocaleDateString()}
            </p>
            <div className="mt-4 text-sm text-muted-foreground flex justify-center">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {project.applications} applications so far
              </span>
            </div>
          </CustomCard>

          {/* Team */}
          <CustomCard>
            <h3 className="font-semibold mb-4">Project Team</h3>
            <div className="space-y-4">
              {project.collaborators.map((collaborator: any) => (
                <div key={collaborator.id} className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={collaborator.avatar} />
                    <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{collaborator.name}</div>
                    <div className="text-xs text-muted-foreground">{collaborator.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </CustomCard>
        </div>
      </div>

      {/* Application Dialog */}
      <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Apply to Project</DialogTitle>
            <DialogDescription>
              Complete the form below to apply for "{project.title}".
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={() => (
                  <FormItem>
                    <FormLabel>Relevant Skills</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {project.tags.map((skill: string, index: number) => (
                        <FormField
                          key={index}
                          control={form.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(skill)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, skill]);
                                    } else {
                                      field.onChange(
                                        field.value?.filter(
                                          (value) => value !== skill
                                        )
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {skill}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivation</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Why do you want to join this project?"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Explain why you're interested and what you can bring to the project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Availability (hours)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="5" 
                        max="40" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="termsAgreed"
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel>
                        I agree to the terms and conditions of this project
                      </FormLabel>
                      <FormDescription>
                        By checking this, you agree to commit to the project deadline and follow collaboration guidelines.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <CustomButton
                  type="button"
                  variant="outline"
                  onClick={() => setIsApplicationDialogOpen(false)}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </CustomButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
