import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, User, LogOut, Settings, Shield, Home, Menu, X } from 'lucide-react';

export default function NavBar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const bgClass = theme === 'dark' 
    ? 'bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl' 
    : 'bg-white/80 backdrop-blur-xl';

  const textClass = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const borderClass = theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200';
  const hoverClass = theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100';

  const navLinkClass = ({ isActive }) => 
    `px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
      isActive 
        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/30' 
        : `${textClass} ${hoverClass}`
    }`;

  const mobileNavLinkClass = ({ isActive }) => 
    `px-4 py-3 rounded-xl transition-all flex items-center gap-2 w-full ${
      isActive 
        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/30' 
        : `${textClass} ${hoverClass}`
    }`;

  return (
    <motion.nav 
      className={`sticky top-0 z-50 backdrop-blur border-b ${borderClass} shadow-lg`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/" 
            className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
              theme === 'dark' 
                ? 'from-blue-400 via-purple-400 to-pink-400' 
                : 'from-blue-600 via-purple-600 to-pink-600'
            }`}
          >
            IssueTracker Pro
          </Link>
        </motion.div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              <NavLink to="/" className={navLinkClass}>
                <Home className="w-4 h-4" />
                Dashboard
              </NavLink>
              
              <NavLink to="/issues" className={navLinkClass}>
                Issues
              </NavLink>
              
              {user.role === 'Admin' && (
                <NavLink to="/admin" className={navLinkClass}>
                  <Shield className="w-4 h-4" />
                  Admin
                </NavLink>
              )}
              
              {user.role === 'Developer' && (
                <NavLink to="/developer" className={navLinkClass}>
                  <Settings className="w-4 h-4" />
                  Developer
                </NavLink>
              )}
              
              {user.role === 'User' && (
                <NavLink to="/user" className={navLinkClass}>
                  <User className="w-4 h-4" />
                  My Area
                </NavLink>
              )}
              
              <div className="relative group">
                <button 
                  className={`p-2 rounded-xl ${bgClass} ${textClass} border ${borderClass} shadow-lg flex items-center justify-center ml-2`}
                >
                  <User className="w-5 h-5" />
                </button>
                
                <div className={`absolute right-0 mt-2 w-64 rounded-2xl ${bgClass} border ${borderClass} shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50`}>
                  <div className="p-4 border-b border-slate-700/30">
                    <p className={`font-semibold ${textClass}`}>{user.name}</p>
                    <p className={`text-sm ${textSecondary}`}>{user.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="p-2">
                    <button 
                      onClick={logout} 
                      className="w-full px-4 py-2 rounded-lg flex items-center gap-2 text-left hover:bg-red-500/50 text-red-500 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/signup" className={navLinkClass}>
                Sign Up
              </NavLink>
            </>
          )}
          
          <motion.button 
            onClick={toggleTheme} 
            className={`p-3 rounded-xl ${bgClass} ${textClass} border ${borderClass} shadow-lg flex items-center justify-center ml-2`}
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </motion.button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <motion.button 
            onClick={toggleTheme} 
            className={`p-2 rounded-xl ${bgClass} ${textClass} border ${borderClass} shadow-lg flex items-center justify-center`}
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </motion.button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl ${bgClass} ${textClass} border ${borderClass} shadow-lg flex items-center justify-center ml-2`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden border-t border-slate-700/30"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-2 flex flex-col gap-1">
              {user ? (
                <>
                  <NavLink 
                    to="/" 
                    className={mobileNavLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home className="w-4 h-4" />
                    Dashboard
                  </NavLink>
                  
                  <NavLink 
                    to="/issues" 
                    className={mobileNavLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Issues
                  </NavLink>
                  
                  {user.role === 'Admin' && (
                    <NavLink 
                      to="/admin" 
                      className={mobileNavLinkClass}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      Admin
                    </NavLink>
                  )}
                  
                  {user.role === 'Developer' && (
                    <NavLink 
                      to="/developer" 
                      className={mobileNavLinkClass}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Developer
                    </NavLink>
                  )}
                  
                  {user.role === 'User' && (
                    <NavLink 
                      to="/user" 
                      className={mobileNavLinkClass}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      My Area
                    </NavLink>
                  )}
                  
                  <div className="border-t border-slate-700/30 my-2"></div>
                  
                  <div className="px-4 py-3">
                    <p className={`font-semibold ${textClass}`}>{user.name}</p>
                    <p className={`text-sm ${textSecondary}`}>{user.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {user.role}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }} 
                    className="px-4 py-3 rounded-xl flex items-center gap-2 text-left hover:bg-red-500/50 text-red-500 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink 
                    to="/login" 
                    className={mobileNavLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink 
                    to="/signup" 
                    className={mobileNavLinkClass}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}