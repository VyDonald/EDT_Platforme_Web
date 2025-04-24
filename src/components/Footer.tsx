import React from 'react';
const Footer = () => {
  return <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">TimeManager</h3>
            <p className="text-gray-400 mb-4">
              Simplifiez votre vie avec notre plateforme de gestion d'emploi du
              temps intuitive et puissante.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map(social => <a key={social} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5" />
                  </a>)}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              {['Accueil', 'À Propos', 'Services', 'Blog', 'Contact'].map(item => <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                      {item}
                    </a>
                  </li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {['Planification', 'Analyse', 'Collaboration', 'Mobile', 'Entreprise', 'API'].map(item => <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                    {item}
                  </a>
                </li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <address className="not-italic text-gray-400">
              <p className="mb-2">123 Rue de l'Innovation</p>
              <p className="mb-2">75000 Paris, France</p>
              <p className="mb-2">Email: contact@timemanager.com</p>
              <p>Tél: +33 1 23 45 67 89</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TimeManager. Tous droits réservés.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              {['Confidentialité', 'Conditions', 'Cookies'].map(item => <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">
                    {item}
                  </a>
                </li>)}
            </ul>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;