import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const TextProcessor: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAutocorrect = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE}/autocorrect`, { text });
      setResult({ type: 'autocorrect', data: response.data });
    } catch (err) {
      setError('Failed to autocorrect text');
    }
    setLoading(false);
  };

  const handleRewrite = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE}/rewrite`, { text });
      setResult({ type: 'rewrite', data: response.data });
    } catch (err) {
      setError('Failed to rewrite text');
    }
    setLoading(false);
  };

  const handlePredictNext = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE}/predict-next`, { text });
      setResult({ type: 'predict', data: response.data });
    } catch (err) {
      setError('Failed to predict next words');
    }
    setLoading(false);
  };

  return (
    <div className="tool-container">
      <h2>Text Processing Tools</h2>
      
      <div className="input-group">
        <label htmlFor="text-input">Enter your text:</label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
        />
      </div>

      <div>
        <button className="btn" onClick={handleAutocorrect} disabled={loading || !text.trim()}>
          Autocorrect
        </button>
        <button className="btn" onClick={handleRewrite} disabled={loading || !text.trim()}>
          Rewrite
        </button>
        <button className="btn" onClick={handlePredictNext} disabled={loading || !text.trim()}>
          Predict Next 100 Words
        </button>
      </div>

      {loading && <div className="loading">Processing...</div>}
      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result-box">
          <h3>
            {result.type === 'autocorrect' && 'Autocorrected Text'}
            {result.type === 'rewrite' && 'Rewritten Text'}
            {result.type === 'predict' && 'Predicted Continuation'}
          </h3>
          
          {result.type === 'autocorrect' && (
            <div>
              <p><strong>Original:</strong> {result.data.original}</p>
              <p><strong>Corrected:</strong> {result.data.corrected}</p>
            </div>
          )}
          
          {result.type === 'rewrite' && (
            <div>
              <p><strong>Original:</strong> {result.data.original}</p>
              <p><strong>Rewritten:</strong> {result.data.rewritten}</p>
            </div>
          )}
          
          {result.type === 'predict' && (
            <div>
              <p><strong>Your text:</strong> {result.data.original}</p>
              <p><strong>Predicted continuation:</strong> {result.data.prediction}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextProcessor;