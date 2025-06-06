import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';


// Define the search filters interface
export interface SearchFilters {
  jobTitle: string;
  location: string;
  jobType: string;
  minSalary: number;
  maxSalary: number;
}

// Define the context interface
interface SearchContextType {
  searchFilters: SearchFilters;
  updateSearchFilters: (newFilters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
}

// Create the context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Default filter values
const defaultFilters: SearchFilters = {
  jobTitle: '',
  location: '',
  jobType: '',
  minSalary: 50000,
  maxSalary: 80000,
};

// Provider component
export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(defaultFilters);

  const updateSearchFilters = (newFilters: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    setSearchFilters(defaultFilters);
  };

  const value: SearchContextType = {
    searchFilters,
    updateSearchFilters,
    resetFilters,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use the search context
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};