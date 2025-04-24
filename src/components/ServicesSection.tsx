import React from 'react';
import { useInView } from './hooks/useInView';
const ServicesSection = () => {
  const [ref, isVisible] = useInView({
    threshold: 0.1
  });
  const services = [{
    title: 'Planification Intelligente',
    description: 'Algorithmes avancés qui optimisent automatiquement votre emploi du temps en fonction de vos priorités et habitudes.',
    icon: '📅',
    delay: 0
  }, {
    title: 'Synchronisation Multi-Appareils',
    description: "Accédez à votre emploi du temps depuis n'importe quel appareil avec une synchronisation instantanée.",
    icon: '🔄',
    delay: 200
  }, {
    title: 'Rappels Personnalisés',
    description: "Configurez des rappels intelligents qui s'adaptent à votre routine quotidienne.",
    icon: '⏰',
    delay: 400
  }, {
    title: 'Analyses Détaillées',
    description: "Visualisez comment vous utilisez votre temps et identifiez les opportunités d'amélioration.",
    icon: '📊',
    delay: 600
  }, {
    title: "Collaboration d'Équipe",
    description: 'Partagez vos calendriers et coordonnez facilement les emplois du temps de votre équipe.',
    icon: '👥',
    delay: 800
  }, {
    title: 'Mode Hors-ligne',
    description: 'Continuez à gérer votre temps même sans connexion internet, avec synchronisation automatique.',
    icon: '🌐',
    delay: 1000
  }];
  return <section id="services" className="py-20 bg-gray-100" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Nos Services
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
            Découvrez comment notre plateforme peut transformer votre gestion du
            temps et booster votre productivité.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => <div key={index} className={`bg-white rounded-lg p-8 shadow-lg transition-all duration-700 transform hover:shadow-xl hover:-translate-y-2 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{
          transitionDelay: `${service.delay}ms`
        }}>
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600">{service.description}</p>
              <div className="w-16 h-1 bg-blue-600 mt-6"></div>
            </div>)}
        </div>
        <div className="mt-16 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            Essayer Gratuitement
          </button>
        </div>
      </div>
    </section>;
};
export default ServicesSection;