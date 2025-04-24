import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from 'lucide-react';

interface Department {
  id: number;
  code: string;
  name: string;
  headTeacher: string;
  level: string;
  numberOfStudents: number;
}

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, code: 'INFO', name: 'Informatique', headTeacher: 'Prof. Martin', level: 'Licence', numberOfStudents: 120 },
    { id: 2, code: 'MATH', name: 'Mathématiques', headTeacher: 'Prof. Dubois', level: 'Licence', numberOfStudents: 85 },
    { id: 3, code: 'ECON', name: 'Économie', headTeacher: 'Prof. Lefebvre', level: 'Master', numberOfStudents: 65 },
    { id: 4, code: 'COMM', name: 'Communication', headTeacher: 'Prof. Bernard', level: 'Licence', numberOfStudents: 95 },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    headTeacher: '',
    level: '',
    numberOfStudents: 0
  });

  const handleOpenModal = (department: Department | null = null) => {
    if (department) {
      setFormData({
        code: department.code,
        name: department.name,
        headTeacher: department.headTeacher,
        level: department.level,
        numberOfStudents: department.numberOfStudents
      });
      setCurrentDepartment(department);
    } else {
      setFormData({
        code: '',
        name: '',
        headTeacher: '',
        level: '',
        numberOfStudents: 0
      });
      setCurrentDepartment(null);
    }
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'numberOfStudents' ? Number(value) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentDepartment) {
      // Update existing department
      setDepartments(departments.map(d => 
        d.id === currentDepartment.id ? { ...d, ...formData } : d
      ));
    } else {
      // Add new department
      const newDepartment: Department = {
        id: departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1,
        ...formData
      };
      setDepartments([...departments, newDepartment]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
      setDepartments(departments.filter(department => department.id !== id));
    }
  };

  const filteredDepartments = departments.filter(department => 
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.headTeacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Filières</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-emerald-600"
        >
          <PlusIcon size={16} className="mr-2" />
          Ajouter une filière
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher une filière..."
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
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Responsable</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Niveau</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Étudiants</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDepartments.map((department) => (
              <tr key={department.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">{department.code}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{department.name}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{department.headTeacher}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{department.level}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{department.numberOfStudents}</td>
                <td className="py-3 px-4 text-sm text-gray-900 flex">
                  <button 
                    onClick={() => handleOpenModal(department)} 
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    <PencilIcon size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(department.id)} 
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
              {currentDepartment ? 'Modifier la filière' : 'Ajouter une filière'}
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
                <label className="block text-gray-700 mb-2">Responsable</label>
                <input
                  type="text"
                  name="headTeacher"
                  value={formData.headTeacher}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Niveau</label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">Sélectionnez un niveau</option>
                  <option value="Licence">Licence</option>
                  <option value="Master">Master</option>
                  <option value="Doctorat">Doctorat</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Nombre d'étudiants</label>
                <input
                  type="number"
                  name="numberOfStudents"
                  value={formData.numberOfStudents}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                  min="0"
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
                  {currentDepartment ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;