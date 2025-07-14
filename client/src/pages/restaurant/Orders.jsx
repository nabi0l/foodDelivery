import React, { useState } from 'react';

const orderStatus = {
  new: { label: 'New', color: 'bg-red-100 text-red-700' },
  accepted: { label: 'Preparing', color: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Completed', color: 'bg-gray-200 text-gray-500' },
};

const Orders = () => {
  const [tabValue, setTabValue] = useState('new');
  
  // Sample order data
  const orders = [
    { id: 1, customer: 'John Doe', items: 'Pizza x2, Burger x1', status: 'new', time: '2 min ago' },
    { id: 2, customer: 'Jane Smith', items: 'Pasta x1, Salad x1', status: 'accepted', time: '15 min ago' },
    { id: 3, customer: 'Mike Johnson', items: 'Steak x1, Fries x2', status: 'completed', time: '1 hour ago' },
  ];

  const filteredOrders = orders.filter(order => tabValue === 'all' ? true : order.status === tabValue);

  const handleChange = (newValue) => {
    setTabValue(newValue);
  };

  const tabList = [
    { label: 'New Orders', value: 'new' },
    { label: 'In Progress', value: 'accepted' },
    { label: 'Completed', value: 'completed' },
    { label: 'All Orders', value: 'all' },
  ];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Order Management</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white rounded shadow p-2">
        {tabList.map(tab => (
          <button
            key={tab.value}
            className={`px-4 py-2 rounded font-medium transition border-b-2 ${tabValue === tab.value ? 'border-red-600 text-red-600 bg-red-50' : 'border-transparent text-gray-600 hover:bg-gray-100'}`}
            onClick={() => handleChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Order ID</th>
              <th className="py-2 px-4 text-left">Customer</th>
              <th className="py-2 px-4 text-left">Items</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Time</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, idx) => (
              <tr key={order.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="py-2 px-4 font-semibold text-gray-800">#{order.id}</td>
                <td className="py-2 px-4 text-gray-800">{order.customer}</td>
                <td className="py-2 px-4 text-gray-800">{order.items}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${orderStatus[order.status].color}`}>{orderStatus[order.status].label}</span>
                </td>
                <td className="py-2 px-4 text-gray-500">{order.time}</td>
                <td className="py-2 px-4">
                  {order.status === 'new' && (
                    <button
                      className="px-3 py-1 rounded border border-red-600 text-red-600 text-xs font-semibold hover:bg-red-50 mr-2"
                      onClick={() => console.log(`Accept order ${order.id}`)}
                    >
                      Accept
                    </button>
                  )}
                  {order.status === 'accepted' && (
                    <button
                      className="px-3 py-1 rounded border border-red-600 text-red-600 text-xs font-semibold hover:bg-red-50"
                      onClick={() => console.log(`Complete order ${order.id}`)}
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;