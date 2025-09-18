# Witai MVP - Writing Platform

A minimal viable product for Witai, a comprehensive writing platform with AI-powered features.

## Features

- **Autocorrection**: Fix grammar and spelling errors using language-tool-python
- **Text Rewriting**: Paraphrase and improve text using T5 model
- **AI Chatbot**: Writing assistant powered by Google Gemini API
- **Google Drive Integration**: Access and view your Google Drive documents
- **Custom CSS**: Safely customize the application appearance
- **Text Prediction**: Generate next 100 words maintaining original tone

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **AI/ML**: Google Gemini API, Transformers, Language Tool

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- Supabase account
- Google Cloud Console account (for Gemini API and OAuth)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On macOS/Linux
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file from `.env.example`:
   ```bash
   copy .env.example .env  # On Windows
   # cp .env.example .env  # On macOS/Linux
   ```

5. Configure environment variables in `.env`:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase anon key
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `GOOGLE_CLIENT_ID`: Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

6. Set up the database:
   ```bash
   python database.py
   ```
   Follow the printed SQL commands to create tables in Supabase.

7. Run the backend server:
   ```bash
   python main.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## API Endpoints

- `POST /autocorrect` - Autocorrect text
- `POST /rewrite` - Rewrite/paraphrase text
- `POST /chatbot` - Chat with AI assistant
- `POST /predict-next` - Predict next 100 words
- `GET /drive-auth` - Initiate Google Drive authentication
- `GET /drive-files` - Fetch Google Drive files

## Configuration

### Google Cloud Setup

1. Create a project in Google Cloud Console
2. Enable the Gemini API and Google Drive API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs: `http://localhost:8000/auth/callback`

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL commands from `database.py` in the SQL editor
3. Get your project URL and anon key from the API settings

## Security Features

- CORS protection
- Input validation
- Safe CSS sanitization
- OAuth 2.0 for Google Drive access
- Environment variable protection

## Development

### Adding New Features

1. Backend: Add new endpoints in `main.py`
2. Frontend: Create new components in `src/components/`
3. Database: Update schema in `database.py`

### Testing

- Backend: Run `python -m pytest` (after adding tests)
- Frontend: Run `npm test`

## Deployment

### Backend Deployment

- Use platforms like Railway, Heroku, or AWS
- Set environment variables in the deployment platform
- Ensure all dependencies are installed

### Frontend Deployment

- Build the app: `npm run build`
- Deploy to Vercel, Netlify, or similar platforms
- Update CORS origins in backend for production URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please create an issue in the GitHub repository.