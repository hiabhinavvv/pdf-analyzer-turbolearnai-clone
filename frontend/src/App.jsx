import React, { useState } from 'react';
import { 
  Upload, 
  Home, 
  Settings, 
  FileText, 
  Plus,
  Menu,
  X,
  Brain,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    setUploadedFiles(prev => [...prev, ...newFiles.map(file => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      uploadedAt: new Date().toLocaleString()
    }))]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    sidebar: {
      backgroundColor: '#ffffff',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      width: sidebarOpen ? '256px' : '64px',
      transition: 'width 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    },
    sidebarHeader: {
      padding: '16px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    logo: {
      width: '32px',
      height: '32px',
      backgroundColor: '#2563eb',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoText: {
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
    },
    logoSubtext: {
      fontSize: '12px',
      color: '#6b7280',
      margin: 0
    },
    navigation: {
      flex: 1,
      padding: '16px'
    },
    navButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 12px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      marginBottom: '8px',
      transition: 'all 0.2s ease',
      fontSize: '14px'
    },
    navButtonActive: {
      backgroundColor: '#eff6ff',
      color: '#1d4ed8',
      border: '1px solid #bfdbfe'
    },
    navButtonInactive: {
      color: '#374151',
      backgroundColor: 'transparent'
    },
    sidebarToggle: {
      padding: '16px',
      borderTop: '1px solid #e5e7eb'
    },
    toggleButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      color: '#6b7280',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    },
    mainContent: {
      flex: 1,
      padding: '32px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px'
    },
    headerTitle: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
    },
    headerSubtitle: {
      color: '#6b7280',
      marginTop: '8px',
      margin: 0
    },
    badge: {
      backgroundColor: '#eff6ff',
      padding: '8px 16px',
      borderRadius: '8px',
      color: '#1d4ed8',
      fontWeight: '500'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6',
      marginBottom: '32px'
    },
    cardHeader: {
      padding: '24px',
      borderBottom: '1px solid #f3f4f6'
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    uploadArea: {
      border: isDragging ? '2px dashed #60a5fa' : '2px dashed #d1d5db',
      borderRadius: '8px',
      padding: '32px',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      backgroundColor: isDragging ? '#eff6ff' : 'transparent',
      cursor: 'pointer'
    },
    uploadIcon: {
      width: '64px',
      height: '64px',
      backgroundColor: '#dbeafe',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px'
    },
    uploadText: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#111827',
      margin: '0 0 8px 0'
    },
    uploadSubtext: {
      color: '#6b7280',
      margin: '0 0 16px 0'
    },
    uploadButton: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      padding: '8px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s ease'
    },
    fileList: {
      padding: '24px'
    },
    fileItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      marginBottom: '12px',
      transition: 'background-color 0.2s ease'
    },
    fileInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    fileIcon: {
      width: '32px',
      height: '32px',
      backgroundColor: '#fef2f2',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    fileName: {
      fontWeight: '500',
      color: '#111827',
      margin: 0
    },
    fileDetails: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginTop: '32px'
    },
    statCard: {
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #f3f4f6'
    },
    statContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    statIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    statNumber: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#111827',
      margin: 0
    },
    statLabel: {
      color: '#6b7280',
      margin: 0
    },
    settingsGrid: {
      display: 'grid',
      gap: '24px',
      marginTop: '32px'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s ease'
    },
    toggleSwitch: {
      position: 'relative',
      display: 'inline-block',
      width: '44px',
      height: '24px'
    },
    toggleInput: {
      opacity: 0,
      width: 0,
      height: 0
    },
    slider: {
      position: 'absolute',
      cursor: 'pointer',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#d1d5db',
      borderRadius: '24px',
      transition: 'background-color 0.2s ease'
    },
    settingItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    },
    settingInfo: {
      flex: 1
    },
    settingTitle: {
      fontWeight: '500',
      color: '#111827',
      margin: 0
    },
    settingDescription: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    saveButton: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      padding: '8px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s ease',
      float: 'right',
      marginTop: '24px'
    }
  };

  const renderDashboard = () => (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>Welcome!</h1>
          <p style={styles.headerSubtitle}>Upload your PDFs and start learning with AI assistance</p>
        </div>
        <div style={styles.badge}>
          <span>{uploadedFiles.length} Documents</span>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>
            <Upload size={20} color="#2563eb" />
            Upload PDF Documents
          </h2>
        </div>
        <div style={styles.fileList}>
          <div
            style={styles.uploadArea}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div style={styles.uploadIcon}>
              <Plus size={32} color="#2563eb" />
            </div>
            <p style={styles.uploadText}>Drop your PDF files here</p>
            <p style={styles.uploadSubtext}>or click to browse</p>
            <input
              type="file"
              multiple
              accept=".pdf"
              style={{ display: 'none' }}
              id="file-upload"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <label htmlFor="file-upload">
              <button 
                style={styles.uploadButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                Browse Files
              </button>
            </label>
          </div>
        </div>
      </div>

      {uploadedFiles.length > 0 && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <FileText size={20} color="#2563eb" />
              Recent Documents
            </h3>
          </div>
          <div style={styles.fileList}>
            {uploadedFiles.slice(-5).map((file, index) => (
              <div 
                key={index} 
                style={styles.fileItem}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f9fafb'}
              >
                <div style={styles.fileInfo}>
                  <div style={styles.fileIcon}>
                    <FileText size={16} color="#dc2626" />
                  </div>
                  <div>
                    <p style={styles.fileName}>{file.name}</p>
                    <p style={styles.fileDetails}>{file.size} • {file.uploadedAt}</p>
                  </div>
                </div>
                <ChevronRight size={20} color="#9ca3af" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div style={{...styles.statIcon, backgroundColor: '#dbeafe'}}>
              <FileText size={20} color="#2563eb" />
            </div>
            <div>
              <p style={styles.statNumber}>{uploadedFiles.length}</p>
              <p style={styles.statLabel}>Documents</p>
            </div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div style={{...styles.statIcon, backgroundColor: '#dcfce7'}}>
              <Brain size={20} color="#16a34a" />
            </div>
            <div>
              <p style={styles.statNumber}>0</p>
              <p style={styles.statLabel}>AI Sessions</p>
            </div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div style={{...styles.statIcon, backgroundColor: '#f3e8ff'}}>
              <Settings size={20} color="#9333ea" />
            </div>
            <div>
              <p style={styles.statNumber}>100%</p>
              <p style={styles.statLabel}>Ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div>
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>Settings</h1>
          <p style={styles.headerSubtitle}>Manage your account and preferences</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <Brain size={20} color="#ffffff" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 style={styles.logoText}>ExamPrep</h1>
              <p style={styles.logoSubtext}>AI Learning Assistant</p>
            </div>
          )}
        </div>

        <nav style={styles.navigation}>
          <button
  onClick={() => setActiveTab('dashboard')}
  style={{
    ...styles.navButton,
    ...(activeTab === 'dashboard' ? styles.navButtonActive : styles.navButtonInactive)
  }}
  onMouseEnter={(e) => {
    if (activeTab !== 'dashboard') {
      e.target.style.backgroundColor = '#f3f4f6';
    }
  }}
  onMouseLeave={(e) => {
    if (activeTab !== 'dashboard') {
      e.target.style.backgroundColor = 'transparent';
    }
  }}
>
  <div style={{
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginLeft: sidebarOpen ? '0px' : '-13px'
  }}>
    <Home size={25} color="#2563eb" />
  </div>
  {sidebarOpen && <span>Dashboard</span>}
</button>

          
          <button
  onClick={() => setActiveTab('settings')}
  style={{
    ...styles.navButton,
    ...(activeTab === 'settings' ? styles.navButtonActive : styles.navButtonInactive)
  }}
>
  <div style={{
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginLeft: sidebarOpen ? '0px' : '-13px'
  }}>
    <Settings size={25} color="#2563eb" />
  </div>
  {sidebarOpen && <span>Settings</span>}
</button>

        </nav>

        <div style={styles.sidebarToggle}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={styles.toggleButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div style={styles.mainContent}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
};

export default Dashboard;