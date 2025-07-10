import React from 'react';

const stats = [
  {
    title: 'Total Orders',
    value: '1,234',
    icon: (
      <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>
    ),
  },
  {
    title: 'Total Revenue',
    value: '$12,345',
    icon: (
      <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 1.306.835 2.417 2 2.83V17h2v-3.17c1.165-.413 2-1.524 2-2.83 0-1.657-1.343-3-3-3z" /></svg>
    ),
  },
  {
    title: 'Top Item',
    value: 'Margherita Pizza',
    icon: (
      <svg className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
    ),
  },
  {
    title: 'Customer Rating',
    value: '4.7/5',
    icon: (
      <svg className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29a1 1 0 00.95.69h6.631c.969 0 1.371 1.24.588 1.81l-5.37 3.905a1 1 0 00-.364 1.118l2.036 6.29c.3.921-.755 1.688-1.54 1.118l-5.37-3.905a1 1 0 00-1.176 0l-5.37 3.905c-.784.57-1.838-.197-1.54-1.118l2.036-6.29a1 1 0 00-.364-1.118L2.342 11.717c-.783-.57-.38-1.81.588-1.81h6.631a1 1 0 00.95-.69l2.036-6.29z" /></svg>
    ),
  },
];

export default function RestaurantHome() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-red-800 mb-4">Welcome to your Restaurant Dashboard!</h1>
      <p className="text-gray-500 mb-8">Here you can manage your menu, view orders, track analytics, and respond to customer reviews.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <div className="mb-2">{stat.icon}</div>
            <div className="text-gray-500 text-sm font-medium mb-1">{stat.title}</div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
          </div>
        ))}
      </div>
      <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Quick Tips</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Use the sidebar to navigate between dashboard sections.</li>
          <li>Keep your menu up to date for the best customer experience.</li>
          <li>Track your analytics to optimize your restaurant's performance.</li>
          <li>Respond to reviews to build customer loyalty.</li>
        </ul>
      </div>
    </div>
  );
} 