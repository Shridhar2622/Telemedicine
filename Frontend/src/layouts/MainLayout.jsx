import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/headers/Header';

const MainLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-blue-50 transition-colors duration-300">
      <Sidebar />
      <main className="md:ml-64 min-h-screen transition-all duration-300">
        <Header avtar={user.userName || user.email} />
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
