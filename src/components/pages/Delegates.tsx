import React, { useState, useEffect } from 'react';
import CrudTable from '../shared/CrudTable';
import Modal from '../shared/Modal';
import { getDelegues, createUtilisateur, updateUtilisateur, deleteUtilisateur, getFilieres } from '../../services/api';

// Interfaces
interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  classe: string;
  telephone: string;
  roleId?: string;
  filiereId: string; // Rendu requis
}

interface Filiere {
  id: string;
  nom: string;
}

const Delegates: React.FC = () => {
  const [delegates, setDelegates] = useState<Utilisateur[]>([]);
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentDelegate, setCurrentDelegate] = useState<Utilisateur | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    classe: 'L1', // Valeur par défaut
    filiereId: '', // Rendu requis
    telephone: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { header: 'Nom', accessor: 'nom' },
    { header: 'Prénom', accessor: 'prenom' },
    { header: 'Email', accessor: 'email' },
    { header: 'Classe', accessor: 'classe' },
    { header: 'Filière', accessor: 'filiereId', render: (row: Utilisateur) => filieres.find(f => f.id === row.filiereId)?.nom || 'N/A' },
  ];

  // Charger les délégués et filières au montage du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [deleguesData, filieresData] = await Promise.all([getDelegues(), getFilieres()]);
        setDelegates(deleguesData);
        setFilieres(filieresData);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données : ' + err.message);
        setLoading(false);
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleAdd = () => {
    setCurrentDelegate(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      classe: 'L1',
      filiereId: '',
      telephone: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (delegate: Utilisateur) => {
    setCurrentDelegate(delegate);
    setFormData({
      nom: delegate.nom,
      prenom: delegate.prenom,
      email: delegate.email,
      classe: delegate.classe,
      filiereId: delegate.filiereId,
      telephone: delegate.telephone,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (delegate: Utilisateur) => {
    try {
      await deleteUtilisateur(delegate.id);
      setDelegates(delegates.filter(d => d.id !== delegate.id));
    } catch (err) {
      setError('Erreur lors de la suppression du délégué');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.filiereId) {
      setError('La filière est requise.');
      return;
    }
    try {
      const dataToSend = {
        ...formData,
        roleId: 'delegue',
        password: currentDelegate ? undefined : 'defaultPassword123',
      };
      if (currentDelegate) {
        await updateUtilisateur(currentDelegate.id, dataToSend);
        setDelegates(delegates.map(d => d.id === currentDelegate.id ? { ...d, ...dataToSend } : d));
      } else {
        const response = await createUtilisateur(dataToSend);
        setDelegates([...delegates, { id: response.id, ...dataToSend }]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(currentDelegate ? 'Erreur lors de la mise à jour du délégué' : 'Erreur lors de la création du délégué');
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestion des Délégués</h1>
      <CrudTable title="Délégués" columns={columns} data={delegates} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentDelegate ? 'Modifier un délégué' : 'Ajouter un délégué'}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
            <select
              name="classe"
              value={formData.classe}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            >
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
            <select
              name="filiereId"
              value={formData.filiereId}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            >
              <option value="">Sélectionner une filière</option>
              {filieres.map((filiere) => (
                <option key={filiere.id} value={filiere.id}>
                  {filiere.nom}
                </option>
              ))}
            </select>
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
    </div>
  );
};

export default Delegates;