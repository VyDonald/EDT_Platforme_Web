import React, { useState, useEffect } from 'react';
import CrudTable from '../shared/CrudTable';
import Modal from '../shared/Modal';
import { getEnseignants, createUtilisateur, updateUtilisateur, deleteUtilisateur } from '../../services/api';

// Interface
interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  roleId?: string;
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Utilisateur[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentTeacher, setCurrentTeacher] = useState<Utilisateur | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { header: 'Nom', accessor: 'nom' },
    { header: 'Prénom', accessor: 'prenom' },
    { header: 'Email', accessor: 'email' },
    { header: 'Téléphone', accessor: 'telephone' },
  ];

  // Charger les enseignants au montage du composant
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const enseignantsData = await getEnseignants();
        setTeachers(enseignantsData);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des enseignants : ' + (err.response?.data?.message || err.message));
        setLoading(false);
        console.error(err);
      }
    };
    fetchTeachers();
  }, []);

  const handleAdd = () => {
    setCurrentTeacher(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (teacher: Utilisateur) => {
    setCurrentTeacher(teacher);
    setFormData({
      nom: teacher.nom,
      prenom: teacher.prenom,
      email: teacher.email,
      telephone: teacher.telephone,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (teacher: Utilisateur) => {
    try {
      await deleteUtilisateur(teacher.id);
      setTeachers(teachers.filter(t => t.id !== teacher.id));
    } catch (err) {
      setError('Erreur lors de la suppression de l\'enseignant');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        roleId: 'enseignant',
        password: currentTeacher ? undefined : 'defaultPassword123',
      };
      if (currentTeacher) {
        await updateUtilisateur(currentTeacher.id, dataToSend);
        setTeachers(teachers.map(t => t.id === currentTeacher.id ? { ...t, ...dataToSend } : t));
      } else {
        const response = await createUtilisateur(dataToSend);
        setTeachers([...teachers, { id: response.id, ...dataToSend }]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(currentTeacher ? 'Erreur lors de la mise à jour de l\'enseignant' : 'Erreur lors de la création de l\'enseignant : ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <h1 className="text-2xl font-bold mb-4">Gestion des Enseignants</h1>
      <CrudTable title="Enseignants" columns={columns} data={teachers} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentTeacher ? 'Modifier un enseignant' : 'Ajouter un enseignant'}>
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
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600">
              {currentTeacher ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Teachers;