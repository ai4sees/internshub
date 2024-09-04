import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const CustomDropdown = ({ options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <input
        onClick={toggleDropdown}
        className="w-full p-2 border border-gray-300 rounded bg-white flex items-center justify-between"
        value={selected}
      />
        {/* {selected} */}
        {/* <FaChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} /> */}
      
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10 max-h-80 overflow-y-auto">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
