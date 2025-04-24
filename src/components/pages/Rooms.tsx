import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, SearchIcon } from 'lucide-react';

interface Room {
  id: number;
  name: string;
  capacity: number;
  building: string;
  floor: number;
  isComputerLab: boolean;
  hasProjector: boolean;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: 'A101', capacity: 30, building: 'Bâtiment A', floor: 1, isComputerLab: false, hasProjector: true },
    { id: 2, name: 'B205', capacity: 45, building: 'Bâtiment B', floor: 2, isComputerLab: true, hasProjector: true },
    { id: 3, name: 'C303', capacity: 60, building: 'Bâtiment C', floor: 3, isComputerLab: false, hasProjector: true },
    { id: 4, name: 'D104', capacity: 20, building: 'Bâtiment D', floor: 1, isComputerLab: true, hasProjector: false },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    capacity: 0,
    building: '',
    floor: 0,
    isComputerLab: false,
    hasProjector: false
  });

  const handleOpenModal = (room: Room | null = null) => {
    if (room) {
      setFormData({
        name: room.name,
        capacity: room.capacity,
        building: room.building,
        floor: room.floor,
        isComputerLab: room.isComputerLab,
        hasProjector: room.hasProjector
      });
      setCurrentRoom(room);
    } else {
      setFormData({
        name: '',
        capacity: 0,
        building: '',
        floor: 0,
        isComputerLab: false,
        hasProjector: false
      });
      setCurrentRoom(null);
    }
    setIsModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRoom) {
      // Update existing room
      setRooms(rooms.map(r => 
        r.id === currentRoom.id ? { ...r, ...formData } : r
      ));
    } else {
      // Add new room
      const newRoom: Room = {
        id: rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1,
        ...formData
      };
      setRooms([...rooms, newRoom]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      setRooms(rooms.filter(room => room.id !== id));
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Salles</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-emerald-600"
        >
          <PlusIcon size={16} className="mr-2" />
          Ajouter une salle
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher une salle..."
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
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Capacité</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Bâtiment</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Étage</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Salle Info</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Projecteur</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">{room.name}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{room.capacity}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{room.building}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{room.floor}</td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {room.isComputerLab ? 'Oui' : 'Non'}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {room.hasProjector ? 'Oui' : 'Non'}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 flex">
                  <button 
                    onClick={() => handleOpenModal(room)} 
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    <PencilIcon size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(room.id)} 
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
              {currentRoom ? 'Modifier la salle' : 'Ajouter une salle'}
            </h2>
            <form onSubmit={handleSubmit}>
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
                <label className="block text-gray-700 mb-2">Capacité</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Bâtiment</label>
                <input
                  type="text"
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Étage</label>
                <input
                  type="number"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  name="isComputerLab"
                  checked={formData.isComputerLab}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-500 mr-2"
                />
                <label className="text-gray-700">Salle informatique</label>
              </div>
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  name="hasProjector"
                  checked={formData.hasProjector}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-500 mr-2"
                />
                <label className="text-gray-700">Équipée d'un projecteur</label>
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
                  {currentRoom ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;