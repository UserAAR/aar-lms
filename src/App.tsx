import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Classroom } from "./pages/classroom/Classroom";
import { CoursesPage } from "./pages/classroom/CoursesPage";
import { CourseDetail } from "./pages/classroom/CourseDetail";
import { Calendar } from "./pages/Calendar";
import { Tasks } from "./pages/Tasks";
import { AARAI } from "./components/chat/AARAI";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <Layout>
                <Index />
              </Layout>
            } />
            <Route path="/dashboard" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/projects" element={
              <Layout>
                <Projects />
              </Layout>
            } />
            <Route path="/projects/:id" element={
              <Layout>
                <ProjectDetail />
              </Layout>
            } />
            <Route path="/classroom" element={
              <Layout>
                <Classroom />
              </Layout>
            } />
            <Route path="/classroom/courses" element={
              <Layout>
                <CoursesPage />
              </Layout>
            } />
            <Route path="/classroom/courses/:id" element={
              <Layout>
                <CourseDetail />
              </Layout>
            } />
            <Route path="/calendar" element={
              <Layout>
                <Calendar />
              </Layout>
            } />
            <Route path="/tasks" element={
              <Layout>
                <Tasks />
              </Layout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AARAI />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
