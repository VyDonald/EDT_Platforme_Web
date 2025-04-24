import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/layout/Dashboard';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import Footer from './components/Footer';

// Pages for Dashboard
import Home from './components/pages/Home';
import Teachers from './components/pages/Teachers';
import Delegates from './components/pages/Delegates';
import Courses from './components/pages/Courses';
import Subjects from './components/pages/Subjects';
import Rooms from './components/pages/Rooms';
import Departments from './components/pages/Departments';
import Schedule from './components/pages/Schedule';

// User interface
export interface User {
  name: string;
  email: string;
  profilePic?: string;
  provider?: 'email' | 'google' | 'facebook';
  roleId?: string; // Ajouté pour inclure le rôle de l'utilisateur
}

// LandingPage component to organize all landing page sections
const LandingPage: React.FC = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <Footer />
    </>
  );
};

// HomeProps interface
interface HomeProps {
  user: User | null;
  onLogout: () => void;
}

// App component with routing
export const App: React.FC = () => {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home');
  
  // Check for stored auth on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (storedUser && storedLoggedIn === 'true') {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);
  
  // Handle successful login
  const handleLoginSuccess = (userData: User, token: string) => {
    setUser(userData);
    setIsLoggedIn(true);
    
    // Store auth info in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('token', token); // Stocke le token
  };
  
  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    
    // Clear stored auth info
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token'); // Nettoie le token
  };
  
  // Component to render the current page within Dashboard
  const CurrentPageComponent = () => {
    switch (currentPage) {
      case 'home':
        return <Home user={user} onLogout={handleLogout} />;
      case 'teachers':
        return <Teachers />;
      case 'delegates':
        return <Delegates />;
      case 'courses':
        return <Courses />;
      case 'subjects':
        return <Subjects />;
      case 'rooms':
        return <Rooms />;
      case 'departments':
        return <Departments />;
      case 'schedule':
        return <Schedule />;
      default:
        return <Home user={user} onLogout={handleLogout} />;
    }
  };
  
  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route 
          path="/" 
          element={
            isLoggedIn ? 
              <Navigate to="/dashboard" /> : 
              <LandingPage />
          } 
        />
        
        {/* Login Route */}
        <Route 
          path="/login"
          element={
            isLoggedIn ? 
              <Navigate to="/dashboard" /> : 
              <Login onLoginSuccess={handleLoginSuccess} />
          }
        />
        
        {/* Dashboard and Protected Routes */}
        <Route 
          path="/dashboard/*" 
          element={
            isLoggedIn ? (
              <Dashboard 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onLogout={handleLogout} // Passer onLogout au Dashboard
              >
                <CurrentPageComponent />
              </Dashboard>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;