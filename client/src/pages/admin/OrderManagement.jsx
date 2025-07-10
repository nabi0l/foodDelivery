import React from "react";

const orders = [
  { id: 101, customer: "Alice Smith", restaurant: "Pizza Palace", status: "Pending" },
  { id: 102, customer: "Bob Johnson", restaurant: "Burger Barn", status: "Delivered" },
  { id: 103, customer: "Charlie Lee", restaurant: "Sushi Central", status: "Cancelled" },
];

const statusStyles = {
  Pending: "bg-gray-100 text-gray-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrderManagement() {
  return (
    <section>
      <h3 className="text-xl font-bold mb-6 text-red-600">Order Monitoring</h3>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Restaurant</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-none">
                <td className="py-3 px-4">{order.id}</td>
                <td className="py-3 px-4">{order.customer}</td>
                <td className="py-3 px-4">{order.restaurant}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${statusStyles[order.status]}`}>{order.status}</span>
                </td>
                <td className="py-3 px-4">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded shadow">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
