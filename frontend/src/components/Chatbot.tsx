import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Witai, your writing assistant. I can help you with writing techniques, grammar, style, and creative writing. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/chatbot`, {
        message: inputMessage
      });

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="tool-container">
      <h2>Witai Writing Assistant</h2>
      
      <div className="chat-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div>{message.text}</div>
            <small>{message.timestamp.toLocaleTimeString()}</small>
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <div className="loading">Witai is thinking...</div>
          </div>
        )}
      </div>

      <div className="input-group">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about writing techniques, grammar, style, or get creative writing help..."
          rows={3}
        />
      </div>

      <button 
        className="btn" 
        onClick={sendMessage} 
        disabled={loading || !inputMessage.trim()}
      >
        Send Message
      </button>
    </div>
  );
};

export default Chatbot;