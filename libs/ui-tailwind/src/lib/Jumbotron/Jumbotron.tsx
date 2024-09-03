import React from 'react';

interface JumbotronProps {
  primaryText: string;
  secondaryText: string;
}

const Jumbotron: React.FC<JumbotronProps> = ({ primaryText, secondaryText }) => {
  return (
    <div className="bg-blue-500 text-white py-20 px-10 text-center">
      <h1 className="text-4xl font-bold mb-4">{primaryText}</h1>
      <p className="text-xl">{secondaryText}</p>
    </div>
  );
};

export default Jumbotron;
