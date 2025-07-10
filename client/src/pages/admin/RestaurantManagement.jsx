import React from "react";

const restaurants = [
  { id: 1, name: "Pizza Palace", owner: "Alice Smith", status: "Active" },
  { id: 2, name: "Burger Barn", owner: "Bob Johnson", status: "Blocked" },
  { id: 3, name: "Sushi Central", owner: "Charlie Lee", status: "Active" },
];

export default function RestaurantManagement() {
  return (
    <section>
      <h3 className="text-xl font-bold mb-6 text-red-600">Restaurant Management</h3>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Owner</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((rest) => (
              <tr key={rest.id} className="border-b last:border-none">
                <td className="py-3 px-4">{rest.name}</td>
                <td className="py-3 px-4">{rest.owner}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      rest.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {rest.status}
                  </span>
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow">Block</button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded shadow">Approve</button>
                  <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1 rounded shadow">Edit</button>
                  <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded shadow">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
