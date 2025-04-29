import React, { useState, useEffect } from 'react';
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { cn } from '@/lib/utils';
import { useTheme } from '../../theme/theme';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-smooth">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-16 md:ml-64">
        <Header />
        <main className="flex-1 p-4 md:p-8 animate-fadeIn">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
