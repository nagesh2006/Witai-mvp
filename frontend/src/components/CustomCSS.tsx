import React, { useState, useEffect } from 'react';

const CustomCSS: React.FC = () => {
  const [cssCode, setCssCode] = useState('');
  const [appliedCSS, setAppliedCSS] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load saved CSS from localStorage
    const savedCSS = localStorage.getItem('witai-custom-css');
    if (savedCSS) {
      setCssCode(savedCSS);
      setAppliedCSS(savedCSS);
    }
  }, []);

  useEffect(() => {
    // Apply CSS to the page
    const styleElement = document.getElementById('custom-css-style');
    if (styleElement) {
      styleElement.remove();
    }

    if (appliedCSS) {
      const newStyleElement = document.createElement('style');
      newStyleElement.id = 'custom-css-style';
      newStyleElement.textContent = appliedCSS;
      document.head.appendChild(newStyleElement);
    }
  }, [appliedCSS]);

  const validateAndApplyCSS = () => {
    setError('');
    
    // Basic CSS validation - check for dangerous content
    const dangerousPatterns = [
      /javascript:/i,
      /expression\s*\(/i,
      /behavior\s*:/i,
      /@import/i,
      /url\s*\(\s*["']?javascript:/i
    ];

    const hasDangerousContent = dangerousPatterns.some(pattern => 
      pattern.test(cssCode)
    );

    if (hasDangerousContent) {
      setError('CSS contains potentially dangerous content and cannot be applied.');
      return;
    }

    // Try to validate CSS syntax by creating a temporary style element
    try {
      const tempStyle = document.createElement('style');
      tempStyle.textContent = cssCode;
      document.head.appendChild(tempStyle);
      document.head.removeChild(tempStyle);
      
      setAppliedCSS(cssCode);
      localStorage.setItem('witai-custom-css', cssCode);
    } catch (err) {
      setError('Invalid CSS syntax. Please check your code.');
    }
  };

  const resetCSS = () => {
    setCssCode('');
    setAppliedCSS('');
    setError('');
    localStorage.removeItem('witai-custom-css');
  };

  const loadPreset = (preset: string) => {
    const presets = {
      dark: `
/* Dark Theme */
.App {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%) !important;
}

.tool-container {
  background: #34495e !important;
  color: #ecf0f1 !important;
}

.input-group textarea,
.input-group input {
  background: #2c3e50 !important;
  color: #ecf0f1 !important;
  border-color: #7f8c8d !important;
}

.result-box {
  background: #2c3e50 !important;
  color: #ecf0f1 !important;
  border-color: #7f8c8d !important;
}`,
      colorful: `
/* Colorful Theme */
.App {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7) !important;
  background-size: 400% 400% !important;
  animation: gradientShift 15s ease infinite !important;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.tool-container {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px) !important;
}`,
      minimal: `
/* Minimal Theme */
.App {
  background: #f8f9fa !important;
}

.App-header {
  background: #ffffff !important;
  color: #333 !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
}

.tool-container {
  background: #ffffff !important;
  border: 1px solid #e9ecef !important;
  box-shadow: none !important;
}

.btn {
  background: #007bff !important;
  border-radius: 3px !important;
}`
    };

    setCssCode(presets[preset as keyof typeof presets] || '');
  };

  return (
    <div className="tool-container">
      <h2>Custom CSS Editor</h2>
      <p>Customize the appearance of Witai with your own CSS. Your changes will be saved automatically.</p>
      
      <div className="input-group">
        <label htmlFor="css-editor">CSS Code:</label>
        <textarea
          id="css-editor"
          value={cssCode}
          onChange={(e) => setCssCode(e.target.value)}
          placeholder="Enter your custom CSS here..."
          style={{ 
            fontFamily: 'monospace', 
            fontSize: '14px',
            minHeight: '200px'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button className="btn" onClick={validateAndApplyCSS}>
          Apply CSS
        </button>
        <button className="btn" onClick={resetCSS}>
          Reset to Default
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Quick Presets:</h4>
        <button className="btn" onClick={() => loadPreset('dark')}>
          Dark Theme
        </button>
        <button className="btn" onClick={() => loadPreset('colorful')}>
          Colorful Theme
        </button>
        <button className="btn" onClick={() => loadPreset('minimal')}>
          Minimal Theme
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="result-box">
        <h4>CSS Safety Notes:</h4>
        <ul style={{ textAlign: 'left' }}>
          <li>JavaScript and external imports are blocked for security</li>
          <li>Your CSS is validated before being applied</li>
          <li>Changes are saved to your browser's local storage</li>
          <li>Use <code>!important</code> to override existing styles</li>
        </ul>
      </div>
    </div>
  );
};

export default CustomCSS;