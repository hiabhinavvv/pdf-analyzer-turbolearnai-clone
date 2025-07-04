  import React, { useState, useEffect } from 'react';
  import { 
    Home, Settings, Upload, FileText, 
    MessageSquare, Plus, Menu, X,
    ChevronRight, Send, Loader2, ArrowLeft, Trash2
  } from 'lucide-react';
  import '../services/style.css';


  const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isChatLoading, setIsChatLoading] = useState(false);

const handleFileUpload = async (e) => {
  const newFiles = Array.from(e.target.files);
  if (newFiles.length === 0) return;

  setIsProcessing(true);

  const fileToUpload = newFiles[0];
  const formData = new FormData();
  formData.append("file", fileToUpload);

  try {
    const res = await fetch("http://localhost:8000/upload", {
  method: "POST",
  body: formData,
});

    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || "Upload failed");
    }

    setFiles((prev) => [
      ...prev,
      {
        name: fileToUpload.name,
        size: `${(fileToUpload.size / 1024 / 1024).toFixed(1)} MB`,
        date: new Date().toISOString().split("T")[0],
        id: Date.now().toString(),
      },
    ]);
  } catch (err) {
    console.error("Error uploading file:", err);
    alert(`Upload failed: ${err.message}`);
  } finally {
    setIsProcessing(false);
  }
};

    

    const handleSendMessage = async () => {
      if (inputMessage.trim() === '' || !selectedFile) return;
      
      const userMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      setIsChatLoading(true);
      
      try {
        // Send message to your backend RAG endpoint
const response = await fetch("http://localhost:8000/query", {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: inputMessage,
    filename: selectedFile.name
  })
});
        
        const data = await response.json();
        
        const aiMessage = {
          id: Date.now() + 1,
          text: data.answer, // Assuming your backend returns {answer: "..."}
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (err) {
        console.error("Error sending message:", err);
        const errorMessage = {
          id: Date.now() + 1,
          text: "Sorry, I couldn't process your request. Please try again.",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsChatLoading(false);
      }
    };

    const openFileChat = (file) => {
      setSelectedFile(file);
      setMessages([]); // Clear previous messages when opening a new file
    };

    const closeFileChat = () => {
      setSelectedFile(null);
    };

    const handleDeleteFile = async (fileId, filename) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      try {
        const response = await fetch(`http://localhost:8000/delete/${filename}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setFiles(files.filter(file => file.id !== fileId));
        } else {
          const errorData = await response.json();
          console.error('Error deleting file:', errorData);
          alert('Failed to delete file');
        }
      } catch (err) {
        console.error('Error deleting file:', err);
        alert('Error deleting file');
      }
    }
  };

    return (
      <div className={`app-container`}>
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="logo">
              <MessageSquare size={24} />
              {<span>StudyAI</span>}
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <Home size={20} />
              {sidebarOpen && <span>Dashboard</span>}
            </button>
            <button
              className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={20} />
              {sidebarOpen && <span>Settings</span>}
            </button>
          </nav>
        </aside>

        {/* Main Content */}

        
        <main className="main-content">
          {!selectedFile ? (
            activeTab === 'dashboard' ? (
              <>
                <header className="content-header">
                  <h1>Document Dashboard</h1>
                  <p>Manage and interact with your study materials</p>
                </header>

                <div className="upload-section">
                  <div className="upload-card">
                    <div className="upload-area">
                      <div className="upload-icon">
                        {isProcessing ? (
                          <Loader2 size={32} className="spinner" />
                        ) : (
                          <Plus size={32} />
                        )}
                      </div>
                      <h3>{isProcessing ? 'Processing...' : 'Upload Documents'}</h3>
                      <p>Click to browse PDF files</p>
                      <input
                        type="file"
                        id="file-upload"
                        accept=".pdf"
                        multiple
                        onChange={handleFileUpload}
                        disabled={isProcessing}
                      />
                      <label 
                        htmlFor="file-upload"
                        className={`upload-button ${isProcessing ? 'disabled' : ''}`}
                      >
                        {isProcessing ? 'Uploading...' : 'Select Files'}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="documents-section">
                  <h2>Your Documents</h2>
<div className="documents-grid">
  {files.map((file) => (
    <div key={file.id} className="document-card">
      <div className="document-icon">
        <FileText size={24} />
      </div>
      <div className="document-info">
        <h3>{file.name}</h3>
        <p>{file.size} • {file.date}</p>
      </div>
      <div className="document-actions">
        <button 
          className="document-action"
          onClick={() => openFileChat(file)}
        >
          <ChevronRight size={20} />
        </button>
        <button
          className="document-action delete-action"
          onClick={() => handleDeleteFile(file.id, file.name)}
          title="Delete file"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  ))}
</div>
                </div>
                
              </>
            ) : (
              <div className="settings-section">
                <h2>Settings</h2>
                <p>Configure your application preferences</p>
              </div>
            )

            
          ) : (
            <div className="file-chat-container">
              <div className="file-chat-header">
                <button onClick={closeFileChat} className="back-button">
                  <ArrowLeft size={20} />
                  Back
                </button>
                <h2>{selectedFile.name}</h2>
              </div>
              
              <div className="file-chat-messages">
                {messages.length === 0 ? (
                  <div className="empty-chat">
                    <p>Ask me anything about {selectedFile.name}</p>
                  </div>
                ) : (
                  messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`message ${message.sender}`}
                    >
                      <p>{message.text}</p>
                      <span className="timestamp">{message.timestamp}</span>
                    </div>
                  ))
                )}
                {isChatLoading && (
                  <div className="message ai">
                    <Loader2 size={20} className="spinner" />
                  </div>
                )}
              </div>
              
              <div className="file-chat-input">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Ask about ${selectedFile.name}...`}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={inputMessage.trim() === '' || isChatLoading}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  };

  export default Dashboard;