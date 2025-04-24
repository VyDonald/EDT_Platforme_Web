import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from 'lucide-react';

interface Department {
  id: number;
  nom: string;
}

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, nom: 'Informatique' },
    { id: 2, nom: 'Mathématiques' },
    { id: 3, nom: 'Économie' },
    { id: 4, nom: 'Communication' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
  });

  const handleOpenModal = (department: Department | null = null) => {
    if (department) {
      setFormData({
        nom: department.nom,
      });
      setCurrentDepartment(department);
    } else {
      setFormData({
        nom: '',
      });
      setCurrentDepartment(null);
    }
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
        ...formData,
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
    department.nom.toLowerCase().includes(searchTerm.toLowerCase())
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
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Nom</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDepartments.map((department) => (
              <tr key={department.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">{department.nom}</td>
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
                <label className="block text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
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