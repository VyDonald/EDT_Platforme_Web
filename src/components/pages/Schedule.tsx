import React, { useState, useRef, useEffect } from 'react';
import { CalendarIcon, DownloadIcon, PlusIcon, PencilIcon, TrashIcon, ListIcon, SearchIcon } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Composant Modal pour les formulaires et boîtes de dialogue
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Interface pour les créneaux horaires
interface TimeSlot {
  id: number;
  start: string;
  end: string;
}

// Interface pour les éléments de l'emploi du temps
interface ScheduleItem {
  id: number;
  day: string;
  timeSlot: string;
  course: string;
  teacher: string;
  room: string;
}

// Interface pour un emploi du temps complet
interface ScheduleManager {
  id: number;
  title: string;
  dateRange: [Date | null, Date | null]; // Changé pour stocker une plage de dates
  section: string;
  items: ScheduleItem[];
  createdAt: Date;
}

// Interface pour les données du formulaire
interface FormData {
  day: string;
  timeSlot: string;
  course: string;
  teacher: string;
  room: string;
}

// Interface pour les informations de l'emploi du temps
interface ScheduleInfo {
  title: string;
  dateRange: [Date | null, Date | null]; // Changé pour stocker une plage de dates
  section: string;
}

// Jours de la semaine en français
const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Créneaux horaires standard
const timeSlots: TimeSlot[] = [
  { id: 1, start: '07h30', end: '12h30' },
  { id: 2, start: '14h00', end: '18h00' }
];

// Sections disponibles
const sections = ['MIAGE', 'ABF', 'MID'];

// Listes déroulantes statiques pour enseignants, cours, et salles
const teachers = [
  { id: 'utilisateur_2', name: 'Marie Curie' },
  { id: 'utilisateur_3', name: 'Albert Einstein' },
  { id: 'utilisateur_4', name: 'Isaac Newton' },
];

const courses = [
  { id: 'cours_1', name: 'Algorithmique avancée' },
  { id: 'cours_2', name: 'Droit constitutionnel' },
  { id: 'cours_3', name: 'Statistiques' },
];

const rooms = [
  { id: 'salle_1', name: 'A101' },
  { id: 'salle_2', name: 'B205' },
  { id: 'salle_3', name: 'C303' },
  { id: 'salle_4', name: 'D104' },
];

const Schedule: React.FC = () => {
  // État pour suivre l'onglet actif
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  
  // État pour la liste des emplois du temps
  const [schedules, setSchedules] = useState<ScheduleManager[]>([]);
  
  // État pour l'emploi du temps en cours de création/édition
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleManager>({
    id: Date.now(),
    title: '',
    dateRange: [null, null],
    section: '',
    items: [],
    createdAt: new Date()
  });
  
  // États pour les modals
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  
  // État pour l'élément en cours d'édition
  const [currentItem, setCurrentItem] = useState<ScheduleItem | null>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);
  
  // État pour les données du formulaire
  const [formData, setFormData] = useState<FormData>({
    day: '',
    timeSlot: '',
    course: '',
    teacher: '',
    room: ''
  });
  
  // État pour les informations de l'emploi du temps
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfo>({
    title: '',
    dateRange: [null, null],
    section: ''
  });
  
  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sectionFilter, setSectionFilter] = useState<string>('');
  
  // Référence pour l'exportation PDF
  const scheduleRef = useRef<HTMLDivElement>(null);
  
  // Charger les emplois du temps depuis le localStorage au démarrage
  useEffect(() => {
    const savedSchedules = localStorage.getItem('schedules');
    if (savedSchedules) {
      try {
        const parsedSchedules = JSON.parse(savedSchedules);
        setSchedules(parsedSchedules.map((schedule: any) => ({
          ...schedule,
          createdAt: new Date(schedule.createdAt),
          dateRange: [
            schedule.dateRange[0] ? new Date(schedule.dateRange[0]) : null,
            schedule.dateRange[1] ? new Date(schedule.dateRange[1]) : null
          ]
        })));
      } catch (e) {
        console.error('Erreur lors du chargement des emplois du temps:', e);
      }
    }
  }, []);
  
  // Sauvegarder les emplois du temps dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('schedules', JSON.stringify(schedules));
  }, [schedules]);
  
  // Fonctions pour gérer les éléments de l'emploi du temps
  const handleAddItem = () => {
    setCurrentItem(null);
    setFormData({
      day: '',
      timeSlot: '',
      course: '',
      teacher: '',
      room: ''
    });
    setIsItemModalOpen(true);
  };
  
  const handleEditItem = (item: ScheduleItem) => {
    setCurrentItem(item);
    setFormData({
      day: item.day,
      timeSlot: item.timeSlot,
      course: item.course,
      teacher: item.teacher,
      room: item.room
    });
    setIsItemModalOpen(true);
  };
  
  const handleDeleteItem = (itemId: number) => {
    setCurrentSchedule({
      ...currentSchedule,
      items: currentSchedule.items.filter(item => item.id !== itemId)
    });
  };
  
  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentItem) {
      // Mise à jour d'un élément existant
      setCurrentSchedule({
        ...currentSchedule,
        items: currentSchedule.items.map(item => 
          item.id === currentItem.id 
            ? { ...item, ...formData } 
            : item
        )
      });
    } else {
      // Ajout d'un nouvel élément
      const newItem: ScheduleItem = {
        id: Date.now(),
        ...formData
      };
      setCurrentSchedule({
        ...currentSchedule,
        items: [...currentSchedule.items, newItem]
      });
    }
    
    setIsItemModalOpen(false);
  };
  
  // Fonctions pour gérer les emplois du temps
  const createNewSchedule = () => {
    setScheduleInfo({
      title: '',
      dateRange: [null, null],
      section: ''
    });
    setCurrentSchedule({
      id: Date.now(),
      title: '',
      dateRange: [null, null],
      section: '',
      items: [],
      createdAt: new Date()
    });
    setIsScheduleModalOpen(true);
  };
  
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mettre à jour l'emploi du temps en cours avec les nouvelles informations
    const updatedSchedule: ScheduleManager = {
      ...currentSchedule,
      title: scheduleInfo.title,
      dateRange: scheduleInfo.dateRange,
      section: scheduleInfo.section
    };
    
    setCurrentSchedule(updatedSchedule);
    setIsScheduleModalOpen(false);
    setActiveTab('create');
  };
  
  const saveSchedule = () => {
    // Vérifier si l'emploi du temps a un titre et une période
    if (!currentSchedule.title || !currentSchedule.dateRange[0] || !currentSchedule.dateRange[1]) {
      alert("Veuillez créer un emploi du temps en définissant un titre, une période et une section");
      setIsScheduleModalOpen(true);
      return;
    }
    
    // Vérifier si l'emploi du temps existe déjà (mise à jour ou création)
    const existingIndex = schedules.findIndex(s => s.id === currentSchedule.id);
    
    if (existingIndex >= 0) {
      // Mise à jour d'un emploi du temps existant
      const updatedSchedules = [...schedules];
      updatedSchedules[existingIndex] = currentSchedule;
      setSchedules(updatedSchedules);
    } else {
      // Ajout d'un nouvel emploi du temps
      setSchedules([...schedules, currentSchedule]);
    }
    
    // Réinitialiser l'emploi du temps en cours
    setCurrentSchedule({
      id: Date.now(),
      title: '',
      dateRange: [null, null],
      section: '',
      items: [],
      createdAt: new Date()
    });
    
    setScheduleInfo({
      title: '',
      dateRange: [null, null],
      section: ''
    });
    
    setActiveTab('list');
  };
  
  const loadSchedule = (schedule: ScheduleManager) => {
    setCurrentSchedule(schedule);
    setScheduleInfo({
      title: schedule.title,
      dateRange: schedule.dateRange,
      section: schedule.section
    });
    setActiveTab('create');
  };
  
  const confirmDeleteSchedule = (scheduleId: number) => {
    setScheduleToDelete(scheduleId);
    setIsDeleteModalOpen(true);
  };
  
  const deleteSchedule = () => {
    if (scheduleToDelete) {
      setSchedules(schedules.filter(schedule => schedule.id !== scheduleToDelete));
      setIsDeleteModalOpen(false);
      setScheduleToDelete(null);
    }
  };
  
  // Formatter la période pour l'affichage
  const formatDateRange = (range: [Date | null, Date | null]): string => {
    if (!range[0] || !range[1]) return '';
    return `Du ${range[0].toLocaleDateString('fr-FR')} au ${range[1].toLocaleDateString('fr-FR')}`;
  };
  
  // Filtrer les emplois du temps selon les critères de recherche
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearchTerm = 
      schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDateRange(schedule.dateRange).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSection = sectionFilter ? schedule.section === sectionFilter : true;
    
    return matchesSearchTerm && matchesSection;
  });
  
  // Obtenir un élément de l'emploi du temps pour un jour et un créneau horaire spécifique
  const getScheduleForSlot = (day: string, timeSlot: string): ScheduleItem | undefined => {
    return currentSchedule.items.find(item => 
      item.day === day && 
      (item.timeSlot === timeSlot || item.timeSlot.includes(timeSlot.split('-')[0]))
    );
  };
  
  // Gérer l'exportation PDF
  const exportPDF = async () => {
    if (scheduleRef.current) {
      // Ajouter l'en-tête de l'institution avant l'exportation
      const headerDiv = document.createElement('div');
      headerDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-weight: bold;">INSTITUT BURKINABE</div>
          <div style="font-weight: bold;">DES ARTS ET METIERS (IBAM)</div>
          <div>Tél.: 25-35-67-31/62</div>
        </div>
      `;
      scheduleRef.current.prepend(headerDiv);

      try {
        const canvas = await html2canvas(scheduleRef.current, {
          scale: 2,
          backgroundColor: null,
          logging: false
        });
        
        // Supprimer l'en-tête temporaire après la capture du canvas
        scheduleRef.current.removeChild(headerDiv);
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm'
        });
        
        const imgWidth = 280;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`Emploi_du_temps_${currentSchedule.title.replace(/\s/g, '_')}.pdf`);
      } catch (error) {
        console.error('Erreur lors de l\'exportation PDF:', error);
        alert('Erreur lors de l\'exportation du PDF');
      }
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 min-h-screen">
      {/* Onglets */}
      <div className="flex border-b">
        <button 
          onClick={() => setActiveTab('create')} 
          className={`px-4 py-2 font-medium ${activeTab === 'create' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500'}`}
        >
          <div className="flex items-center">
            <CalendarIcon size={18} className="mr-2" />
            Emploi du Temps
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('list')} 
          className={`px-4 py-2 font-medium ${activeTab === 'list' ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-gray-500'}`}
        >
          <div className="flex items-center">
            <ListIcon size={18} className="mr-2" />
            Liste des Emplois du Temps
          </div>
        </button>
      </div>
      
      {/* Contenu de l'onglet "Emploi du Temps" */}
      {activeTab === 'create' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button 
                onClick={createNewSchedule} 
                className="bg-emerald-500 text-white px-4 py-2 rounded flex items-center hover:bg-emerald-600"
              >
                <PlusIcon className="mr-2" size={16} />
                {currentSchedule.title ? 'Modifier les infos' : 'Créer un nouvel emploi du temps'}
              </button>
              
              <button 
                onClick={saveSchedule} 
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
              >
                <DownloadIcon className="mr-2" size={16} />
                Enregistrer l'emploi du temps
              </button>
            </div>
            <div className="space-x-2">
              <button 
                onClick={handleAddItem} 
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
                disabled={!currentSchedule.title}
              >
                <PlusIcon className="mr-2" size={16} />
                Ajouter une séance
              </button>
              <button 
                onClick={exportPDF} 
                className="bg-purple-500 text-white px-4 py-2 rounded flex items-center hover:bg-purple-600"
                disabled={!currentSchedule.title}
              >
                <DownloadIcon className="mr-2" size={16} />
                Exporter PDF
              </button>
            </div>
          </div>
          
          {!currentSchedule.title ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500 mb-4">Veuillez créer un nouvel emploi du temps ou en sélectionner un existant.</p>
              <button 
                onClick={createNewSchedule} 
                className="bg-emerald-500 text-white px-4 py-2 rounded inline-flex items-center hover:bg-emerald-600"
              >
                <PlusIcon className="mr-2" size={16} />
                Créer un emploi du temps
              </button>
            </div>
          ) : (
            <div ref={scheduleRef} className="bg-white p-6 rounded-lg shadow">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold uppercase">{currentSchedule.title}</h1>
                <p className="text-md mt-1">({formatDateRange(currentSchedule.dateRange)})</p>
                <p className="text-sm mt-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded inline-block">
                  Section: {currentSchedule.section}
                </p>
              </div>
              
              <div className="bg-white rounded-lg overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-gray-200 text-center"></th>
                      {daysOfWeek.map(day => (
                        <th key={day} className="border p-2 bg-gray-200 text-center min-w-[150px]">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map(slot => (
                      <tr key={slot.id}>
                        <td className="border p-2 font-medium bg-gray-100 text-center whitespace-nowrap">
                          {slot.start} - {slot.end}
                        </td>
                        {daysOfWeek.map(day => {
                          const timeSlotStr = `${slot.start}-${slot.end}`;
                          const scheduleItem = getScheduleForSlot(day, timeSlotStr);
                          return (
                            <td key={`${day}-${slot.id}`} className="border p-2 h-20 relative">
                              {scheduleItem ? (
                                <div className="bg-gray-100 p-2 rounded h-full relative group">
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => handleEditItem(scheduleItem)} 
                                      className="p-1 text-blue-600 hover:bg-blue-100 rounded mr-1"
                                    >
                                      <PencilIcon size={16} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteItem(scheduleItem.id)} 
                                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                                    >
                                      <TrashIcon size={16} />
                                    </button>
                                  </div>
                                  <div className="font-medium text-center">
                                    {scheduleItem.course}
                                  </div>
                                  <div className="text-sm text-gray-600 text-center">
                                    {scheduleItem.teacher}
                                  </div>
                                  <div className="text-xs text-gray-500 text-center">
                                    ({scheduleItem.room})
                                  </div>
                                </div>
                              ) : (
                                <button 
                                  onClick={handleAddItem} 
                                  className="w-full h-full flex items-center justify-center text-gray-400 hover:bg-gray-50"
                                >
                                  <PlusIcon size={20} />
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Contenu de l'onglet "Liste des Emplois du Temps" */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Liste des Emplois du Temps</h2>
            <button 
              onClick={createNewSchedule} 
              className="bg-emerald-500 text-white px-4 py-2 rounded flex items-center hover:bg-emerald-600"
            >
              <PlusIcon className="mr-2" size={16} />
              Créer un nouvel emploi
            </button>
          </div>
          
          {/* Filtres de recherche */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Rechercher un emploi du temps..." 
                    className="w-full p-2 pl-8 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <SearchIcon size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <select 
                  value={sectionFilter} 
                  onChange={(e) => setSectionFilter(e.target.value)} 
                  className="w-full md:w-auto p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Toutes les sections</option>
                  {sections.map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {schedules.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500 mb-4">Aucun emploi du temps n'a été créé.</p>
              <button 
                onClick={createNewSchedule} 
                className="bg-emerald-500 text-white px-4 py-2 rounded inline-flex items-center hover:bg-emerald-600"
              >
                <PlusIcon className="mr-2" size={16} />
                Créer un emploi du temps
              </button>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">Aucun résultat ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSchedules.map(schedule => (
                <div key={schedule.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">{schedule.title}</h3>
                      {schedule.section && (
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded">
                          {schedule.section}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{formatDateRange(schedule.dateRange)}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Créé le {new Date(schedule.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <div className="text-sm">
                      <span className="mr-2 bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {schedule.items.length} séances
                      </span>
                    </div>
                    <div className="space-x-1">
                      <button 
                        onClick={() => loadSchedule(schedule)} 
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        title="Éditer"
                      >
                        <PencilIcon size={16} />
                      </button>
                      <button 
                        onClick={() => confirmDeleteSchedule(schedule.id)} 
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        title="Supprimer"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Modal pour ajouter/modifier une séance */}
      <Modal 
        isOpen={isItemModalOpen} 
        onClose={() => setIsItemModalOpen(false)} 
        title={currentItem ? 'Modifier une séance' : 'Ajouter une séance'}
      >
        <form onSubmit={handleItemSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jour
            </label>
            <select 
              value={formData.day} 
              onChange={(e) => setFormData({...formData, day: e.target.value})} 
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" 
              required
            >
              <option value="">Sélectionnez un jour</option>
              {daysOfWeek.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Créneau horaire
            </label>
            <select 
              value={formData.timeSlot} 
              onChange={(e) => setFormData({...formData, timeSlot: e.target.value})} 
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" 
              required
            >
              <option value="">Sélectionnez un créneau</option>
              {timeSlots.map(slot => (
                <option key={slot.id} value={`${slot.start}-${slot.end}`}>
                  {slot.start} - {slot.end}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cours
            </label>
            <select 
              value={formData.course} 
              onChange={(e) => setFormData({...formData, course: e.target.value})} 
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" 
              required
            >
              <option value="">Sélectionnez un cours</option>
              {courses.map(course => (
                <option key={course.id} value={course.name}>{course.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enseignant
            </label>
            <select 
              value={formData.teacher} 
              onChange={(e) => setFormData({...formData, teacher: e.target.value})} 
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" 
              required
            >
              <option value="">Sélectionnez un enseignant</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salle
            </label>
            <select 
              value={formData.room} 
              onChange={(e) => setFormData({...formData, room: e.target.value})} 
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" 
              required
            >
              <option value="">Sélectionnez une salle</option>
              {rooms.map(room => (
                <option key={room.id} value={room.name}>{room.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={() => setIsItemModalOpen(false)} 
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
              {currentItem ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>
      
      {/* Modal pour créer un nouvel emploi du temps */}
      <Modal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)} 
        title="Informations de l'emploi du temps"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre de l'emploi du temps
            </label>
            <input 
              type="text" 
              value={scheduleInfo.title} 
              onChange={(e) => setScheduleInfo({...scheduleInfo, title: e.target.value})} 
              placeholder="Ex: SECTION MIAGE 6ième SEMESTRE LICENCE 3"
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select 
              value={scheduleInfo.section} 
              onChange={(e) => setScheduleInfo({...scheduleInfo, section: e.target.value})} 
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500" 
              required
            >
              <option value="">Sélectionnez une section</option>
              {sections.map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Période
            </label>
            <div className="flex space-x-2">
              <DatePicker
                selected={scheduleInfo.dateRange[0]}
                onChange={(date: Date) => setScheduleInfo({
                  ...scheduleInfo,
                  dateRange: [date, scheduleInfo.dateRange[1]]
                })}
                selectsStart
                startDate={scheduleInfo.dateRange[0] || undefined}
                endDate={scheduleInfo.dateRange[1] || undefined}
                placeholderText="Date de début"
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                dateFormat="dd/MM/yyyy"
                required
              />
              <DatePicker
                selected={scheduleInfo.dateRange[1]}
                onChange={(date: Date) => setScheduleInfo({
                  ...scheduleInfo,
                  dateRange: [scheduleInfo.dateRange[0], date]
                })}
                selectsEnd
                startDate={scheduleInfo.dateRange[0] || undefined}
                endDate={scheduleInfo.dateRange[1] || undefined}
                minDate={scheduleInfo.dateRange[0] || undefined}
                placeholderText="Date de fin"
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                dateFormat="dd/MM/yyyy"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={() => setIsScheduleModalOpen(false)} 
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            >
              Confirmer
            </button>
          </div>
        </form>
      </Modal>
      
      {/* Modal de confirmation de suppression */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Confirmation de suppression"
      >
        <div className="space-y-4">
          <p>Êtes-vous sûr de vouloir supprimer cet emploi du temps ? Cette action est irréversible.</p>
          
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => setIsDeleteModalOpen(false)} 
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </button>
            <button 
              onClick={deleteSchedule} 
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Schedule;