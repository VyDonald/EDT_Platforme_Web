import React, { useState } from 'react';
import { MessageCircleIcon, XIcon } from 'lucide-react';
const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([{
    role: 'assistant',
    content: "Bonjour, je suis votre assistant IA pour la gestion de l'emploi du temps. Comment puis-je vous aider?"
  }]);
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
  return <>
      {!isOpen ? <button onClick={() => setIsOpen(true)} className="bg-emerald-500 text-white p-3 rounded-full shadow-lg hover:bg-emerald-600">
          <MessageCircleIcon size={24} />
        </button> : <div className="bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col">
          <div className="bg-emerald-500 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Assistant IA</h3>
            <button onClick={() => setIsOpen(false)}>
              <XIcon size={20} />
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            {conversation.map((msg, index) => <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-emerald-100 text-gray-800' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.content}
                </div>
              </div>)}
          </div>
          <form onSubmit={handleSendMessage} className="p-3 border-t">
            <div className="flex">
              <input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Posez votre question..." className="flex-1 border rounded-l p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              <button type="submit" className="bg-emerald-500 text-white px-3 py-2 rounded-r">
                Envoyer
              </button>
            </div>
          </form>
        </div>}
    </>;
};
export default AIAssistant;