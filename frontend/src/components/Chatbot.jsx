import React, { useState, useRef, useEffect } from 'react';

const API_URL = 'http://localhost:3001';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'model', text: 'Hi there! I am the AutoSync AI Assistant 🤖. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Add user message to UI
    const updatedMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: messages, // Send previous context
          message: userMessage
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { sender: 'model', text: data.text }]);
      } else {
        setMessages(prev => [...prev, { sender: 'model', text: `❌ Error: ${data.error}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'model', text: '❌ Connection error. Is the server running?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
      {/* Floating Action Button */}
      <button 
        className="chatbot-fab" 
        onClick={toggleChat}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'active' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <span className="chatbot-avatar">🤖</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>AutoSync AI</h3>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Always online</span>
            </div>
          </div>
          <button className="chatbot-close" onClick={toggleChat}>✕</button>
        </div>

        <div className="chatbot-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
              <div className="chat-bubble">
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message ai-message">
              <div className="chat-bubble typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input-area" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder="Ask about our services..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" disabled={!inputValue.trim() || isLoading} className="chatbot-send-btn">
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
