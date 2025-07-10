import React from 'react';

const reviews = [
  {
    id: 1,
    customer: 'John Doe',
    rating: 5,
    date: '2023-06-15',
    comment: 'Amazing food and great service! Will definitely come back again.',
    order: 'Pizza Margherita, Caesar Salad',
    response: null
  },
  {
    id: 2,
    customer: 'Jane Smith',
    rating: 4,
    date: '2023-06-10',
    comment: 'Food was delicious but the delivery was a bit late.',
    order: 'Pasta Carbonara, Garlic Bread',
    response: "Thank you for your feedback! We're working on improving our delivery times."
  },
  {
    id: 3,
    customer: 'Mike Johnson',
    rating: 3,
    date: '2023-06-05',
    comment: 'The food was okay, but a bit too salty for my taste.',
    order: 'Grilled Salmon, Mashed Potatoes',
    response: null
  },
];

const Reviews = () => {
  const [responseText, setResponseText] = React.useState('');
  const [activeResponse, setActiveResponse] = React.useState(null);

  const getRatingStats = () => {
    const total = reviews.length;
    if (total === 0) return { average: 0, counts: [0, 0, 0, 0, 0] };
    
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const average = sum / total;
    
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      counts[5 - review.rating]++;
    });
    
    return { average, counts };
  };

  const { average, counts } = getRatingStats();

  const handleResponseSubmit = (reviewId) => {
    // In a real app, this would update the backend
    console.log(`Response to review ${reviewId}:`, responseText);
    setResponseText('');
    setActiveResponse(null);
  };

  const renderStars = (value, size = 'text-yellow-400 h-5 w-5') => {
    return (
      <span className="flex items-center">
        {[1,2,3,4,5].map((i) => (
          i <= value ? (
            <svg key={i} className={size} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.382 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.382-2.46a1 1 0 00-1.176 0l-3.382 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.382-2.46c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
          ) : (
            <svg key={i} className={size + ' text-gray-300'} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.382 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.382-2.46a1 1 0 00-1.176 0l-3.382 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.382-2.46c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
          )
        ))}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-red-800">Customer Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-5xl font-bold text-red-600 mb-2">{average.toFixed(1)}</div>
          <div className="flex justify-center mb-2">{renderStars(Math.round(average), 'h-7 w-7')}</div>
          <div className="text-gray-500 text-sm mb-4">Based on {reviews.length} reviews</div>
          <div className="space-y-2">
            {[5,4,3,2,1].map((star, idx) => (
              <div key={star} className="flex items-center gap-2">
                <span className="w-6 text-right text-gray-800">{star}</span>
                {renderStars(1, 'h-4 w-4')}
                <div className="flex-1 bg-gray-200 rounded h-2 mx-2">
                  <div className="bg-yellow-400 h-2 rounded" style={{ width: `${(counts[5-star]/reviews.length)*100}%` }}></div>
                </div>
                <span className="text-gray-500 w-6">{counts[5-star]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-lg">
                    {review.customer.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{review.customer}</div>
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="text-gray-400 text-sm">{new Date(review.date).toLocaleDateString()}</div>
              </div>
              <div className="text-gray-700 mb-2">{review.comment}</div>
              <div className="inline-block px-2 py-1 border border-red-600 text-red-600 rounded text-xs mb-2 bg-red-100">Order: {review.order}</div>
              {review.response && (
                <div className="bg-gray-100 p-3 rounded mt-2">
                  <div className="text-xs text-gray-500 mb-1 font-semibold">Owner's Response</div>
                  <div className="text-gray-700 text-sm">{review.response}</div>
                </div>
              )}
              {!review.response && (
                <div className="mt-3">
                  {activeResponse === review.id ? (
                    <div>
                      <textarea
                        className="w-full border rounded px-3 py-2 mb-2"
                        rows={3}
                        placeholder="Write your response..."
                        value={responseText}
                        onChange={e => setResponseText(e.target.value)}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                          onClick={() => { setActiveResponse(null); setResponseText(''); }}
                          type="button"
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
                          onClick={() => handleResponseSubmit(review.id)}
                          type="button"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
                      onClick={() => setActiveResponse(review.id)}
                      type="button"
                    >
                      Respond
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
