import React from 'react';

const offers = [
  {
    id: 1,
    title: '20% OFF',
    subtitle: 'On your first order',
    code: 'WELCOME20',
    description: 'Use code WELCOME50 at checkout',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
  },
  {
    id: 2,
    title: 'Free Delivery',
    subtitle: 'On orders over $20',
    code: 'FREEDEL',
    description: 'No code needed. Min. order $20',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
  },
  {
    id: 3,
    title: '30% OFF',
    subtitle: 'On your next order',
    code: 'NEXT30',
    description: 'Limited time offer',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
];

const PromotionalOffers = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Special Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`${offer.bgColor} rounded-xl p-6 shadow-md flex flex-col items-center text-center`}
            >
              <h3 className={`text-4xl font-bold mb-2 ${offer.textColor}`}>
                {offer.title}
              </h3>
              <p className="text-lg font-medium mb-4">{offer.subtitle}</p>
              <div className="bg-white px-4 py-2 rounded-full mb-4">
                <span className="font-mono font-bold">{offer.code}</span>
              </div>
              <p className="text-sm text-gray-600">{offer.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalOffers;
