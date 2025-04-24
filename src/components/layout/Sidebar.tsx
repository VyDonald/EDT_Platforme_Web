import React, { useState } from 'react';
import { UserIcon, UsersIcon, BookOpenIcon, CalendarIcon, HomeIcon, MessageCircleIcon, XIcon, LayoutIcon, BuildingIcon, GraduationCapIcon } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Sidebar = ({
  currentPage,
  setCurrentPage
}: SidebarProps) => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([{
    role: 'assistant',
    content: "Bonjour, je suis votre assistant IA pour la gestion de l'emploi du temps. Comment puis-je vous aider?"
  }]);

  const menuItems = [{
    id: 'home',
    label: 'Tableau de bord',
    icon: <HomeIcon size={18} />
  }, {
    id: 'teachers',
    label: 'Enseignants',
    icon: <UserIcon size={18} />
  }, {
    id: 'delegates',
    label: 'Délégués',
    icon: <UsersIcon size={18} />
  }, {
    id: 'courses',
    label: 'Cours',
    icon: <BookOpenIcon size={18} />
  }, {
    id: 'subjects',
    label: 'Matières',
    icon: <LayoutIcon size={18} />
  }, {
    id: 'rooms',
    label: 'Salles',
    icon: <BuildingIcon size={18} />
  }, {
    id: 'departments',
    label: 'Filières',
    icon: <GraduationCapIcon size={18} />
  }, {
    id: 'schedule',
    label: 'Emploi du temps',
    icon: <CalendarIcon size={18} />
  }];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newConversation = [...conversation, {
      role: 'user',
      content: message
    }, {
      role: 'assistant',
      content: "Je suis en train de traiter votre demande concernant la gestion de l'emploi du temps..."
    }];
    setConversation(newConversation);
    setMessage('');
  };

  return <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700 flex flex-col items-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-2">
          <UserIcon className="w-12 h-12 text-gray-800" />
        </div>
        <h2 className="text-emerald-400 text-lg">ADMIN</h2>
        <p className="text-xs text-gray-400">GESTIONNAIRE</p>
      </div>
      <nav className="mt-6 flex-1">
        <ul>
          {menuItems.map(item => <li key={item.id}>
              <button onClick={() => setCurrentPage(item.id)} className={`flex items-center w-full px-6 py-3 text-left ${currentPage === item.id ? 'bg-gray-700 border-l-4 border-emerald-400' : ''}`}>
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
                {currentPage === item.id && <span className="ml-auto">◀</span>}
              </button>
            </li>)}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button onClick={() => setIsAIOpen(!isAIOpen)} className="flex items-center w-full px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600">
          <MessageCircleIcon size={18} className="mr-2" />
          Assistant IA
        </button>
        {isAIOpen && <div className="mt-4 bg-gray-700 rounded-lg">
            <div className="p-3 border-b border-gray-600 flex justify-between items-center">
              <h3 className="text-sm font-medium">Assistant IA</h3>
              <button onClick={() => setIsAIOpen(false)}>
                <XIcon size={16} />
              </button>
            </div>
            <div className="h-48 overflow-y-auto p-3">
              {conversation.map((msg, index) => <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                    {msg.content}
                  </div>
                </div>)}
            </div>
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-600">
              <div className="flex">
                <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Posez votre question..." className="flex-1 px-2 py-1 text-sm bg-gray-600 rounded-l focus:outline-none" />
                <button type="submit" className="px-3 py-1 bg-emerald-500 text-white rounded-r hover:bg-emerald-600">
                  →
                </button>
              </div>
            </form>
          </div>}
      </div>
    </div>;
};

export default Sidebar;