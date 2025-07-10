import { Palette } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export default function Layout({ children, showNav = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showNav && (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-domestika-red rounded-lg flex items-center justify-center">
                  <Palette className="text-white text-sm" size={16} />
                </div>
                <span className="text-xl font-bold text-gray-900">Domestika AI</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Courses</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Community</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Help</a>
                <button className="bg-domestika-red text-white px-4 py-2 rounded-lg hover:bg-domestika-red hover:opacity-90 transition-opacity">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      {children}
    </div>
  );
}
