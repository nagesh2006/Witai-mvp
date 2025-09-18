import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

const DriveViewer: React.FC = () => {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [authUrl, setAuthUrl] = useState('');

  const initiateAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE}/drive-auth`);
      setAuthUrl(response.data.auth_url);
    } catch (err) {
      setError('Failed to initiate Google Drive authentication');
    }
    setLoading(false);
  };

  const fetchFiles = async () => {
    if (!accessToken.trim()) {
      setError('Please provide an access token');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE}/drive-files`, {
        params: { access_token: accessToken }
      });
      setFiles(response.data.files);
    } catch (err) {
      setError('Failed to fetch Google Drive files');
    }
    setLoading(false);
  };

  return (
    <div className="tool-container">
      <h2>Google Drive Integration</h2>
      
      <div className="input-group">
        <p>Connect to your Google Drive to access your documents:</p>
        
        {!authUrl ? (
          <button className="btn" onClick={initiateAuth} disabled={loading}>
            Connect to Google Drive
          </button>
        ) : (
          <div>
            <p>Click the link below to authorize access:</p>
            <a href={authUrl} target="_blank" rel="noopener noreferrer" className="btn">
              Authorize Google Drive Access
            </a>
            <p style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
              After authorization, copy the access token and paste it below:
            </p>
          </div>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="access-token">Access Token:</label>
        <input
          id="access-token"
          type="text"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          placeholder="Paste your access token here..."
        />
        <button 
          className="btn" 
          onClick={fetchFiles} 
          disabled={loading || !accessToken.trim()}
        >
          Fetch Files
        </button>
      </div>

      {loading && <div className="loading">Loading files...</div>}
      {error && <div className="error">{error}</div>}

      {files.length > 0 && (
        <div className="result-box">
          <h3>Your Google Drive Files</h3>
          <div className="file-list">
            {files.map((file) => (
              <div key={file.id} className="file-item">
                <div>
                  <strong>{file.name}</strong>
                  <br />
                  <small>Type: {file.mimeType}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveViewer;