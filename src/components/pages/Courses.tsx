import React, { useState } from 'react';
import CrudTable from '../shared/CrudTable';
import Modal from '../shared/Modal';

// Liste des enseignants pour le menu déroulant
const enseignants = [
  { id: 'utilisateur_1', nom: 'Jean Dupont' },
  { id: 'utilisateur_2', nom: 'Marie Curie' },
  { id: 'utilisateur_3', nom: 'Pierre Martin' },
];

// Liste des statuts pour le menu déroulant
const statuts = [
  { id: 'en_attente', label: 'En attente' },
  { id: 'validé', label: 'Validé' },
  { id: 'annulé', label: 'Annulé' },
];

const initialCourses = [
  {
    id: 1,
    nom: 'Algorithmique avancée',
    capacite: 30,
    description: 'Cours sur les algorithmes avancés',
    enseignantId: 'utilisateur_2',
    statutId: 'en_attente',
  },
  {
    id: 2,
    nom: 'Droit constitutionnel',
    capacite: 25,
    description: 'Introduction au droit constitutionnel',
    enseignantId: 'utilisateur_2',
    statutId: 'validé',
  },
  {
    id: 3,
    nom: 'Statistiques',
    capacite: 40,
    description: 'Fondamentaux des statistiques',
    enseignantId: 'utilisateur_2',
    statutId: 'en_attente',
  },
];

const Courses = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    capacite: 0,
    description: '',
    enseignantId: '',
    statutId: '',
  });

  const columns = [
    {
      header: 'Nom',
      accessor: 'nom',
    },
    {
      header: 'Capacité',
      accessor: 'capacite',
    },
    {
      header: 'Description',
      accessor: 'description',
    },
    {
      header: 'Enseignant ID',
      accessor: 'enseignantId',
    },
    {
      header: 'Statut ID',
      accessor: 'statutId',
    },
  ];

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

  const handleEdit = (course) => {
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

  const handleDelete = (course) => {
    setCourses(courses.filter(c => c.id !== course.id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentCourse) {
      setCourses(courses.map(c => (c.id === currentCourse.id ? { ...c, ...formData } : c)));
    } else {
      const newCourse = {
        id: Date.now(),
        ...formData,
      };
      setCourses([...courses, newCourse]);
    }
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'capacite' ? parseInt(value) || 0 : value,
    });
  };

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
                  {enseignant.nom}
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
                  {statut.label}
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