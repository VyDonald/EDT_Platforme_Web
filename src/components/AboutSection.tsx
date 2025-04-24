import React, { useEffect, useState } from 'react';
import { useInView } from './hooks/useInView';
const AboutSection = () => {
  const [ref, isVisible] = useInView({
    threshold: 0.1
  });
  const [animationStarted, setAnimationStarted] = useState(false);
  useEffect(() => {
    if (isVisible && !animationStarted) {
      setAnimationStarted(true);
    }
  }, [isVisible, animationStarted]);
  const features = [{
    title: 'Notre Histoire',
    description: 'Fondée en 2020, TimeManager est née de la conviction que la gestion efficace du temps est la clé du succès personnel et professionnel.',
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    delay: 0
  }, {
    title: 'Notre Mission',
    description: 'Nous vous aidons à optimiser votre emploi du temps pour atteindre vos objectifs et maintenir un équilibre sain entre vie professionnelle et personnelle.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
    delay: 200
  }, {
    title: 'Notre Équipe',
    description: 'Une équipe de professionnels passionnés par la productivité et dédiés à créer les meilleurs outils de gestion du temps pour nos utilisateurs.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    delay: 400
  }];
  return <section id="à-propos" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            À Propos de Nous
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
            Découvrez comment nous aidons des milliers d'utilisateurs à mieux
            gérer leur temps et à augmenter leur productivité.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => <div key={index} className={`bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-700 transform ${animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{
          transitionDelay: `${feature.delay}ms`
        }}>
              <div className="relative overflow-hidden group">
                <img src={feature.image} alt={feature.title} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white">
                      {feature.title}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
                <div className="mt-4">
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center transition-colors">
                    En savoir plus
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default AboutSection;