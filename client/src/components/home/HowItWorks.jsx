import React from 'react';
import { FaMapMarkerAlt, FaUtensils, FaMotorcycle } from 'react-icons/fa';

const steps = [
  {
    id: 1,
    icon: <FaMapMarkerAlt className="text-4xl text-red-800" />,
    title: 'Set Your Location',
    description: 'Choose the location where your food will be delivered.',
  },
  {
    id: 2,
    icon: <FaUtensils className="text-4xl text-red-800" />,
    title: 'Choose A Restaurant',
    description: 'Browse hundreds of menus to find the food you like.',
  },
  {
    id: 3,
    icon: <FaMotorcycle className="text-4xl text-red-800" />,
    title: 'Fast Delivery',
    description: 'Food is prepared & delivered to your door.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="bg-white p-8 rounded-xl shadow-md text-center relative"
            >
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <div className="absolute -top-4 -right-4 bg-red-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
