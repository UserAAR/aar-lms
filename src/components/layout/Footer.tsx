import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <div className="rounded-full bg-navy p-1">
                <span className="block h-6 w-6 font-bold text-white text-center">NN</span>
              </div>
              <span className="ml-2 text-lg font-bold">AAR/LMS</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Empowering the next generation of developers with cutting-edge education and project-based learning.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/classroom/courses" className="hover:text-primary transition-colors">Courses</Link></li>
              <li><Link to="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
              <li><Link to="/community" className="hover:text-primary transition-colors">Community</Link></li>
              <li><Link to="/calendar" className="hover:text-primary transition-colors">Events</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/feedback" className="hover:text-primary transition-colors">Feedback</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} AAR/LMS Academy. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            {/* Social media icons would go here */}
            <span className="text-xs text-muted-foreground">Version 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
