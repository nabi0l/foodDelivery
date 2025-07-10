import React from "react";

const tickets = [
  { id: 201, user: "Alice Smith", subject: "Order not delivered", status: "Open" },
  { id: 202, user: "Bob Johnson", subject: "Payment issue", status: "Closed" },
  { id: 203, user: "Charlie Lee", subject: "Restaurant not listed", status: "Open" },
];

export default function SupportManagement() {
  return (
    <section>
      <h3 className="text-xl font-bold mb-6 text-red-600">Support Ticket Management</h3>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">Ticket ID</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Subject</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b last:border-none">
                <td className="py-3 px-4">{ticket.id}</td>
                <td className="py-3 px-4">{ticket.user}</td>
                <td className="py-3 px-4">{ticket.subject}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      ticket.status === "Open"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow">Assign</button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded shadow">Resolve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
} 