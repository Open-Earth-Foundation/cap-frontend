import React from 'react';
import CityDropdown from './CityDropdown';

const Hero = ({ onSearch }) => {
  return (
    <div className="container mx-auto px-4 py-36 flex justify-center items-center gap-32 max-w-[1200px]">
      {/* Left column with text */}
      <div className="flex-1 flex flex-col justify-center items-start gap-6">
        <h1 className="w-full">
          <span className="block text-5xl font-normal leading-tight font-poppins">
            Know more.
          </span>
          <span className="block text-5xl font-bold leading-tight font-poppins">
            Prepare better.
          </span>
        </h1>
        <p className="text-base font-normal leading-relaxed tracking-wide font-opensans">
          Prepare and adapt your city to potential risks with science-backed insights
        </p>
      </div>

      {/* Right column with search */}
      <div className="flex-1">
        <div className="relative">
          <div className="absolute left-3 top-[13px] z-10 pointer-events-none">
            <svg
              className="w-4 h-4 text-[#7A7B9A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <CityDropdown 
            onCityChange={onSearch}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: '40px',
                height: '40px',
                paddingLeft: '32px',
                borderColor: '#D7D8FA',
                borderRadius: '4px',
                '&:hover': {
                  borderColor: '#D7D8FA'
                }
              }),
              placeholder: (base) => ({
                ...base,
                color: '#A0AEC0',
                fontFamily: 'Open Sans',
                fontSize: '16px'
              }),
              input: (base) => ({
                ...base,
                fontFamily: 'Open Sans',
                fontSize: '16px'
              }),
              option: (base) => ({
                ...base,
                fontFamily: 'Open Sans',
                fontSize: '16px'
              }),
              menu: (base) => ({
                ...base,
                zIndex: 20
              })
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;