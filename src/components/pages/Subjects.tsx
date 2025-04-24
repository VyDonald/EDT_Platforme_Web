import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from 'lucide-react';

interface Subject {
  id: number;
  code: string;
  name: string;
  credits: number;
  hours: number;
  department: string;
}

const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, code: 'MATH101', name: 'Mathématiques fondamentales', credits: 4, hours: 40, department: 'Sciences' },
    { id: 2, code: 'PHYS102', name: 'Physique générale', credits: 3, hours: 30, department: 'Sciences' },
    { id: 3, code: 'INFO201', name: 'Introduction à la programmation', credits: 5, hours: 50, department: 'Informatique' },
    { id: 4, code: 'LANG305', name: 'Français avancé', credits: 2, hours: 20, department: 'Langues' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: 0,
    hours: 0,
    department: ''
  });

  const handleOpenModal = (subject: Subject | null = null) => {
    if (subject) {
      setFormData({
        code: subject.code,
        name: subject.name,
        credits: subject.credits,
        hours: subject.hours,
        department: subject.department
      });
      setCurrentSubject(subject);
    } else {
      setFormData({
        code: '',
        name: '',
        credits: 0,
        hours: 0,
        department: ''
      });
      setCurrentSubject(null);
    }
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'credits' || name === 'hours' ? Number(value) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSubject) {
      // Update existing subject
      setSubjects(subjects.map(s => 
        s.id === currentSubject.id ? { ...s, ...formData } : s
      ));
    } else {
      // Add new subject
      const newSubject: Subject = {
        id: subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1,
        ...formData
      };
      setSubjects([...subjects, newSubject]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette matière ?')) {
      setSubjects(subjects.filter(subject => subject.id !== id));
    }
  };

  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Matières</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-emerald-600"
        >
          <PlusIcon size={16} className="mr-2" />
          Ajouter une matière
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher une matière..."
          className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Code</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Nom</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Crédits</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Heures</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Filière</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSubjects.map((subject) => (
              <tr key={subject.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">{subject.code}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{subject.name}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{subject.credits}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{subject.hours}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{subject.department}</td>
                <td className="py-3 px-4 text-sm text-gray-900 flex">
                  <button 
                    onClick={() => handleOpenModal(subject)} 
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    <PencilIcon size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(subject.id)} 
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentSubject ? 'Modifier la matière' : 'Ajouter une matière'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Crédits</label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Heures</label>
                <input
                  type="number"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                  min="0"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Filière</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
                >
                  {currentSubject ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;