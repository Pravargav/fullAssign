
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