import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { AlertCircle } from 'lucide-react';

const ErrorDisplay = ({ error }) => {
  const { theme } = useTheme();
  
  if (!error) return null;
  
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg ${
      theme === 'dark' 
        ? 'bg-red-900/30 border border-red-700/50 text-red-300' 
        : 'bg-red-50 border border-red-200 text-red-700'
    }`}>
      <AlertCircle size={16} />
      <span className="text-sm font-medium">{error}</span>
    </div>
  );
};

export default ErrorDisplay;