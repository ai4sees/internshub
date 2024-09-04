import React from 'react';
import { RadioGroup, Radio } from 'react-radio-group';

const CustomRadio = ({ selectedType, onTypeChange }) => {
  return (
    <div className="mb-4">
      <p className="mb-2 font-semibold">Type of Internship:</p>
      <RadioGroup
        name="internshipType"
        selectedValue={selectedType}
        onChange={onTypeChange}
        className="flex items-center"
      >
        <label className="mr-4 flex items-center">
          <Radio value="workFromHome" className="mr-2" />
          Work from Home
        </label>
        <label className="flex items-center">
          <Radio value="workFromOffice" className="mr-2" />
          Work from Office
        </label>
      </RadioGroup>
    </div>
  );
};

export default CustomRadio;
