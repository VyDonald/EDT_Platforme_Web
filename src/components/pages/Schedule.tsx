import React, { useState, useRef, useEffect } from 'react';
import { CalendarIcon, DownloadIcon, PlusIcon, PencilIcon, TrashIcon, ListIcon, SearchIcon } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  getFilieres,
  getEnseignants,
  getCours,
  getSalles,
  getEmploisDuTemps,
  createEmploiDuTemps,
  updateEmploiDuTemps,
  deleteEmploiDuTemps,
  visualiserEmploiDuTemps,
  createSeance,
  updateSeance,
  deleteSeance,
} from '../../services/api';

// Composant Modal (inchangé)
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
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

// Interfaces adaptées aux données réelles
interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

interface ScheduleItem {
  id: string;
  emploiDuTempsId: string;
  coursId: string;
  enseignantId: string;
  creneauId: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  salleID: string;
}

interface ScheduleManager {
  id: string;
  title: string;
  dateRange: [Date | null, Date | null];
  filiereId: string;
  items: ScheduleItem[];
  createdAt: Date;
}

interface FormData {
  day: string;
  timeSlot: string;
  course: string;
  teacher: string;
  room: string;
}

interface ScheduleInfo {
  title: string;
  dateRange: [Date | null, Date | null];
  filiereId: string;
}

interface Cours {
  id: string;
  nom: string;
}

interface Enseignant {
  id: string;
  nom: string;
  prenom: string;
}

interface Salle {
  id: string;
  nom: string;
}

interface Filiere {
  id: string;
  nom: string;
}

// Jours de la semaine
const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Créneaux fixes
const fixedTimeSlots: TimeSlot[] = [
  { id: 'seance_1', start: '08h00', end: '12h00' },
  { id: 'seance_2', start: '14h00', end: '18h00' },
];

const Schedule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [schedules, setSchedules] = useState<ScheduleManager[]>([]);
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleManager>({
    id: '',
    title: '',
    dateRange: [null, null],
    filiereId: '',
    items: [],
    createdAt: new Date(),
  });
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<ScheduleItem | null>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    day: '',
    timeSlot: '',
    course: '',
    teacher: '',
    room: '',
  });
  const [scheduleInfo, setScheduleInfo] = useState<ScheduleInfo>({
    title: '',
    dateRange: [null, null],
    filiereId: '',
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filiereFilter, setFiliereFilter] = useState<string>('');
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [teachers, setTeachers] = useState<Enseignant[]>([]);
  const [courses, setCourses] = useState<Cours[]>([]);
  const [rooms, setRooms] = useState<Salle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);

  // Charger les données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Charger les filières
        const filieresData = await getFilieres();
        setFilieres(filieresData);

        // Charger les enseignants
        const enseignantsData = await getEnseignants();
        setTeachers(enseignantsData);

        // Charger les cours
        const coursData = await getCours();
        setCourses(coursData);

        // Charger les salles
        const sallesData = await getSalles();
        setRooms(sallesData);

        // Charger les emplois du temps
        const emploisData = await getEmploisDuTemps();
        const formattedSchedules = await Promise.all(
          emploisData.map(async (emploi) => {
            const visualisation = await visualiserEmploiDuTemps(emploi.id);
            return {
              id: emploi.id,
              title: `Emploi du temps ${filieresData.find(f => f.id === emploi.filiereId)?.nom || emploi.filiereId}`,
              dateRange: [new Date(emploi.dateDebut), new Date(emploi.dateFin)] as [Date, Date],
              filiereId: emploi.filiereId,
              items: visualisation.seances,
              createdAt: emploi.createdAt ? new Date(emploi.createdAt) : new Date(),
            };
          })
        );
        setSchedules(formattedSchedules);

        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des données : ' + (err.response?.data?.message || err.message));
        setLoading(false);
        console.error(err);
      }
    };
    fetchInitialData();
  }, []);

  // Fonctions pour gérer les éléments de l'emploi du temps
  const handleAddItem = (day: string, timeSlot: string) => {
    setCurrentItem(null);
    setFormData({
      day,
      timeSlot,
      course: '',
      teacher: '',
      room: '',
    });
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: ScheduleItem) => {
    setCurrentItem(item);
    setFormData({
      day: daysOfWeek[new Date(item.date).getDay() - 1] || '',
      timeSlot: `${item.heureDebut}-${item.heureFin}`,
      course: item.coursId,
      teacher: item.enseignantId,
      room: item.salleID,
    });
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteSeance(itemId);
      setCurrentSchedule({
        ...currentSchedule,
        items: currentSchedule.items.filter(item => item.id !== itemId),
      });
    } catch (err) {
      setError('Erreur lors de la suppression de la séance');
      console.error(err);
    }
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const [heureDebut, heureFin] = formData.timeSlot.split('-');
      const selectedCreneau = fixedTimeSlots.find(ts => `${ts.start}-${ts.end}` === formData.timeSlot);
      const selectedDayIndex = daysOfWeek.indexOf(formData.day);
      const baseDate = currentSchedule.dateRange[0] || new Date();
      const seanceDate = new Date(baseDate);
      seanceDate.setDate(baseDate.getDate() + selectedDayIndex);
  
      const seanceData: Omit<ScheduleItem, 'id'> = {
        emploiDuTempsId: currentSchedule.id,
        coursId: formData.course,
        enseignantId: formData.teacher,
        creneauId: selectedCreneau?.id || '',
        date: seanceDate.toISOString().split('T')[0],
        heureDebut,
        heureFin,
        salleID: formData.room,
      };
  
      console.log('Données envoyées pour la séance :', seanceData);
  
      if (currentItem) {
        await updateSeance(currentItem.id, seanceData);
        setCurrentSchedule({
          ...currentSchedule,
          items: currentSchedule.items.map(item =>
            item.id === currentItem.id ? { ...item, ...seanceData } : item
          ),
        });
      } else {
        const response = await createSeance(seanceData);
        setCurrentSchedule({
          ...currentSchedule,
          items: [...currentSchedule.items, { id: response.id, ...seanceData }],
        });
      }
  
      setIsItemModalOpen(false);
    } catch (err) {
      console.error('Erreur lors de la création de la séance :', err.response?.data || err.message);
      setError('Erreur lors de la gestion de la séance : ' + (err.response?.data?.message || err.message));
    }
  };

  // Fonctions pour gérer les emplois du temps
  const createNewSchedule = () => {
    setScheduleInfo({
      title: '',
      dateRange: [null, null],
      filiereId: '',
    });
    setCurrentSchedule({
      id: '',
      title: '',
      dateRange: [null, null],
      filiereId: '',
      items: [],
      createdAt: new Date(),
    });
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const emploiDuTempsData = {
        filiereId: scheduleInfo.filiereId,
        dateDebut: scheduleInfo.dateRange[0]?.toISOString().split('T')[0] || '',
        dateFin: scheduleInfo.dateRange[1]?.toISOString().split('T')[0] || '',
      };
  
      console.log('Données envoyées pour l\'emploi du temps :', emploiDuTempsData);
  
      if (currentSchedule.id) {
        await updateEmploiDuTemps(currentSchedule.id, emploiDuTempsData);
        setCurrentSchedule({
          ...currentSchedule,
          title: scheduleInfo.title,
          dateRange: scheduleInfo.dateRange,
          filiereId: scheduleInfo.filiereId,
        });
      } else {
        const response = await createEmploiDuTemps(emploiDuTempsData);
        console.log('Réponse de l\'API :', response);
        setCurrentSchedule({
          id: response.id,
          title: scheduleInfo.title,
          dateRange: scheduleInfo.dateRange,
          filiereId: scheduleInfo.filiereId,
          items: [],
          createdAt: new Date(),
        });
      }
  
      setIsScheduleModalOpen(false);
      setActiveTab('create');
    } catch (err) {
      console.error('Erreur lors de la création de l\'emploi du temps :', err.response?.data || err.message);
      setError('Erreur lors de la création/mise à jour de l\'emploi du temps : ' + (err.response?.data?.message || err.message));
    }
  };

  const saveSchedule = async () => {
    if (!currentSchedule.title || !currentSchedule.dateRange[0] || !currentSchedule.dateRange[1]) {
      alert('Veuillez définir un titre, une période et une filière');
      setIsScheduleModalOpen(true);
      return;
    }

    try {
      const existingIndex = schedules.findIndex(s => s.id === currentSchedule.id);
      if (existingIndex >= 0) {
        const updatedSchedules = [...schedules];
        updatedSchedules[existingIndex] = currentSchedule;
        setSchedules(updatedSchedules);
      } else {
        setSchedules([...schedules, currentSchedule]);
      }

      setCurrentSchedule({
        id: '',
        title: '',
        dateRange: [null, null],
        filiereId: '',
        items: [],
        createdAt: new Date(),
      });
      setScheduleInfo({
        title: '',
        dateRange: [null, null],
        filiereId: '',
      });
      setActiveTab('list');
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de l\'emploi du temps');
      console.error(err);
    }
  };

  const loadSchedule = async (schedule: ScheduleManager) => {
    try {
      const visualisation = await visualiserEmploiDuTemps(schedule.id);
      setCurrentSchedule({
        ...schedule,
        items: visualisation.seances,
      });
      setScheduleInfo({
        title: schedule.title,
        dateRange: schedule.dateRange,
        filiereId: schedule.filiereId,
      });
      setActiveTab('create');
    } catch (err) {
      setError('Erreur lors du chargement de l\'emploi du temps');
      console.error(err);
    }
  };

  const confirmDeleteSchedule = (scheduleId: string) => {
    setScheduleToDelete(scheduleId);
    setIsDeleteModalOpen(true);
  };

  const deleteSchedule = async () => {
    if (scheduleToDelete) {
      try {
        await deleteEmploiDuTemps(scheduleToDelete);
        setSchedules(schedules.filter(schedule => schedule.id !== scheduleToDelete));
        setIsDeleteModalOpen(false);
        setScheduleToDelete(null);
      } catch (err) {
        setError('Erreur lors de la suppression de l\'emploi du temps');
        console.error(err);
      }
    }
  };

  const formatDateRange = (range: [Date | null, Date | null]): string => {
    if (!range[0] || !range[1]) return '';
    return `Du ${range[0].toLocaleDateString('fr-FR')} au ${range[1].toLocaleDateString('fr-FR')}`;
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearchTerm =
      schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatDateRange(schedule.dateRange).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFiliere = filiereFilter ? schedule.filiereId === filiereFilter : true;

    return matchesSearchTerm && matchesFiliere;
  });

  const getScheduleForSlot = (day: string, timeSlot: string): ScheduleItem | undefined => {
    const [heureDebut, heureFin] = timeSlot.split('-');
    const dayIndex = daysOfWeek.indexOf(day);
    const baseDate = currentSchedule.dateRange[0];
    if (!baseDate) return undefined;
    const targetDate = new Date(baseDate);
    targetDate.setDate(baseDate.getDate() + dayIndex);
    const formattedDate = targetDate.toISOString().split('T')[0];

    return currentSchedule.items.find(item =>
      item.date === formattedDate &&
      item.heureDebut === heureDebut &&
      item.heureFin === heureFin
    );
  };

  const exportPDF = async () => {
    if (scheduleRef.current) {
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
          logging: false,
        });
        scheduleRef.current.removeChild(headerDiv);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
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

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-4 p-4 bg-gray-50 min-h-screen">
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
                onClick={() => handleAddItem(formData.day || daysOfWeek[0], formData.timeSlot || `${fixedTimeSlots[0].start}-${fixedTimeSlots[0].end}`)}
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
                  Filière: {filieres.find(f => f.id === currentSchedule.filiereId)?.nom || currentSchedule.filiereId}
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
                    {fixedTimeSlots.map(slot => (
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
                                    {courses.find(c => c.id === scheduleItem.coursId)?.nom || scheduleItem.coursId}
                                  </div>
                                  <div className="text-sm text-gray-600 text-center">
                                    {teachers.find(t => t.id === scheduleItem.enseignantId)?.nom || scheduleItem.enseignantId} {teachers.find(t => t.id === scheduleItem.enseignantId)?.prenom}
                                  </div>
                                  <div className="text-xs text-gray-500 text-center">
                                    ({rooms.find(r => r.id === scheduleItem.salleID)?.nom || scheduleItem.salleID})
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAddItem(day, timeSlotStr)}
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
                  value={filiereFilter}
                  onChange={(e) => setFiliereFilter(e.target.value)}
                  className="w-full md:w-auto p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="">Toutes les filières</option>
                  {filieres.map(filiere => (
                    <option key={filiere.id} value={filiere.id}>{filiere.nom}</option>
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
                      {schedule.filiereId && (
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded">
                          {filieres.find(f => f.id === schedule.filiereId)?.nom || schedule.filiereId}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{formatDateRange(schedule.dateRange)}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Créé le {schedule.createdAt.toLocaleDateString()}
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

      <Modal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        title={currentItem ? 'Modifier une séance' : 'Ajouter une séance'}
      >
        <form onSubmit={handleItemSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jour</label>
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Créneau horaire</label>
            <select
              value={formData.timeSlot}
              onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            >
              <option value="">Sélectionnez un créneau</option>
              {fixedTimeSlots.map(slot => (
                <option key={slot.id} value={`${slot.start}-${slot.end}`}>
                  {slot.start} - {slot.end}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cours</label>
            <select
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            >
              <option value="">Sélectionnez un cours</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enseignant</label>
            <select
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            >
              <option value="">Sélectionnez un enseignant</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>{teacher.nom} {teacher.prenom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
            <select
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            >
              <option value="">Sélectionnez une salle</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.nom}</option>
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

      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Informations de l'emploi du temps"
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'emploi du temps</label>
            <input
              type="text"
              value={scheduleInfo.title}
              onChange={(e) => setScheduleInfo({ ...scheduleInfo, title: e.target.value })}
              placeholder="Ex: SECTION MIAGE 6ième SEMESTRE LICENCE 3"
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
            <select
              value={scheduleInfo.filiereId}
              onChange={(e) => setScheduleInfo({ ...scheduleInfo, filiereId: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            >
              <option value="">Sélectionnez une filière</option>
              {filieres.map(filiere => (
                <option key={filiere.id} value={filiere.id}>{filiere.nom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <div className="flex space-x-2">
              <DatePicker
                selected={scheduleInfo.dateRange[0]}
                onChange={(date: Date) =>
                  setScheduleInfo({
                    ...scheduleInfo,
                    dateRange: [date, scheduleInfo.dateRange[1]],
                  })
                }
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
                onChange={(date: Date) =>
                  setScheduleInfo({
                    ...scheduleInfo,
                    dateRange: [scheduleInfo.dateRange[0], date],
                  })
                }
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