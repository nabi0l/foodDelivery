import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTag, FaPercentage, FaDollarSign } from 'react-icons/fa';

const SpecialOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecialOffers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/promoCode/active');
        setOffers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching special offers:', err);
        setError('Failed to load special offers. Please try again later.');
        setLoading(false);
      }
    };

    fetchSpecialOffers();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDiscountText = (offer) => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% OFF${offer.maxDiscount ? ` (up to $${offer.maxDiscount})` : ''}`;
    } else {
      return `$${offer.discountValue} OFF`;
    }
  };

  if (loading) {
    return (
      <section className="py-12 px-4 bg-red-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Special Offers</h2>
          <div className="flex justify-center">
            <div className="animate-pulse text-gray-600">Loading special offers...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 bg-red-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Special Offers</h2>
          <div className="text-red-600 text-center">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-red-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Special Offers</h2>
        
        {offers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No special offers available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                      {offer.discountType === 'percentage' ? (
                        <FaPercentage className="text-red-600 text-xl" />
                      ) : (
                        <FaDollarSign className="text-red-600 text-xl" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">{offer.code}</h3>
                      <p className="text-red-600 font-semibold">
                        {getDiscountText(offer)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    {offer.description}
                  </p>
                  <div className="text-sm text-gray-600 mb-3">
                    <p>Min. order: ${offer.minOrderAmount}</p>
                    {offer.applicableCategories && offer.applicableCategories[0] !== 'all' && (
                      <p>Categories: {offer.applicableCategories.join(', ')}</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Valid until: {formatDate(offer.endDate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {offer.usedCount} of {offer.usageLimit} used
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SpecialOffers;
