import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPhone
} from "@fortawesome/free-solid-svg-icons";
import pic1 from "../../images/pic_1.png";
import pic2 from "../../images/pic_2.png";
import pic3 from "../../images/pic_3.png";
import pic4 from "../../images/pic_4.png";
import pic5 from "../../images/pic_5.png";
import pic6 from "../../images/pic_6.png";
import pic7 from "../../images/pic_7.png";
import pic8 from "../../images/pic_8.png";
import pic9 from "../../images/pic_9.png";
import pic10 from "../../images/pic_10.png";
import pic11 from "../../images/pic_11.png";
import pic12 from "../../images/pic_12.png";
import pic13 from "../../images/pic_13.png";
import pic14 from "../../images/pic_14.png";
import pic15 from "../../images/pic_15.png";

import Slider from "react-slick";

const images = [pic1, pic2, pic3, pic4, pic5, pic6];
// const images2 = [pic7, pic8, pic9, pic10, pic11];
const images2 = [
  {
    src:pic7,
    title:"Full stack development Course",
    duration:"8 Months",
    ind:1
  },
  {
    src:pic8,
    title:"Data Science Course",
    duration:"8 Months",
    ind:2
  },
  {
    src:pic9,
    title:"Electric Vehicle Course",
    duration:"8 Months",
    ind:3
  },
  {
    src:pic10,
    title:"Product Management Course",
    duration:"8 Months",
    ind:4
  },
  {
    src:pic11,
    title:"UI/UX design Course",
    duration:"8 Months",
    ind:5
  },
];

const images3=[
  {
    src:pic12,
    title:"Web Development",
    duration:"8 Weeks"

  },
  {
    src:pic13,
    title:"React",
    duration:"6 Weeks"

  },
  {
    src:pic14,
    title:"Programming with Python",
    duration:"6 Weeks"

  },
  {
    src:pic15,
    title:"Machine Learning",
    duration:"6 Weeks"

  },
]

const RightSide = () => {
  const settings = {
    className: "center",
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    dots: true,
    
  };

  return (
    <div className="w-2/3 h-screen absolute right-0 top-[200px]">
      <button className="fixed right-10 bottom-5 border border-black h-[46px] w-[220px] text-center bg-blue-400 rounded-md z-20 font-semibold hover:bg-green-600">
      <FontAwesomeIcon icon={faPhone} className="text-black mr-2" />
      Contact Us</button>
      <div>
        <h1 className="text-2xl font-bold py-5 px-9">Recommended For You!!!</h1>
        <div className="w-[87%] h-[200px] mx-auto ">
          <Slider {...settings}>
            {images.map((image, index) => (
              <div className="mx-5 px-5 h-[250px] w-[400px] border-l-2 p-0">
                <img
                  src={image}
                  key={index}
                  alt=""
                  className="rounded-xl hover:cursor-pointer  h-[170px] w-[470px] p-0 hover:scale-110 duration-300 mt-7"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <div className="my-10">
        <h1 className="text-2xl font-bold py-5 px-9">Placement guarantee courses</h1>
        <div className=" w-[87%] h-[300px] mx-auto">
          <Slider {...settings}>
         
          {
            images2.map(({src,title,duration,ind})=>(
              <div className="mx-5 px-5 h-[240px] w-[400px] p-5 border-l-2 ">
              <img src={src} key={ind} alt="" className="mt-7 hover:scale-110 duration-300 hover:cursor-pointer" />
              <h1 className="text-center text-lg font-semibold">{title}</h1>
              <h1 className="text-center">Duration-{duration}</h1>
              </div>
            ))
          }
          
          </Slider>
        </div>
      </div>

      <div className="my-10">
        <h1 className="text-2xl font-bold py-5 px-9">Certification courses for you</h1>
        <div className=" w-[87%] h-[300px] mx-auto">
          <Slider {...settings}>
         
          {
            images3.map(({src,title,duration})=>(
              <div className="mx-5 px-5 h-[240px] w-[400px] p-5 border-l-2 ">
              <img src={src} alt="" className="mt-7 hover:scale-110 duration-300 hover:cursor-pointer" />
              <h1 className="text-center text-lg font-semibold">{title}</h1>
              <h1 className="text-center">Duration-{duration}</h1>
              </div>
            ))
          }
          
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
