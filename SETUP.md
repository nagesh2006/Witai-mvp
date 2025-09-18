# Quick Setup Guide

## 1. Environment Setup

### Backend (.env file)
Create `backend/.env` with:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback
```

## 2. Install Dependencies

### Backend
```bash
cd backend
pip install -r requirements.txt
```

### Frontend
```bash
cd frontend
npm install
```

## 3. Database Setup

Run these SQL commands in Supabase SQL editor:

```sql
-- Users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences
CREATE TABLE user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    custom_css TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interaction logs
CREATE TABLE interaction_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    input_text TEXT,
    output_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Run the Application

### Option 1: Use start script (Windows)
```bash
start.bat
```

### Option 2: Manual start
Terminal 1 (Backend):
```bash
cd backend
python run.py
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

## 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## API Keys Setup

### Google Gemini API
1. Go to Google AI Studio
2. Create API key
3. Add to GEMINI_API_KEY in .env

### Google OAuth (for Drive)
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add redirect URI: http://localhost:8000/auth/callback
4. Add client ID and secret to .env

### Supabase
1. Create project at supabase.com
2. Get URL and anon key from API settings
3. Add to .env file