import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardProps {
  children: React.ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogout: () => void; // Ajouté pour gérer la déconnexion
}

const Dashboard = ({
  children,
  currentPage,
  setCurrentPage,
  onLogout
}: DashboardProps) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex flex-col flex-1">
        <Header onLogout={onLogout} /> {/* Passer onLogout au Header */}
        <main className="flex-1 overflow-auto p-4 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default Dashboard;