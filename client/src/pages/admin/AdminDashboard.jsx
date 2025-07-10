
import React, { useState } from "react";
import UserManagement from "./UserManagement";
import RestaurantManagement from "./RestaurantManagement";
import OrderManagement from "./OrderManagement";
import Analytics from "./Analytics";
import SupportManagement from "./SupportManagement";

const sections = [
  { label: "User Management", component: <UserManagement /> },
  { label: "Restaurant Management", component: <RestaurantManagement /> },
  { label: "Order Monitoring", component: <OrderManagement /> },
  { label: "Revenue Analytics", component: <Analytics /> },
  { label: "Support Tickets", component: <SupportManagement /> },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-red-600">Admin Panel</h2>
        </div>
        <nav className="flex-1">
          <ul className="mt-4 space-y-2">
            {sections.map((section, idx) => (
              <li key={section.label}>
                <button
                  className={`w-full text-left px-6 py-3 rounded-l-lg transition-colors ${
                    idx === activeSection
                      ? "bg-red-100 text-red-700 font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setActiveSection(idx)}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">{sections[activeSection].component}</main>
    </div>
  );
}
