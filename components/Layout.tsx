
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Search, Smartphone, Laptop, Tablet, Watch, LayoutDashboard, Menu, X, Headphones, BatteryCharging } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setIsDark(!isDark);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/all?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                  <Smartphone className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-primary-600 dark:text-primary-400">AadiTechist</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/category/Smartphone" className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400 font-medium text-sm">
                <Smartphone className="w-4 h-4" /> <span>Phones</span>
              </Link>
              <Link to="/category/Laptop" className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400 font-medium text-sm">
                <Laptop className="w-4 h-4" /> <span>Laptops</span>
              </Link>
              <Link to="/category/Tablet" className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400 font-medium text-sm">
                <Tablet className="w-4 h-4" /> <span>Tablets</span>
              </Link>
              <Link to="/category/Earphones/TWS" className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400 font-medium text-sm">
                <Headphones className="w-4 h-4" /> <span>Audio</span>
              </Link>
              <Link to="/category/Smartwatch" className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400 font-medium text-sm">
                <Watch className="w-4 h-4" /> <span>Watch</span>
              </Link>
              <Link to="/category/Chargers/Cables" className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400 font-medium text-sm">
                <BatteryCharging className="w-4 h-4" /> <span>Power</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="hidden sm:block relative">
                <input
                  type="text"
                  placeholder="Search gadgets..."
                  className="w-48 lg:w-64 pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </form>

              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <Link to="/admin" className="hidden md:block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Admin Panel">
                <LayoutDashboard className="w-5 h-5" />
              </Link>

              <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-4">
             <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search gadgets..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              </form>
              <div className="grid grid-cols-2 gap-2">
                <Link onClick={() => setIsMenuOpen(false)} to="/category/Smartphone" className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center">
                  <Smartphone className="mb-2" /> <span>Phones</span>
                </Link>
                <Link onClick={() => setIsMenuOpen(false)} to="/category/Laptop" className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center">
                  <Laptop className="mb-2" /> <span>Laptops</span>
                </Link>
                <Link onClick={() => setIsMenuOpen(false)} to="/category/Tablet" className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center">
                  <Tablet className="mb-2" /> <span>Tablets</span>
                </Link>
                <Link onClick={() => setIsMenuOpen(false)} to="/category/Earphones/TWS" className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center">
                  <Headphones className="mb-2" /> <span>Audio</span>
                </Link>
                <Link onClick={() => setIsMenuOpen(false)} to="/category/Smartwatch" className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center">
                  <Watch className="mb-2" /> <span>Watch</span>
                </Link>
                <Link onClick={() => setIsMenuOpen(false)} to="/category/Chargers/Cables" className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center">
                  <BatteryCharging className="mb-2" /> <span>Power</span>
                </Link>
              </div>
              <Link onClick={() => setIsMenuOpen(false)} to="/admin" className="flex items-center space-x-2 p-4 text-center justify-center border border-dashed rounded-xl">
                 <LayoutDashboard className="w-5 h-5" /> <span>Admin Panel</span>
              </Link>
          </div>
        )}
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-primary-600">AadiTechist</h3>
            <p className="text-slate-500 dark:text-slate-400">Your ultimate destination for tech comparisons, budget advice, and the latest gadget news.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-500">
              <li><Link to="/category/Smartphone">Latest Phones</Link></li>
              <li><Link to="/category/Laptop">Top Laptops</Link></li>
              <li><Link to="/news">Tech News</Link></li>
              <li><Link to="/admin">Contributor Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-slate-500">
              <li><Link to="/category/Smartphone?budget=Under 20k">Phones Under 20k</Link></li>
              <li><Link to="/category/Smartphone?budget=Under 50k">Phones Under 50k</Link></li>
              <li><Link to="/category/Laptop?budget=Above 50k">Premium Laptops</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="mb-4 text-slate-500">Get weekly updates on best deals.</p>
            <div className="flex">
              <input type="email" placeholder="Your email" className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-l-lg w-full border-none outline-none" />
              <button className="bg-primary-600 text-white px-4 py-2 rounded-r-lg">Join</button>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-8">
          <p>© {new Date().getFullYear()} AadiTechist. All rights reserved.</p>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
};

export default Layout;
