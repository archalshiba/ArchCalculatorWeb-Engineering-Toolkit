import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface InputCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const InputCard: React.FC<InputCardProps> = ({ 
  title, 
  icon, 
  children, 
  defaultExpanded = true 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-xl border border-white/20 dark:border-slate-700/50 shadow-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/20 dark:hover:bg-slate-700/20 transition-colors rounded-t-xl"
      >
        <div className="flex items-center">
          <div className="text-indigo-600 dark:text-indigo-400 mr-3">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-slate-500 dark:text-slate-400" />
        ) : (
          <ChevronDown size={20} className="text-slate-500 dark:text-slate-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4 pt-0 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};