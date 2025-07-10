import React from "react";

export default function Analytics() {
  return (
    <section>
      <h3 className="text-xl font-bold mb-6 text-red-600">Revenue Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h4>
          <p className="text-2xl font-bold text-red-600">$12,500</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Orders This Month</h4>
          <p className="text-2xl font-bold text-red-600">320</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Top Restaurant</h4>
          <p className="text-2xl font-bold text-red-600">Pizza Palace</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">Revenue (Last 6 Months)</h4>
        <div className="h-40 flex items-center justify-center bg-gray-100 rounded">[Bar Chart Placeholder]</div>
      </div>
    </section>
  );
}
