import React, { useEffect, useState } from 'react';
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  return <section id="accueil" className="relative min-h-screen flex items-center bg-gradient-to-r from-blue-900 to-indigo-900 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Background" className="w-full h-full object-cover" />
      </div>
      <div className="container mx-auto px-4 z-10 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Gérez votre temps{' '}
              <span className="text-blue-400">efficacement</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Notre plateforme de gestion d'emploi du temps vous permet
              d'organiser vos journées de manière optimale et d'augmenter votre
              productivité.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Démarrer
              </button>
              <button className="bg-transparent hover:bg-white/10 text-white border border-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-lg">
                En savoir plus
              </button>
            </div>
          </div>
          <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Calendar" className="w-full h-auto" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg animate-bounce">
                <span className="font-bold">Nouveau !</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 text-white fill-current">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.44,118.92,130.61,111.31,191.39,100.41,259.94,89,322.36,67.77,381.39,56.44Z"></path>
        </svg>
      </div>
    </section>;
};
export default HeroSection;