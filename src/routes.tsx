import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Classroom } from './pages/classroom/Classroom';
import { CoursesPage } from './pages/classroom/CoursesPage';
import { CourseDetail } from './pages/classroom/CourseDetail';
import { Calendar } from './pages/Calendar';
import { Tasks } from './pages/Tasks';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/classroom" element={<Classroom />} />
      <Route path="/classroom/courses" element={<CoursesPage />} />
      <Route path="/classroom/courses/:id" element={<CourseDetail />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
} 