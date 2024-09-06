import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../utilscss/SliderStyles.css'

const StipendSlider = ({ selectedStipend, setSelectedStipend }) => {

  // Marks for the slider
  const marks = {
    0: '0k',
    2000: '2k',
    4000:'4k',
    6000: '6k',
    8000: '8k',
    10000: '10k',
  };

  const handleSliderChange = (value) => {
    setStipend(value);
    onStipendChange(value); // Notify the parent component of the stipend change
  };

 

  return (
    <div className="w-full max-w-md mx-auto py-4 mt-5">
      <h3 className="text-base mb-4">Select Minimum Stipend</h3>
      <div className="px-2">
        <Slider
          min={0}
          max={10000}
          marks={marks}
          step={null} // Slider stops only at defined marks
          onChange={(value) => setSelectedStipend(value)}
          value={selectedStipend}
          
          className="custom-slider" // Add a custom class for custom CSS styling
        />
      </div>
      
    </div>
  );
};

export default StipendSlider;
