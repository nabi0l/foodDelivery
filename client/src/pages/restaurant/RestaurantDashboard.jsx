import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0H7m6 0v6m0 0H7m6 0h6" /></svg>
    ), path: '' },
  { text: 'Orders', icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6" /></svg>
    ), path: 'orders' },
  { text: 'Menu', icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
    ), path: 'menu' },
  { text: 'Analytics', icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17a2 2 0 104 0 2 2 0 00-4 0zm-7-2a2 2 0 104 0 2 2 0 00-4 0zm14-2a2 2 0 104 0 2 2 0 00-4 0zm-7-2a2 2 0 104 0 2 2 0 00-4 0z" /></svg>
    ), path: 'analytics' },
  { text: 'Reviews', icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29a1 1 0 00.95.69h6.631c.969 0 1.371 1.24.588 1.81l-5.37 3.905a1 1 0 00-.364 1.118l2.036 6.29c.3.921-.755 1.688-1.54 1.118l-5.37-3.905a1 1 0 00-1.176 0l-5.37 3.905c-.784.57-1.838-.197-1.54-1.118l2.036-6.29a1 1 0 00-.364-1.118L2.342 11.717c-.783-.57-.38-1.81.588-1.81h6.631a1 1 0 00.95-.69l2.036-6.29z" /></svg>
    ), path: 'reviews' },
];

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('');

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-60 h-150 bg-white text-gray-800 border-r-4  border-b-4 border-t-4 border-red-200 flex flex-col">
        <div className="h-16 flex items-center justify-center font-bold text-lg border-b border-gray-100">Restaurant Dashboard</div>
        <nav className="flex-1 py-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.text}>
                <button
                  className={`w-full flex items-center px-6 py-3 text-left transition rounded-none ${
                    activeTab === item.path
                      ? 'bg-red-100 text-red-600 border-l-4 border-red-600 font-semibold'
                      : 'hover:bg-red-50 hover:text-red-600'
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <span className={`mr-3 ${activeTab === item.path ? 'text-red-600' : 'text-gray-400'}`}>{item.icon}</span>
                  <span>{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="h-16" /> {/* Spacer for alignment */}
        <Outlet />
      </main>
    </div>
  );
};

export default RestaurantDashboard;
