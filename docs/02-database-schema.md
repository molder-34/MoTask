# Database Schema Design

## 🗄️ Overview
The MoTask application uses Supabase PostgreSQL as the backend database. The schema is designed to be simple, efficient, and scalable while maintaining data integrity and security.

## 📊 Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     profiles    │       │      lists      │       │      tasks      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (UUID) PK    │◄──────┤ id (UUID) PK    │◄──────┤ id (UUID) PK    │
│ email           │       │ user_id (UUID)  │       │ list_id (UUID)  │
│ full_name       │       │ name            │       │ title           │
│ avatar_url      │       │ description     │       │ description     │
│ created_at      │       │ color           │       │ completed       │
│ updated_at      │       │ position        │       │ priority        │
└─────────────────┘       │ created_at      │       │ position        │
                          │ updated_at      │       │ created_at      │
                          └─────────────────┘       │ updated_at      │
                                                    └─────────────────┘
```

## 🏗️ Table Definitions

### 1. profiles
Extends Supabase's built-in auth.users table with additional user information.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

**Fields:**
- `id`: Primary key, references auth.users(id)
- `email`: User's email address (synced from auth.users)
- `full_name`: User's display name
- `avatar_url`: URL to user's profile picture
- `created_at`: Account creation timestamp
- `updated_at`: Last profile update timestamp

### 2. lists
Represents task categories or lists that organize tasks.

```sql
CREATE TABLE lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL CHECK (length(name) > 0 AND length(name) <= 100),
  description TEXT CHECK (length(description) <= 500),
  color TEXT DEFAULT '#3B82F6' CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
  position INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

**Fields:**
- `id`: Primary key (UUID)
- `user_id`: Foreign key to profiles table
- `name`: List name (1-100 characters)
- `description`: Optional list description (max 500 characters)
- `color`: Hex color code for list theme
- `position`: Sort order for lists
- `created_at`: List creation timestamp
- `updated_at`: Last modification timestamp

### 3. tasks
Represents individual todo items within lists.

```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (length(title) > 0 AND length(title) <= 200),
  description TEXT CHECK (length(description) <= 1000),
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  priority INTEGER DEFAULT 2 CHECK (priority IN (1, 2, 3)) NOT NULL,
  position INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

**Fields:**
- `id`: Primary key (UUID)
- `list_id`: Foreign key to lists table
- `title`: Task title (1-200 characters)
- `description`: Optional task description (max 1000 characters)
- `completed`: Task completion status
- `priority`: Priority level (1=High, 2=Medium, 3=Low)
- `position`: Sort order within list
- `created_at`: Task creation timestamp
- `updated_at`: Last modification timestamp

## 🔍 Indexes

### Performance Indexes
```sql
-- Index for user's lists lookup
CREATE INDEX idx_lists_user_id ON lists(user_id);

-- Index for list's tasks lookup
CREATE INDEX idx_tasks_list_id ON tasks(list_id);

-- Composite index for user's tasks (via lists)
CREATE INDEX idx_tasks_user_list ON tasks(list_id) 
  INCLUDE (title, completed, priority, position);

-- Index for task ordering within lists
CREATE INDEX idx_tasks_list_position ON tasks(list_id, position);

-- Index for completed tasks filtering
CREATE INDEX idx_tasks_completed ON tasks(completed, list_id);

-- Index for priority filtering
CREATE INDEX idx_tasks_priority ON tasks(priority, list_id);
```

## 🔒 Row Level Security (RLS) Policies

### profiles table
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### lists table
```sql
-- Enable RLS
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;

-- Users can only access their own lists
CREATE POLICY "Users can view own lists" ON lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lists" ON lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lists" ON lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own lists" ON lists
  FOR DELETE USING (auth.uid() = user_id);
```

### tasks table
```sql
-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Users can only access tasks in their own lists
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (
    list_id IN (
      SELECT id FROM lists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert tasks in own lists" ON tasks
  FOR INSERT WITH CHECK (
    list_id IN (
      SELECT id FROM lists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks in own lists" ON tasks
  FOR UPDATE USING (
    list_id IN (
      SELECT id FROM lists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks in own lists" ON tasks
  FOR DELETE USING (
    list_id IN (
      SELECT id FROM lists WHERE user_id = auth.uid()
    )
  );
```

## 🔄 Database Functions

### Update timestamp trigger
```sql
-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lists_updated_at 
  BEFORE UPDATE ON lists 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
  BEFORE UPDATE ON tasks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Profile creation trigger
```sql
-- Function to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 📈 Data Migration Strategy

### Initial Setup
1. Create tables in order: profiles → lists → tasks
2. Set up RLS policies
3. Create indexes
4. Set up triggers and functions

### Future Migrations
- Use Supabase migration system
- Version control all schema changes
- Test migrations on staging environment
- Backup data before major changes

## 🔧 Query Patterns

### Common Queries
```sql
-- Get user's lists with task counts
SELECT 
  l.*,
  COUNT(t.id) as task_count,
  COUNT(CASE WHEN t.completed = true THEN 1 END) as completed_count
FROM lists l
LEFT JOIN tasks t ON l.id = t.list_id
WHERE l.user_id = $1
GROUP BY l.id
ORDER BY l.position;

-- Get tasks for a specific list
SELECT * FROM tasks 
WHERE list_id = $1 
ORDER BY position, created_at;

-- Search tasks by title
SELECT t.*, l.name as list_name
FROM tasks t
JOIN lists l ON t.list_id = l.id
WHERE l.user_id = $1 
  AND t.title ILIKE '%' || $2 || '%'
ORDER BY t.created_at DESC;
```

## 📊 Data Constraints

### Business Rules
- List names must be unique per user
- Task positions must be unique within a list
- Priority values are constrained to 1, 2, 3
- Color values must be valid hex codes
- Text fields have appropriate length limits

### Data Integrity
- Foreign key constraints ensure referential integrity
- Check constraints validate data formats
- NOT NULL constraints prevent incomplete records
- Unique constraints prevent duplicates where needed
