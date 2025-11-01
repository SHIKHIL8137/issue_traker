import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';

const Loader = ({ size = 'md' }) => {
  const { theme } = useTheme();
  
  const sizeConfig = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };
  
  const colors = theme === 'dark' 
    ? 'border-blue-400 border-t-purple-400' 
    : 'border-blue-500 border-t-purple-500';
  
  const currentSize = sizeConfig[size];
  
  return (
    <div className="flex justify-center items-center">
      <div className={`${currentSize} rounded-full border-4 ${colors} animate-spin relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-current animate-spin" 
             style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-current animate-spin" 
             style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
      </div>
    </div>
  );
};

export default Loader;