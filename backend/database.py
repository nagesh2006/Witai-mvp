from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# Database schema setup (run this once)
def setup_database():
    """
    Create tables in Supabase database.
    Run this function once to set up the database schema.
    
    SQL commands to run in Supabase SQL editor:
    
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- User sessions table
    CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- User preferences table
    CREATE TABLE IF NOT EXISTS user_preferences (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        custom_css TEXT,
        writing_goals TEXT,
        preferences JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Interaction logs table
    CREATE TABLE IF NOT EXISTS interaction_logs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        action_type VARCHAR(50) NOT NULL,
        input_text TEXT,
        output_text TEXT,
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
    CREATE INDEX IF NOT EXISTS idx_interaction_logs_user_id ON interaction_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_interaction_logs_action_type ON interaction_logs(action_type);
    """
    print("Database schema setup instructions printed above.")
    print("Please run these SQL commands in your Supabase SQL editor.")

# Helper functions for database operations
def create_user(email: str):
    """Create a new user"""
    try:
        result = supabase.table("users").insert({"email": email}).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        print(f"Error creating user: {e}")
        return None

def get_user_by_email(email: str):
    """Get user by email"""
    try:
        result = supabase.table("users").select("*").eq("email", email).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        print(f"Error getting user: {e}")
        return None

def save_user_preferences(user_id: str, custom_css: str = None, writing_goals: str = None, preferences: dict = None):
    """Save or update user preferences"""
    try:
        data = {"user_id": user_id}
        if custom_css is not None:
            data["custom_css"] = custom_css
        if writing_goals is not None:
            data["writing_goals"] = writing_goals
        if preferences is not None:
            data["preferences"] = preferences
        
        # Try to update first, if no rows affected, insert
        result = supabase.table("user_preferences").upsert(data).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        print(f"Error saving preferences: {e}")
        return None

def log_interaction(user_id: str, action_type: str, input_text: str = None, output_text: str = None, metadata: dict = None):
    """Log user interaction"""
    try:
        data = {
            "user_id": user_id,
            "action_type": action_type,
            "input_text": input_text,
            "output_text": output_text,
            "metadata": metadata or {}
        }
        result = supabase.table("interaction_logs").insert(data).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        print(f"Error logging interaction: {e}")
        return None

if __name__ == "__main__":
    setup_database()