import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate(); // Hook for navigation
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Function to handle login button click
  const handleLoginClick = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className={`text-2xl font-bold ${scrolled ? 'text-blue-600' : 'text-white'}`}>
            TimeManager
          </h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {['Accueil', 'À Propos', 'Services'].map(item => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase().replace(' ', '-')}`} 
                  className={`font-medium hover:text-blue-500 transition-colors ${scrolled ? 'text-gray-800' : 'text-white'}`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          onClick={handleLoginClick}
        >
          Connexion
        </button>
      </div>
    </header>
  );
};

export default Header;