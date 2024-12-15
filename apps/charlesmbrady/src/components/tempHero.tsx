import React from 'react';

const Hero = ({ text, subtext }: any) => {
  return (
    <div className="relative overflow-hidden py-20 before:content-[''] before:absolute before:inset-0 before:bg-blue-500 before:-skew-y-2 before:origin-top-left before:z-0">
      <div className="relative z-10 container mx-auto text-center">
        <h1 className="text-4xl font-bold text-white">{text}</h1>
        <p className="mt-4 text-xl text-white">{subtext}</p>
        <img src="./logo.svg" />
      </div>
    </div>
  );
};

export default Hero;
