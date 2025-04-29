import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  // Using appropriate Lucide icons based on requirements
  BookOpen,
  Calendar,
  CheckSquare,
  Code,
  FileText,
  Home,
  LayoutDashboard,
  MessagesSquare,
  Settings,
  Users,
  GraduationCap,
  CalendarDays,
  Award,
  FolderOpen,
  ClipboardList,
  FolderGit2,
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  title: string;
  path: string;
  isCollapsed: boolean;
  isActive: boolean;
  subItems?: Array<{ title: string; path: string; icon?: React.ElementType }>;
}

const SidebarItem = ({
  icon: Icon,
  title,
  path,
  isCollapsed,
  isActive,
  subItems,
}: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasSubItems = subItems && subItems.length > 0;

  return (
    <div className="mb-1">
      <Link
        to={path}
        className={cn(
          'flex items-center px-3 py-2 rounded-md transition-colors',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
          isCollapsed && 'justify-center'
        )}
        onClick={(e) => {
          if (hasSubItems) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <Icon className="h-5 w-5 min-w-[20px]" />
        {!isCollapsed && (
          <>
            <span className="ml-3 flex-grow">{title}</span>
            {hasSubItems && (
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen && 'rotate-90'
                )}
              />
            )}
          </>
        )}
      </Link>
      {hasSubItems && isOpen && !isCollapsed && (
        <div className="ml-7 mt-1 space-y-1">
          {subItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center px-3 py-1.5 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
            >
              {item.icon && <item.icon className="h-4 w-4 mr-2" />}
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = window.location.pathname;

  const sidebarItems = [
    {
      icon: Home,
      title: 'Home',
      path: '/',
      subItems: [],
    },
    {
      icon: LayoutDashboard,
      title: 'Dashboard',
      path: '/dashboard',
      subItems: [],
    },
    {
      icon: BookOpen,
      title: 'Classroom',
      path: '/classroom',
      subItems: [
        { title: 'My Courses', path: '/classroom/courses', icon: GraduationCap },
        { title: 'Course Calendar', path: '/classroom/calendar', icon: CalendarDays },
        { title: 'Certificates', path: '/classroom/certificates', icon: Award },
      ],
    },
    {
      icon: Code,
      title: 'Projects',
      path: '/projects',
      subItems: [
        { title: 'Browse Projects', path: '/projects', icon: FolderOpen },
        { title: 'My Applications', path: '/projects/applications', icon: ClipboardList },
        { title: 'My Projects', path: '/projects/my-projects', icon: FolderGit2 },
      ],
    },
    {
      icon: CheckSquare,
      title: 'Tasks',
      path: '/tasks',
      subItems: [],
    },
    {
      icon: Calendar,
      title: 'Calendar',
      path: '/calendar',
      subItems: [],
    },
    {
      icon: FileText,
      title: 'Forms',
      path: '/forms',
      subItems: [],
    },
    {
      icon: Users,
      title: 'Community',
      path: '/community',
      subItems: [],
    },
    {
      icon: MessagesSquare,
      title: 'Messages',
      path: '/messages',
      subItems: [],
    },
    {
      icon: Settings,
      title: 'Settings',
      path: '/settings',
      subItems: [],
    },
  ];

  return (
    <div
      className={cn(
        'h-screen bg-sidebar fixed left-0 top-0 z-30 flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between px-3 py-4">
        <Link 
          to="/" 
          className={cn(
            "flex items-center",
            collapsed && "justify-center w-full"
          )}
          onClick={(e) => {
            if (collapsed) {
              e.preventDefault();
              setCollapsed(false);
            }
          }}
        >
          <div className={cn(
            "rounded-full bg-sidebar-primary p-0.5 flex items-center justify-center",
            collapsed ? "w-5 h-5" : "w-8 h-8"
          )}>
            <img
              src="https://img.freepik.com/premium-vector/lms-logo-lms-letter-lms-letter-logo-design-initials-lms-logo-linked-with-circle-uppercase-monogram-logo-lms-typography-technology-business-real-estate-brand_229120-66009.jpg"
              alt="AAR/LMS Logo"
              className={cn(
                "object-cover rounded-full",
                collapsed ? "w-4 h-4" : "w-7 h-7"
              )}
            />
          </div>
          {!collapsed && (
            <span className="ml-3 text-lg font-bold text-sidebar-foreground">
              AAR/LMS
            </span>
          )}
        </Link>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-sidebar-accent/50"
            onClick={() => setCollapsed(true)}
          >
            <ChevronRight className="h-4 w-4 text-sidebar-foreground rotate-180" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto px-3 py-4">
        <nav className="space-y-1">
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              title={item.title}
              path={item.path}
              isCollapsed={collapsed}
              isActive={
                pathname === item.path ||
                (item.subItems?.some((subItem) => pathname === subItem.path) ?? false)
              }
              subItems={item.subItems}
            />
          ))}
        </nav>
      </div>

      {collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="icon"
            className="mx-auto hover:bg-sidebar-accent/50"
            onClick={() => setCollapsed(false)}
          >
            <ChevronRight className="h-4 w-4 text-sidebar-foreground" />
          </Button>
        </div>
      )}
    </div>
  );
}
