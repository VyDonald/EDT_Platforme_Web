import React, { useState } from 'react';
import CrudTable from '../shared/CrudTable';
import Modal from '../shared/Modal';
const initialDelegates = [{
  id: 1,
  nom: 'Garcia',
  prenom: 'Lucas',
  email: 'lucas.garcia@example.com',
  classe: 'L3 Informatique'
}, {
  id: 2,
  nom: 'Bernard',
  prenom: 'Emma',
  email: 'emma.bernard@example.com',
  classe: 'M1 Droit'
}, {
  id: 3,
  nom: 'Thomas',
  prenom: 'Léo',
  email: 'leo.thomas@example.com',
  classe: 'L2 Économie'
}];
const Delegates = () => {
  const [delegates, setDelegates] = useState(initialDelegates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDelegate, setCurrentDelegate] = useState<any>(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    classe: ''
  });
  const columns = [{
    header: 'Nom',
    accessor: 'nom'
  }, {
    header: 'Prénom',
    accessor: 'prenom'
  }, {
    header: 'Email',
    accessor: 'email'
  }, {
    header: 'Classe',
    accessor: 'classe'
  }];
  const handleAdd = () => {
    setCurrentDelegate(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      classe: ''
    });
    setIsModalOpen(true);
  };
  const handleEdit = (delegate: any) => {
    setCurrentDelegate(delegate);
    setFormData({
      nom: delegate.nom,
      prenom: delegate.prenom,
      email: delegate.email,
      classe: delegate.classe
    });
    setIsModalOpen(true);
  };
  const handleDelete = (delegate: any) => {
    setDelegates(delegates.filter(d => d.id !== delegate.id));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentDelegate) {
      // Edit existing delegate
      setDelegates(delegates.map(d => d.id === currentDelegate.id ? {
        ...d,
        ...formData
      } : d));
    } else {
      // Add new delegate
      const newDelegate = {
        id: Date.now(),
        ...formData
      };
      setDelegates([...delegates, newDelegate]);
    }
    setIsModalOpen(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  return <div>
      <h1 className="text-2xl font-bold mb-4">Gestion des Délégués</h1>
      <CrudTable title="Délégués" columns={columns} data={delegates} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentDelegate ? 'Modifier un délégué' : 'Ajouter un délégué'}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classe
            </label>
            <input type="text" name="classe" value={formData.classe} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600">
              {currentDelegate ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>
    </div>;
};
export default Delegates;