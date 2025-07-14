import React from 'react';

// Sample data for analytics
const salesData = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 19 },
  { name: 'Wed', revenue: 2000, orders: 16 },
  { name: 'Thu', revenue: 2780, orders: 22 },
  { name: 'Fri', revenue: 3890, orders: 31 },
  { name: 'Sat', revenue: 4590, orders: 38 },
  { name: 'Sun', revenue: 3490, orders: 29 },
];

const categoryData = [
  { name: 'Pizza', value: 35 },
  { name: 'Burgers', value: 20 },
  { name: 'Pasta', value: 15 },
  { name: 'Salads', value: 10 },
  { name: 'Drinks', value: 15 },
  { name: 'Desserts', value: 5 },
];

const stats = [
  {
    title: 'Total Revenue',
    value: '$12,345',
    change: '+12.5%',
    isPositive: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 1.306.835 2.417 2 2.83V17h2v-3.17c1.165-.413 2-1.524 2-2.83 0-1.657-1.343-3-3-3z" /></svg>
    )
  },
  {
    title: 'Total Orders',
    value: '1,234',
    change: '+8.2%',
    isPositive: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>
    )
  },
  {
    title: 'Average Order Value',
    value: '$42.50',
    change: '+5.1%',
    isPositive: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 1.306.835 2.417 2 2.83V17h2v-3.17c1.165-.413 2-1.524 2-2.83 0-1.657-1.343-3-3-3z" /></svg>
    )
  },
  {
    title: 'Customer Rating',
    value: '4.7/5',
    change: '+0.3',
    isPositive: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29a1 1 0 00.95.69h6.631c.969 0 1.371 1.24.588 1.81l-5.37 3.905a1 1 0 00-.364 1.118l2.036 6.29c.3.921-.755 1.688-1.54 1.118l-5.37-3.905a1 1 0 00-1.176 0l-5.37 3.905c-.784.57-1.838-.197-1.54-1.118l2.036-6.29a1 1 0 00-.364-1.118L2.342 11.717c-.783-.57-.38-1.81.588-1.81h6.631a1 1 0 00.95-.69l2.036-6.29z" /></svg>
    )
  },
];

const popularItems = [
  { name: 'Margherita Pizza', orders: 156, revenue: 1892.50 },
  { name: 'Caesar Salad', orders: 98, revenue: 980.00 },
  { name: 'Pasta Carbonara', orders: 87, revenue: 1044.00 },
  { name: 'Chicken Wings', orders: 76, revenue: 760.00 },
  { name: 'Garlic Bread', orders: 65, revenue: 260.00 },
];

const timeRanges = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
];

const RestaurantAnalytics = () => {
  const [timeRange, setTimeRange] = React.useState('week');

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Calculate total revenue and orders for the table
  const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
  const maxCategory = Math.max(...categoryData.map(c => c.value));
  const salesByHour = [
    { name: '10 AM', sales: 20 },
    { name: '12 PM', sales: 45 },
    { name: '2 PM', sales: 35 },
    { name: '4 PM', sales: 25 },
    { name: '6 PM', sales: 65 },
    { name: '8 PM', sales: 55 },
    { name: '10 PM', sales: 30 },
  ];
  const maxSalesHour = Math.max(...salesByHour.map(s => s.sales));

  return (
    <div className="p-4 md:p-8">
      {/* Header and Time Range */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-red-800">Analytics Dashboard</h1>
        <div>
          <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
          <select
            id="timeRange"
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 text-gray-700"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-gray-500 text-sm font-medium mb-1">{stat.title}</div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="flex items-center mt-1">
                  {stat.isPositive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  )}
                  <span className={`ml-1 text-sm font-medium text-red-600`}>{stat.change}</span>
                  <span className="ml-1 text-xs text-gray-400">vs last period</span>
                </div>
              </div>
              <div>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Orders Table */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Revenue & Orders (per day)</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Day</th>
              <th className="py-2 px-4 text-left">Revenue ($)</th>
              <th className="py-2 px-4 text-left">Orders</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((row, idx) => (
              <tr key={row.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="py-2 px-4 text-gray-800">{row.name}</td>
                <td className="py-2 px-4 text-gray-800">{row.revenue}</td>
                <td className="py-2 px-4 text-gray-800">{row.orders}</td>
              </tr>
            ))}
            <tr className="font-bold border-t">
              <td className="py-2 px-4 text-gray-800">Total</td>
              <td className="py-2 px-4 text-gray-800">{totalRevenue}</td>
              <td className="py-2 px-4 text-gray-800">{totalOrders}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Categories Distribution Progress Bars */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Categories Distribution</h2>
        <div className="space-y-4">
          {categoryData.map((cat) => (
            <div key={cat.name}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700 font-medium">{cat.name}</span>
                <span className="text-gray-500">{cat.value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-red-600"
                  style={{ width: `${cat.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Popular Items</h2>
          <ul>
            {popularItems.map((item, index) => (
              <React.Fragment key={index}>
                <li className="py-3 flex flex-col border-b last:border-b-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-red-600 font-semibold">${item.revenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{item.orders} orders</span>
                    <span>${(item.revenue / item.orders).toFixed(2)} avg.</span>
                  </div>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>
        {/* Sales by Hour (Bar visualization) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Sales by Hour</h2>
          <div className="space-y-3">
            {salesByHour.map((hour) => (
              <div key={hour.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">{hour.name}</span>
                  <span className="text-gray-500">{hour.sales}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-red-600"
                    style={{ width: `${(hour.sales / maxSalesHour) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantAnalytics;