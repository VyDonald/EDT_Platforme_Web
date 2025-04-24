import React, { useState } from 'react';
import CrudTable from '../shared/CrudTable';
import Modal from '../shared/Modal';
const initialCourses = [{
  id: 1,
  nom: 'Algorithmique avancée',
  enseignant: 'Jean Dupont',
  duree: '2h',
  niveau: 'L3'
}, {
  id: 2,
  nom: 'Droit constitutionnel',
  enseignant: 'Sophie Martin',
  duree: '1h30',
  niveau: 'M1'
}, {
  id: 3,
  nom: 'Statistiques',
  enseignant: 'Michel Leroy',
  duree: '3h',
  niveau: 'L2'
}];
const Courses = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    nom: '',
    enseignant: '',
    duree: '',
    niveau: ''
  });
  const columns = [{
    header: 'Nom',
    accessor: 'nom'
  }, {
    header: 'Enseignant',
    accessor: 'enseignant'
  }, {
    header: 'Durée',
    accessor: 'duree'
  }, {
    header: 'Niveau',
    accessor: 'niveau'
  }];
  const handleAdd = () => {
    setCurrentCourse(null);
    setFormData({
      nom: '',
      enseignant: '',
      duree: '',
      niveau: ''
    });
    setIsModalOpen(true);
  };
  const handleEdit = (course: any) => {
    setCurrentCourse(course);
    setFormData({
      nom: course.nom,
      enseignant: course.enseignant,
      duree: course.duree,
      niveau: course.niveau
    });
    setIsModalOpen(true);
  };
  const handleDelete = (course: any) => {
    setCourses(courses.filter(c => c.id !== course.id));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCourse) {
      // Edit existing course
      setCourses(courses.map(c => c.id === currentCourse.id ? {
        ...c,
        ...formData
      } : c));
    } else {
      // Add new course
      const newCourse = {
        id: Date.now(),
        ...formData
      };
      setCourses([...courses, newCourse]);
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
      <h1 className="text-2xl font-bold mb-4">Gestion des Cours</h1>
      <CrudTable title="Cours" columns={columns} data={courses} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentCourse ? 'Modifier un cours' : 'Ajouter un cours'}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du cours
            </label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enseignant
            </label>
            <input type="text" name="enseignant" value={formData.enseignant} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durée
            </label>
            <input type="text" name="duree" value={formData.duree} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau
            </label>
            <input type="text" name="niveau" value={formData.niveau} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600">
              {currentCourse ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>
    </div>;
};
export default Courses;