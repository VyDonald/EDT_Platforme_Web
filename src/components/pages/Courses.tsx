import React, { useState, useEffect } from 'react';
import CrudTable from '../shared/CrudTable';
import Modal from '../shared/Modal';
import {
  getCours,
  createCours,
  updateCours,
  deleteCours,
  getEnseignants,
  getStatuts,
} from '../../services/api';

// Types pour les données
interface Cours {
  id: string;
  nom: string;
  capacite: number;
  description: string;
  enseignantId: string;
  statutId: string;
}

interface Enseignant {
  id: string;
  nom: string;
  prenom: string;
}

interface Statut {
  id: string;
  nom: string;
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Cours[]>([]);
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [statuts, setStatuts] = useState<Statut[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentCourse, setCurrentCourse] = useState<Cours | null>(null);
  const [formData, setFormData] = useState<{
    nom: string;
    capacite: number;
    description: string;
    enseignantId: string;
    statutId: string;
  }>({
    nom: '',
    capacite: 0,
    description: '',
    enseignantId: '',
    statutId: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { header: 'Nom', accessor: 'nom' },
    { header: 'Capacité', accessor: 'capacite' },
    { header: 'Description', accessor: 'description' },
    { header: 'Enseignant ID', accessor: 'enseignantId' },
    { header: 'Statut ID', accessor: 'statutId' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursData, enseignantsData, statutsData] = await Promise.all([
          getCours(),
          getEnseignants(),
          getStatuts(),
        ]);
        setCourses(coursData);
        setEnseignants(enseignantsData);
        setStatuts(statutsData);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données');
        setLoading(false);
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleAdd = () => {
    setCurrentCourse(null);
    setFormData({
      nom: '',
      capacite: 0,
      description: '',
      enseignantId: '',
      statutId: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (course: Cours) => {
    setCurrentCourse(course);
    setFormData({
      nom: course.nom,
      capacite: course.capacite,
      description: course.description,
      enseignantId: course.enseignantId,
      statutId: course.statutId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (course: Cours) => {
    try {
      await deleteCours(course.id);
      setCourses(courses.filter(c => c.id !== course.id));
    } catch (err) {
      setError('Erreur lors de la suppression du cours');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (currentCourse) {
        await updateCours(currentCourse.id, formData);
        setCourses(courses.map(c => (c.id === currentCourse.id ? { ...c, ...formData } : c)));
      } else {
        const response = await createCours(formData);
        setCourses([...courses, { id: response.id, ...formData }]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(currentCourse ? 'Erreur lors de la mise à jour du cours' : 'Erreur lors de la création du cours');
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'capacite' ? parseInt(value) || 0 : value,
    });
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestion des Cours</h1>
      <CrudTable
        title="Cours"
        columns={columns}
        data={courses}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCourse ? 'Modifier un cours' : 'Ajouter un cours'}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du cours
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacité
            </label>
            <input
              type="number"
              name="capacite"
              value={formData.capacite}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enseignant
            </label>
            <select
              name="enseignantId"
              value={formData.enseignantId}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            >
              <option value="">Sélectionner un enseignant</option>
              {enseignants.map(enseignant => (
                <option key={enseignant.id} value={enseignant.id}>
                  {enseignant.nom} {enseignant.prenom}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              name="statutId"
              value={formData.statutId}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            >
              <option value="">Sélectionner un statut</option>
              {statuts.map(statut => (
                <option key={statut.id} value={statut.id}>
                  {statut.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
              {currentCourse ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Courses;