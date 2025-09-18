export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    AUTOCORRECT: '/autocorrect',
    REWRITE: '/rewrite',
    CHATBOT: '/chatbot',
    PREDICT_NEXT: '/predict-next',
    DRIVE_AUTH: '/drive-auth',
    DRIVE_FILES: '/drive-files'
  }
};

export const RATE_LIMITS = {
  CHATBOT: 10, // requests per minute
  TEXT_PROCESSING: 20 // requests per minute
};