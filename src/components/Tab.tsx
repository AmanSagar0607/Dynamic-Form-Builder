import React from 'react';
import { TabProps } from '../types/form';

export const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium rounded-t-lg transition-colors duration-200 
        ${isActive 
          ? 'bg-white text-indigo-600 dark:bg-gray-800 dark:text-indigo-400 border-b-2 border-indigo-600' 
          : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}
    >
      {label}
    </button>
  );
};