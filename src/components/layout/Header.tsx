import React from 'react';
import { SearchIcon, MailIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onLogout: () => void; // Ajouté pour gérer la déconnexion
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout(); // Appelle la fonction de déconnexion
    navigate('/'); // Redirige vers la page d'accueil
  };

  return (
    <header className="bg-gray-800 text-white p-3 flex items-center justify-between">
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-gray-700 rounded-md py-1 px-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
          <SearchIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="flex items-center">
        <div className="relative mr-2">
          <MailIcon className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
            5
          </span>
        </div>
        <span className="text-sm mr-4">ADMINISTRATION</span>
        <button
          onClick={handleLogoutClick}
          className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default Header;