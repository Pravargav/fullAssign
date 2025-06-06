import React from 'react';

interface JobCardProps {
  _id?: string;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  salaryFrom?: string;
  salaryTo?: string;
  jobDescription: string;
  createdAt: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  _id,
  jobTitle,
  companyName,
  location,
  jobType,
  salaryFrom,
  salaryTo,
  jobDescription,
  createdAt,
}) => {
  // Format salary display
  const getSalaryDisplay = () => {
    if (salaryFrom && salaryTo) {
      return `₹${salaryFrom} - ₹${salaryTo}`;
    } else if (salaryFrom) {
      return `₹${salaryFrom}+`;
    } else if (salaryTo) {
      return `Up to ₹${salaryTo}`;
    }
    return 'Salary not specified';
  };

  // Format job type
  const formatJobType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Calculate time ago
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  // Generate company logo placeholder
  const getCompanyInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <article className="bg-white shadow-[0px_0px_14px_rgba(211,211,211,0.15)] self-stretch flex min-w-64 flex-col overflow-hidden items-stretch w-[320px] h-[400px] my-auto px-4 py-6 rounded-xl">
      <div className="flex w-full items-start gap-4 text-black justify-between">
        <div className="flex items-start gap-4">
          {/* Company Logo Placeholder */}
          <div className="aspect-[1.01] w-[70px] shadow-[0px_0px_10px_rgba(148,148,148,0.25)] rounded-[13px] bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-blue-600">
              {getCompanyInitials(companyName)}
            </span>
          </div>
          <div className="flex flex-col items-start text-left">
            <h2 className="text-xl font-bold mb-1">{jobTitle}</h2>
            <p className="text-sm text-gray-600">{companyName}</p>
          </div>
        </div>
        <div className="bg-[rgba(176,217,255,1)] text-xs font-medium px-2 py-1 rounded-md flex-shrink-0">
          {getTimeAgo(createdAt)}
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-[rgba(90,90,90,1)] font-medium mt-6">
        <div className="flex items-center gap-1">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d00ac41cba85c00e0afea6c6f924d31c97e6db83?placeholderIfAbsent=true"
            alt="Job Type"
            className="aspect-[1.19] object-contain w-[16px] flex-shrink-0"
          />
          <div>{formatJobType(jobType)}</div>
        </div>
        <div className="flex items-center gap-1">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e131d961b75b6e7a0a5ee64bb97be5ee4f28b50?placeholderIfAbsent=true"
            alt="Location"
            className="aspect-[1.19] object-contain w-[16px] flex-shrink-0"
          />
          <div>{location}</div>
        </div>
        <div className="flex items-center gap-1">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a4b20254c7771038bda1222d919b55c5face6b40?placeholderIfAbsent=true"
            alt="Salary"
            className="aspect-[0.9] object-contain w-[16px] flex-shrink-0"
          />
          <div className="text-xs">{getSalaryDisplay()}</div>
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-[rgba(85,85,85,1)] text-sm font-medium leading-relaxed">
          {jobDescription.length > 150 
            ? `${jobDescription.substring(0, 150)}...` 
            : jobDescription
          }
        </p>
        
        <button 
          className="self-stretch bg-[rgba(0,170,255,1)] shadow-[0px_0px_14px_rgba(93,93,93,0.15)] border gap-2.5 text-base text-white font-semibold text-center px-4 py-3 rounded-[10px] border-[rgba(0,170,255,1)] border-solid hover:bg-blue-600 transition-colors mt-4 w-full"
          onClick={() => {
            // You can add navigation logic here
            console.log('Apply for job:', _id);
          }}
        >
          Apply Now
        </button>
      </div>
    </article>
  );
};

export default JobCard;