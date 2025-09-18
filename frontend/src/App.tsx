import React, { useState } from 'react';
import './App.css';
import TextProcessor from './components/TextProcessor';
import Chatbot from './components/Chatbot';
import DriveViewer from './components/DriveViewer';
import CustomCSS from './components/CustomCSS';

function App() {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Witai - Writing Assistant</h1>
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'text' ? 'active' : ''} 
            onClick={() => setActiveTab('text')}
          >
            Text Tools
          </button>
          <button 
            className={activeTab === 'chat' ? 'active' : ''} 
            onClick={() => setActiveTab('chat')}
          >
            Chatbot
          </button>
          <button 
            className={activeTab === 'drive' ? 'active' : ''} 
            onClick={() => setActiveTab('drive')}
          >
            Google Drive
          </button>
          <button 
            className={activeTab === 'css' ? 'active' : ''} 
            onClick={() => setActiveTab('css')}
          >
            Custom CSS
          </button>
        </nav>
      </header>

      <main className="App-main">
        {activeTab === 'text' && <TextProcessor />}
        {activeTab === 'chat' && <Chatbot />}
        {activeTab === 'drive' && <DriveViewer />}
        {activeTab === 'css' && <CustomCSS />}
      </main>
    </div>
  );
}

export default App;