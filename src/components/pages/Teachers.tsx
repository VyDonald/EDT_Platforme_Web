import React, { useState } from 'react';
import CrudTable from '../shared/CrudTable';
import Modal from '../shared/Modal';
const initialTeachers = [{
  id: 1,
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean.dupont@example.com',
  matiere: 'Mathématiques'
}, {
  id: 2,
  nom: 'Martin',
  prenom: 'Sophie',
  email: 'sophie.martin@example.com',
  matiere: 'Physique'
}, {
  id: 3,
  nom: 'Leroy',
  prenom: 'Michel',
  email: 'michel.leroy@example.com',
  matiere: 'Informatique'
}];
const Teachers = () => {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<any>(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    matiere: ''
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
    header: 'Matière',
    accessor: 'matiere'
  }];
  const handleAdd = () => {
    setCurrentTeacher(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      matiere: ''
    });
    setIsModalOpen(true);
  };
  const handleEdit = (teacher: any) => {
    setCurrentTeacher(teacher);
    setFormData({
      nom: teacher.nom,
      prenom: teacher.prenom,
      email: teacher.email,
      matiere: teacher.matiere
    });
    setIsModalOpen(true);
  };
  const handleDelete = (teacher: any) => {
    setTeachers(teachers.filter(t => t.id !== teacher.id));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTeacher) {
      // Edit existing teacher
      setTeachers(teachers.map(t => t.id === currentTeacher.id ? {
        ...t,
        ...formData
      } : t));
    } else {
      // Add new teacher
      const newTeacher = {
        id: Date.now(),
        ...formData
      };
      setTeachers([...teachers, newTeacher]);
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
      <h1 className="text-2xl font-bold mb-4">Gestion des Enseignants</h1>
      <CrudTable title="Enseignants" columns={columns} data={teachers} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentTeacher ? 'Modifier un enseignant' : 'Ajouter un enseignant'}>
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
              Matière
            </label>
            <input type="text" name="matiere" value={formData.matiere} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
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
    </div>;
};
export default Teachers;