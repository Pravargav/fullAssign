import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import { useSearch } from './SearchContext';

interface Job {
  _id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  salaryFrom?: string;
  salaryTo?: string;
  jobDescription: string;
  requirements: string;
  responsibilities: string;
  applicationDeadline: string;
  createdAt: string;
}

interface Pagination {
  current: number;
  total: number;
  count: number;
  totalJobs: number;
}

interface ApiResponse {
  success: boolean;
  data: Job[];
  pagination?: Pagination;
}

export const JobGrid: React.FC = () => {
  const { searchFilters, resetFilters } = useSearch();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // API base URL - adjust this to match your backend URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';;

  // Build query parameters from search filters
  const buildQueryParams = (pageNum: number) => {
    const params = new URLSearchParams();
    
    params.append('page', pageNum.toString());
    params.append('limit', '8');
    
    if (searchFilters.jobTitle.trim()) {
      params.append('jobTitle', searchFilters.jobTitle.trim());
    }
    
    if (searchFilters.location) {
      params.append('location', searchFilters.location);
    }
    
    if (searchFilters.jobType) {
      params.append('jobType', searchFilters.jobType);
    }
    
    if (searchFilters.minSalary > 0) {
      params.append('minSalary', searchFilters.minSalary.toString());
    }
    
    if (searchFilters.maxSalary < 200000) {
      params.append('maxSalary', searchFilters.maxSalary.toString());
    }
    
    return params.toString();
  };

  const fetchJobs = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = buildQueryParams(pageNum);
      const response = await fetch(`${API_BASE_URL}/api/jobs?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setJobs(data.data);
        setPagination(data.pagination || null);
      } else {
        throw new Error('Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when search filters change
  useEffect(() => {
    setPage(1); // Reset to first page when filters change
    fetchJobs(1);
  }, [searchFilters]);

  // Fetch jobs when page changes
  useEffect(() => {
    if (page > 1) {
      fetchJobs(page);
    }
  }, [page]);

  const handleRefresh = () => {
    fetchJobs(page);
  };

  const handleClearFilters = () => {
    resetFilters();
  };

  const handleNextPage = () => {
    if (pagination && page < pagination.total) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Check if any filters are active
  const hasActiveFilters = 
    searchFilters.jobTitle.trim() !== '' ||
    searchFilters.location !== '' ||
    searchFilters.jobType !== '' ||
    searchFilters.minSalary !== 50000 ||
    searchFilters.maxSalary !== 80000;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">Error loading jobs: {error}</p>
          <button 
            onClick={handleRefresh}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6v10a2 2 0 002 2h4a2 2 0 002-2V6" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">No jobs found matching your criteria.</p>
          {hasActiveFilters && (
            <button 
              onClick={handleClearFilters}
              className="mb-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors mr-2"
            >
              Clear All Filters
            </button>
          )}
          <button 
            onClick={handleRefresh}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search Results Summary and Filter Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-600">
          {pagination && (
            <p>
              Showing {((pagination.current - 1) * 8) + 1} to {Math.min(pagination.current * 8, pagination.totalJobs)} of {pagination.totalJobs} jobs
              {hasActiveFilters && (
                <span className="ml-2 text-blue-600 font-medium">
                  (filtered)
                </span>
              )}
            </p>
          )}
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800 mb-2 font-medium">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {searchFilters.jobTitle && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                Title: {searchFilters.jobTitle}
              </span>
            )}
            {searchFilters.location && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                Location: {searchFilters.location}
              </span>
            )}
            {searchFilters.jobType && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                Type: {searchFilters.jobType}
              </span>
            )}
            {(searchFilters.minSalary !== 50000 || searchFilters.maxSalary !== 80000) && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                Salary: ₹{Math.round(searchFilters.minSalary/1000)}k - ₹{Math.round(searchFilters.maxSalary/1000)}k
              </span>
            )}
          </div>
        </div>
      )}

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-[51px] max-md:mt-10 justify-items-center">
        {jobs.map((job) => (
          <JobCard key={job._id} {...job} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <span className="text-gray-600">
            Page {pagination.current} of {pagination.total} 
            ({pagination.totalJobs} total jobs)
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={page === pagination.total}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleRefresh}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Jobs
        </button>
      </div>
    </div>
  );
};

export default JobGrid;