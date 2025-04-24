import React, { useState, useRef, useEffect } from 'react';
// Vérifiez que vous avez bien installé lucide-react
// Si ce n'est pas le cas: npm install lucide-react
import { MessageCircle, Send, X } from 'lucide-react';

// Si vous utilisez TypeScript, ajoutez les types appropriés
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Bonjour, je suis votre assistant IA pour la gestion de l'emploi du temps. Comment puis-je vous aider aujourd'hui?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fonction pour simuler une réponse de l'IA
  const getAIResponse = async (userMessage: string): Promise<string> => {
    setIsLoading(true);
    
    // Simulation d'un délai de réponse de l'IA
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Vous pourriez remplacer cette logique par un appel API réel à un service d'IA
    let response: string;
    
    if (userMessage.toLowerCase().includes('cours')) {
      response = "Je peux vous aider à gérer les cours. Voulez-vous ajouter un nouveau cours, modifier un cours existant ou consulter l'emploi du temps?";
    } else if (userMessage.toLowerCase().includes('enseignant')) {
      response = "Je peux vous aider avec la gestion des enseignants. Souhaitez-vous ajouter un nouvel enseignant ou modifier les disponibilités d'un enseignant existant?";
    } else if (userMessage.toLowerCase().includes('emploi du temps')) {
      response = "L'emploi du temps est disponible dans la section correspondante. Souhaitez-vous des informations sur un jour particulier?";
    } else {
      response = "Je comprends votre demande concernant \"" + userMessage + "\". Comment puis-je vous aider davantage sur ce sujet?";
    }
    
    setIsLoading(false);
    return response;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Ajouter le message de l'utilisateur à la conversation
    const updatedConversation = [
      ...conversation,
      { role: 'user', content: message }
    ];
    setConversation(updatedConversation);
    setMessage('');
    
    // Obtenir et ajouter la réponse de l'IA
    const aiResponse = await getAIResponse(message);
    setConversation([
      ...updatedConversation,
      { role: 'assistant', content: aiResponse }
    ]);
  };

  // Défilement automatique vers le bas lorsque de nouveaux messages sont ajoutés
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Bouton pour ouvrir l'assistant */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
        >
          <MessageCircle size={24} />
        </button>
      )}
      
      {/* Fenêtre de l'assistant */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 flex flex-col border border-gray-200">
          {/* En-tête */}
          <div className="bg-emerald-500 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Assistant IA</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-600 rounded p-1">
              <X size={20} />
            </button>
          </div>
          
          {/* Zone de conversation */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-3">
            {conversation.map((msg, index) => (
              <div key={index} className={`${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Zone de saisie */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Posez votre question..."
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="bg-emerald-500 text-white px-4 rounded-r-lg hover:bg-emerald-600 disabled:bg-emerald-300"
              disabled={isLoading || !message.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;