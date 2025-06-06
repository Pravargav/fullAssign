import React, { useState } from 'react';
import CreateJobModal from './CreateJobModal';

export const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateJobClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-[0px_0px_14px_rgba(198,191,191,0.25)] self-stretch flex w-full flex-col overflow-hidden items-stretch px-[63px] py-3 max-md:max-w-full max-md:px-5">
        <div className="bg-white shadow-[0px_0px_20px_rgba(127,127,127,0.15)] border self-center flex w-[890px] max-w-full items-stretch gap-5 text-sm font-semibold justify-between px-[26px] py-2 rounded-[122px] border-[rgba(252,252,252,1)] border-solid max-md:px-5">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e36718bedf1886fe92266e0bbd2c891194ee8d31?placeholderIfAbsent=true"
            alt="Company Logo"
            className="aspect-[1] object-contain w-8 shrink-0 my-auto"
          />
          <div className="flex items-stretch text-[#303030] max-md:max-w-full">
            <NavItem label="Home" />
            <NavItem label="Find Jobs" />
            <NavItem label="Find Talents" />
            <NavItem label="About us" />
            <NavItem label="Testimonials" />
          </div>
          <button 
            onClick={handleCreateJobClick}
            className="flex items-center gap-[11px] overflow-hidden text-white text-center justify-center p-[3px] rounded-xl"
          >
            <div className="justify-center items-center self-stretch flex w-[100px] gap-2.5 my-auto px-4 py-1.5 rounded-[30px] max-md:px-3 bg-violet-600 hover:bg-violet-700 transition-colors">
              <span className="self-stretch w-[60px] my-auto text-xs font-medium">
                Create Jobs
              </span>
            </div>
          </button>
        </div>
      </nav>
      
      <CreateJobModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

const NavItem: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-[11px] whitespace-nowrap justify-center p-[3px] rounded-xl">
    <div className="text-[#303030] self-stretch bg-white gap-2.5 my-auto px-4 py-1.5 rounded-[10px] max-md:px-3">
      {label}
    </div>
  </div>
);

export default Navbar;