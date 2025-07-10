import React from "react";

const users = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", status: "Active" },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", status: "Blocked" },
  { id: 3, name: "Charlie Lee", email: "charlie@example.com", status: "Active" },
];

export default function UserManagement() {
  return (
    <section>
      <h3 className="text-xl font-bold mb-6 text-red-600">User Management</h3>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-none">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow">
                    Block
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded shadow">
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
