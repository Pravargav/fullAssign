import React from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { useSearch } from './SearchContext';

export const SearchBar: React.FC = () => {
  const { searchFilters, updateSearchFilters } = useSearch();

  // Salary range limits
  const minPossible = 0;
  const maxPossible = 200000;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), searchFilters.maxSalary - 5000);
    updateSearchFilters({ minSalary: value });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), searchFilters.minSalary + 5000);
    updateSearchFilters({ maxSalary: value });
  };

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchFilters({ jobTitle: e.target.value });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchFilters({ location: e.target.value });
  };

  const handleJobTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchFilters({ jobType: e.target.value });
  };

  // Calculate the fill position and width for the range track
  const minPos = ((searchFilters.minSalary - minPossible) / (maxPossible - minPossible)) * 100;
  const maxPos = ((searchFilters.maxSalary - minPossible) / (maxPossible - minPossible)) * 100;

  return (
    <div className="flex w-full items-stretch justify-between flex-wrap mt-[27px] max-md:max-w-full max-md:gap-4">
      <div className="flex items-stretch gap-[26px] text-center my-auto text-base text-[rgba(104,104,104,1)] font-medium">
        <Search className="w-5 h-5 text-[rgba(104,104,104,1)]" />
        <input
          type="text"
          placeholder="Search By Job Title, Role"
          value={searchFilters.jobTitle}
          onChange={handleJobTitleChange}
          className="basis-auto bg-transparent outline-none min-w-[200px]"
        />
      </div>
      <div className="flex items-center gap-[30px] text-base text-[rgba(104,104,104,1)] font-medium">
        <div className="w-0.5 bg-gray-200 h-6 self-center" />
        <MapPin className="w-5 h-5 text-[rgba(104,104,104,1)]" />
        <select
          value={searchFilters.location}
          onChange={handleLocationChange}
          className="my-auto bg-transparent outline-none min-w-[160px] text-[rgba(104,104,104,1)] font-medium"
        >
          <option value="">Preferred Location</option>
          <option value="mumbai">Mumbai</option>
          <option value="delhi">Delhi</option>
          <option value="bangalore">Bangalore</option>
          <option value="pune">Pune</option>
          <option value="hyderabad">Hyderabad</option>
        </select>
      </div>
      <div className="flex items-center gap-[30px] text-base text-[rgba(104,104,104,1)] font-medium">
        <div className="w-0.5 bg-gray-200 h-6 self-center" />
        <Briefcase className="w-5 h-5 text-[rgba(104,104,104,1)]" />
        <select
          value={searchFilters.jobType}
          onChange={handleJobTypeChange}
          className="self-stretch my-auto bg-transparent outline-none min-w-[100px]"
        >
          <option value="">Job type</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="contract">Contract</option>
        </select>
      </div>
      <div className="flex gap-[30px] items-center">
        <div className="w-0.5 bg-gray-200 h-6" />
        <div className="flex items-stretch px-2">
          <div className="flex flex-col items-stretch">
            <div className="text-[rgba(34,34,34,1)] text-base font-semibold mb-4">
              Salary Per Month
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-[200px]">
                {/* Slider track background */}
                <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-[2px] bg-gray-300 rounded"></div>

                {/* Active range */}
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 h-[2px] bg-black rounded"
                  style={{
                    left: `${minPos}%`,
                    width: `${maxPos - minPos}%`
                  }}
                ></div>

                {/* Min slider */}
                <input
                  type="range"
                  min={minPossible}
                  max={maxPossible}
                  value={searchFilters.minSalary}
                  onChange={handleMinChange}
                  className="absolute w-full h-[2px] appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
                  style={{ zIndex: searchFilters.minSalary > searchFilters.maxSalary - 10000 ? 5 : 1 }}
                />

                {/* Max slider */}
                <input
                  type="range"
                  min={minPossible}
                  max={maxPossible}
                  value={searchFilters.maxSalary}
                  onChange={handleMaxChange}
                  className="absolute w-full h-[2px] appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[5px] [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:cursor-pointer"
                  style={{ zIndex: 2 }}
                />
              </div>
              <div className="text-base text-[rgba(34,34,34,1)] font-semibold ml-4">
                ₹{Math.round(searchFilters.minSalary / 1000)}k - ₹{Math.round(searchFilters.maxSalary / 1000)}k
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;