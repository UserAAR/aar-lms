import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './ThemeToggle';
import { Bell, ChevronDown, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dummy user data (in a real app, this would come from authentication)
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    role: 'Student',
  };

  const modules = [
    {
      name: 'Learning',
      items: [
        { name: 'Courses', path: '/classroom/courses' },
        { name: 'Learning Paths', path: '/learning/paths' },
        { name: 'Certificates', path: '/classroom/certificates' },
      ],
    },
    {
      name: 'Projects',
      items: [
        { name: 'Browse Projects', path: '/projects' },
        { name: 'My Applications', path: '/projects/applications' },
      ],
    },
    {
      name: 'Resources',
      items: [
        { name: 'Documentation', path: '/resources/docs' },
        { name: 'API Reference', path: '/resources/api' },
        { name: 'Community Forum', path: '/community' },
      ],
    },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        isScrolled ? 'glass-effect shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Logo - visible on mobile */}
            <Link to="/" className="flex items-center md:hidden">
              <div className="rounded-full bg-navy p-1">
                <span className="block h-6 w-6 font-bold text-white">NN</span>
              </div>
              <span className="ml-2 text-lg font-bold text-foreground">AAR/LMS</span>
            </Link>

            {/* Modules dropdown - hidden on mobile */}
            <div className="hidden md:flex md:items-center md:space-x-4 ml-16">
              {modules.map((module, index) => (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="px-3">
                      {module.name}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {module.items.map((item, itemIndex) => (
                      <DropdownMenuItem key={itemIndex}>
                        <Link to={item.path} className="flex w-full">
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
                <DropdownMenuItem>Notifications</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-2 space-y-1">
            {modules.map((module) => (
              <div key={module.name} className="space-y-1">
                <div className="px-3 py-2 text-sm font-medium">{module.name}</div>
                {module.items.map((item, index) => (
                  <Link 
                    key={index}
                    to={item.path}
                    className="block px-3 py-2 rounded-md text-sm hover:bg-muted"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
