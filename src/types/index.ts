// Database types based on our schema
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface List {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ListWithStats extends List {
  taskCount: number;
  completedCount: number;
  completionRate: number;
}

export interface Task {
  id: string;
  list_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  position: number;
  created_at: string;
  updated_at: string;
}

// Enums and constants
export enum Priority {
  HIGH = 1,
  MEDIUM = 2,
  LOW = 3,
}

export const PRIORITY_LABELS = {
  [Priority.HIGH]: "High",
  [Priority.MEDIUM]: "Medium",
  [Priority.LOW]: "Low",
} as const;

export const PRIORITY_COLORS = {
  [Priority.HIGH]: "text-red-600 bg-red-50",
  [Priority.MEDIUM]: "text-yellow-600 bg-yellow-50",
  [Priority.LOW]: "text-green-600 bg-green-50",
} as const;

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  error: Error | null;
}

// Form types
export interface CreateListForm {
  name: string;
  description?: string;
  color?: string;
}

export interface CreateTaskForm {
  title: string;
  description?: string;
  priority?: Priority;
  list_id: string;
}

export interface UpdateTaskForm {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  position?: number;
}

// UI state types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FilterState {
  search: string;
  priority: Priority | null;
  completed: boolean | null;
  list_id: string | null;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  profile?: Profile;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Event types
export interface TaskEvent {
  type: "created" | "updated" | "deleted" | "completed" | "moved";
  task: Task;
  timestamp: string;
}

export interface ListEvent {
  type: "created" | "updated" | "deleted" | "moved";
  list: List;
  timestamp: string;
}
