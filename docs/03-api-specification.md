# API Endpoints Specification

## 🌐 Overview
MoTask uses Supabase's auto-generated REST API based on the database schema. This document outlines the API endpoints, request/response formats, and usage patterns.

## 🔐 Authentication
All API requests require authentication via Supabase JWT tokens.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
apikey: <supabase_anon_key>
```

## 👤 Authentication Endpoints

### Sign Up
```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "data": {
    "full_name": "John Doe"
  }
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600
  }
}
```

### Sign In
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Sign Out
```http
POST /auth/v1/logout
Authorization: Bearer <jwt_token>
```

## 👥 Profile Endpoints

### Get Current User Profile
```http
GET /rest/v1/profiles?id=eq.<user_id>&select=*
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "avatar_url": "https://example.com/avatar.jpg",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Update Profile
```http
PATCH /rest/v1/profiles?id=eq.<user_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "full_name": "John Smith",
  "avatar_url": "https://example.com/new-avatar.jpg"
}
```

## 📋 Lists Endpoints

### Get All Lists
```http
GET /rest/v1/lists?select=*,tasks(count)&order=position.asc
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Personal Tasks",
    "description": "My personal todo items",
    "color": "#3B82F6",
    "position": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "tasks": [{"count": 5}]
  }
]
```

### Create List
```http
POST /rest/v1/lists
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Work Tasks",
  "description": "Tasks related to work projects",
  "color": "#EF4444",
  "position": 1
}
```

### Update List
```http
PATCH /rest/v1/lists?id=eq.<list_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated List Name",
  "description": "Updated description",
  "color": "#10B981"
}
```

### Delete List
```http
DELETE /rest/v1/lists?id=eq.<list_id>
Authorization: Bearer <jwt_token>
```

### Reorder Lists
```http
PATCH /rest/v1/lists?id=eq.<list_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "position": 2
}
```

## ✅ Tasks Endpoints

### Get Tasks for List
```http
GET /rest/v1/tasks?list_id=eq.<list_id>&select=*&order=position.asc,created_at.asc
Authorization: Bearer <jwt_token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "list_id": "uuid",
    "title": "Complete project documentation",
    "description": "Write comprehensive docs for the new feature",
    "completed": false,
    "priority": 1,
    "position": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

### Get All Tasks for User
```http
GET /rest/v1/tasks?select=*,lists(name,color)&order=created_at.desc
Authorization: Bearer <jwt_token>
```

### Create Task
```http
POST /rest/v1/tasks
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "list_id": "uuid",
  "title": "New task",
  "description": "Task description",
  "priority": 2,
  "position": 0
}
```

### Update Task
```http
PATCH /rest/v1/tasks?id=eq.<task_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true,
  "priority": 1
}
```

### Toggle Task Completion
```http
PATCH /rest/v1/tasks?id=eq.<task_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "completed": true
}
```

### Delete Task
```http
DELETE /rest/v1/tasks?id=eq.<task_id>
Authorization: Bearer <jwt_token>
```

### Reorder Tasks
```http
PATCH /rest/v1/tasks?id=eq.<task_id>
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "position": 3
}
```

## 🔍 Search and Filter Endpoints

### Search Tasks
```http
GET /rest/v1/tasks?select=*,lists(name,color)&title=ilike.*search_term*&order=created_at.desc
Authorization: Bearer <jwt_token>
```

### Filter by Priority
```http
GET /rest/v1/tasks?select=*&priority=eq.1&order=created_at.desc
Authorization: Bearer <jwt_token>
```

### Filter by Completion Status
```http
GET /rest/v1/tasks?select=*&completed=eq.false&order=position.asc
Authorization: Bearer <jwt_token>
```

### Combined Filters
```http
GET /rest/v1/tasks?select=*&list_id=eq.<list_id>&completed=eq.false&priority=eq.1
Authorization: Bearer <jwt_token>
```

## 📊 Analytics Endpoints

### Get Task Statistics
```http
GET /rest/v1/rpc/get_task_stats
Authorization: Bearer <jwt_token>
```

**Custom Function Response:**
```json
{
  "total_tasks": 25,
  "completed_tasks": 15,
  "pending_tasks": 10,
  "high_priority_tasks": 5,
  "completion_rate": 0.6
}
```

## 🔄 Real-time Subscriptions

### Subscribe to List Changes
```javascript
const subscription = supabase
  .channel('lists_changes')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'lists',
      filter: `user_id=eq.${userId}`
    }, 
    (payload) => {
      console.log('List changed:', payload)
    }
  )
  .subscribe()
```

### Subscribe to Task Changes
```javascript
const subscription = supabase
  .channel('tasks_changes')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'tasks',
      filter: `list_id=eq.${listId}`
    }, 
    (payload) => {
      console.log('Task changed:', payload)
    }
  )
  .subscribe()
```

## 🚨 Error Handling

### Common Error Responses

#### 401 Unauthorized
```json
{
  "code": 401,
  "message": "Invalid JWT token",
  "hint": "Check your authentication token"
}
```

#### 403 Forbidden
```json
{
  "code": 403,
  "message": "Insufficient permissions",
  "hint": "You don't have access to this resource"
}
```

#### 422 Validation Error
```json
{
  "code": 422,
  "message": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title cannot be empty"
    }
  ]
}
```

#### 500 Server Error
```json
{
  "code": 500,
  "message": "Internal server error",
  "hint": "Please try again later"
}
```

## 📝 Request/Response Patterns

### Pagination
```http
GET /rest/v1/tasks?select=*&limit=20&offset=40
Authorization: Bearer <jwt_token>
```

### Sorting
```http
GET /rest/v1/tasks?select=*&order=created_at.desc,title.asc
Authorization: Bearer <jwt_token>
```

### Field Selection
```http
GET /rest/v1/tasks?select=id,title,completed
Authorization: Bearer <jwt_token>
```

### Counting
```http
GET /rest/v1/tasks?select=*&count=exact
Authorization: Bearer <jwt_token>
```

## 🔧 Custom RPC Functions

### Get Task Statistics
```sql
CREATE OR REPLACE FUNCTION get_task_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_tasks', COUNT(*),
    'completed_tasks', COUNT(*) FILTER (WHERE completed = true),
    'pending_tasks', COUNT(*) FILTER (WHERE completed = false),
    'high_priority_tasks', COUNT(*) FILTER (WHERE priority = 1),
    'completion_rate', 
      CASE 
        WHEN COUNT(*) > 0 
        THEN ROUND(COUNT(*) FILTER (WHERE completed = true)::DECIMAL / COUNT(*), 2)
        ELSE 0 
      END
  ) INTO result
  FROM tasks t
  JOIN lists l ON t.list_id = l.id
  WHERE l.user_id = user_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Bulk Update Task Positions
```sql
CREATE OR REPLACE FUNCTION update_task_positions(
  task_updates JSON
)
RETURNS VOID AS $$
DECLARE
  task_update JSON;
BEGIN
  FOR task_update IN SELECT * FROM json_array_elements(task_updates)
  LOOP
    UPDATE tasks 
    SET position = (task_update->>'position')::INTEGER
    WHERE id = (task_update->>'id')::UUID;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔒 Security Considerations

### Rate Limiting
- Implement client-side rate limiting
- Use Supabase's built-in rate limiting
- Monitor for abuse patterns

### Input Validation
- Validate all input on client and server
- Sanitize user input to prevent XSS
- Use parameterized queries (handled by Supabase)

### Data Access
- All endpoints respect RLS policies
- Users can only access their own data
- Proper authentication required for all operations
