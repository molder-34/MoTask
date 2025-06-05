# UI Wireframes & Design Mockups

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-500: #3b82f6;
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-500: #6b7280;
--gray-700: #374151;
--gray-900: #111827;

/* Status Colors */
--success-500: #10b981;
--warning-500: #f59e0b;
--error-500: #ef4444;

/* Priority Colors */
--priority-high: #ef4444;
--priority-medium: #f59e0b;
--priority-low: #10b981;
```

### Typography
```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

### Spacing System
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
```

## 📱 Mobile-First Wireframes

### 1. Authentication Screens

#### Login Screen
```
┌─────────────────────────┐
│    [MoTask Logo]        │
│                         │
│  Welcome Back          │
│                         │
│  ┌─────────────────┐    │
│  │ Email           │    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ Password        │    │
│  └─────────────────┘    │
│                         │
│  [Forgot Password?]     │
│                         │
│  ┌─────────────────┐    │
│  │   Sign In       │    │
│  └─────────────────┘    │
│                         │
│  Don't have an account? │
│  [Sign Up]              │
└─────────────────────────┘
```

#### Sign Up Screen
```
┌─────────────────────────┐
│    [MoTask Logo]        │
│                         │
│  Create Account         │
│                         │
│  ┌─────────────────┐    │
│  │ Full Name       │    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ Email           │    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ Password        │    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ Confirm Password│    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │   Sign Up       │    │
│  └─────────────────┘    │
│                         │
│  Already have account?  │
│  [Sign In]              │
└─────────────────────────┘
```

### 2. Main Application Screens

#### Dashboard/Lists View
```
┌─────────────────────────┐
│ ☰  MoTask      [👤]     │
├─────────────────────────┤
│                         │
│ My Lists               │
│                         │
│ ┌─────────────────────┐ │
│ │ 📋 Personal    [⋮]  │ │
│ │ 5 tasks, 2 done     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 💼 Work        [⋮]  │ │
│ │ 8 tasks, 3 done     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ 🏠 Home        [⋮]  │ │
│ │ 3 tasks, 1 done     │ │
│ └─────────────────────┘ │
│                         │
│                         │
│ ┌─────────────────────┐ │
│ │      + New List     │ │
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ 📋 🔍 📊 ⚙️           │
└─────────────────────────┘
```

#### Task List View
```
┌─────────────────────────┐
│ ← Personal Tasks   [⋮]  │
├─────────────────────────┤
│ [🔍 Search tasks...]    │
│                         │
│ ┌─────────────────────┐ │
│ │ ☐ Buy groceries  🔴 │ │
│ │   Get milk and bread│ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ☑ Call dentist   🟡 │ │
│ │   Schedule checkup  │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ☐ Finish report  🔴 │ │
│ │   Due next week     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ☐ Read book      🟢 │ │
│ └─────────────────────┘ │
│                         │
│                         │
│ ┌─────────────────────┐ │
│ │     + Add Task      │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ 📋 🔍 📊 ⚙️           │
└─────────────────────────┘
```

#### Task Detail/Edit Modal
```
┌─────────────────────────┐
│ Edit Task          [✕]  │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │ Task Title          │ │
│ │ Buy groceries       │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Description         │ │
│ │ Get milk, bread,    │ │
│ │ and eggs from store │ │
│ └─────────────────────┘ │
│                         │
│ Priority:               │
│ ○ High  ●Medium  ○Low   │
│                         │
│ List:                   │
│ [Personal ▼]            │
│                         │
│ ┌─────────┐ ┌─────────┐ │
│ │ Cancel  │ │  Save   │ │
│ └─────────┘ └─────────┘ │
│                         │
│ [🗑️ Delete Task]        │
└─────────────────────────┘
```

### 3. Search & Filter Screen
```
┌─────────────────────────┐
│ ← Search            [✕] │
├─────────────────────────┤
│ [🔍 Search all tasks...] │
│                         │
│ Filters:                │
│ ┌─────────────────────┐ │
│ │ All Lists      [▼]  │ │
│ └─────────────────────┘ │
│                         │
│ Priority:               │
│ ☑High ☑Medium ☑Low      │
│                         │
│ Status:                 │
│ ☑Pending ☐Completed     │
│                         │
│ ┌─────────────────────┐ │
│ │   Apply Filters     │ │
│ └─────────────────────┘ │
│                         │
│ Results (12):           │
│                         │
│ ┌─────────────────────┐ │
│ │ ☐ Buy groceries  🔴 │ │
│ │   Personal          │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ ☐ Finish report  🔴 │ │
│ │   Work              │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

## 🖥️ Desktop Layout Adaptations

### Dashboard - Desktop View
```
┌─────────────────────────────────────────────────────────────┐
│ ☰ MoTask                                          [👤] [⚙️] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  My Lists                                    Quick Stats    │
│                                                             │
│  ┌─────────────────┐ ┌─────────────────┐   ┌─────────────┐ │
│  │ 📋 Personal     │ │ 💼 Work         │   │ 25 Total    │ │
│  │ 5 tasks, 2 done │ │ 8 tasks, 3 done │   │ 15 Done     │ │
│  │ [View Tasks]    │ │ [View Tasks]    │   │ 10 Pending  │ │
│  └─────────────────┘ └─────────────────┘   │ 60% Complete│ │
│                                             └─────────────┘ │
│  ┌─────────────────┐ ┌─────────────────┐                   │
│  │ 🏠 Home         │ │ + New List      │   Recent Tasks    │
│  │ 3 tasks, 1 done │ │                 │                   │
│  │ [View Tasks]    │ │                 │   ☐ Buy groceries │
│  └─────────────────┘ └─────────────────┘   ☐ Call dentist  │
│                                             ☑ Read emails   │
│                                             ☐ Finish report │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Task List - Desktop View
```
┌─────────────────────────────────────────────────────────────┐
│ ← Personal Tasks                              [⋮] [+ Task]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [🔍 Search tasks...]  [Filter ▼]  [Sort ▼]                 │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☐  Buy groceries                               🔴 High  │ │
│ │    Get milk, bread, and eggs from the store            │ │
│ │    Created 2 hours ago                            [⋮]  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☑  Call dentist                              🟡 Medium │ │
│ │    Schedule annual checkup appointment                  │ │
│ │    Completed 1 day ago                            [⋮]  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☐  Finish quarterly report                     🔴 High  │ │
│ │    Complete Q4 analysis and submit to manager          │ │
│ │    Created 3 days ago                             [⋮]  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ☐  Read new book                                🟢 Low  │ │
│ │    Start reading "Atomic Habits"                       │ │
│ │    Created 1 week ago                             [⋮]  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Component Specifications

### Task Card Component
```
States:
- Default (uncompleted)
- Completed (checked, strikethrough)
- Editing (inline edit mode)
- Dragging (for reordering)

Elements:
- Checkbox (toggle completion)
- Title (editable on click)
- Description (optional, expandable)
- Priority indicator (colored dot)
- Actions menu (edit, delete, move)
- Timestamp (created/updated)
```

### List Card Component
```
Elements:
- List icon/emoji
- List name
- Task count summary
- Progress indicator
- Color theme indicator
- Actions menu (edit, delete, reorder)
```

### Navigation Components
```
Mobile:
- Bottom tab bar (Lists, Search, Stats, Settings)
- Hamburger menu for secondary actions

Desktop:
- Top navigation bar
- Sidebar for lists (collapsible)
- Breadcrumb navigation
```

## 🔄 Interaction Patterns

### Task Management
- **Tap/Click**: Edit task inline
- **Long press/Right click**: Show context menu
- **Swipe left**: Quick delete (mobile)
- **Swipe right**: Quick complete (mobile)
- **Drag & drop**: Reorder tasks

### List Management
- **Tap/Click**: Open list
- **Long press/Right click**: Show context menu
- **Drag & drop**: Reorder lists
- **Pull to refresh**: Sync data

### Navigation
- **Swipe back**: Return to previous screen (mobile)
- **Keyboard shortcuts**: Quick actions (desktop)
- **Search**: Global search with filters

## 📐 Responsive Breakpoints

```css
/* Mobile First */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 768px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
  }
}

/* Large Desktop */
@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
  }
}
```

## ♿ Accessibility Considerations

### ARIA Labels
- Proper heading hierarchy (h1, h2, h3)
- ARIA labels for interactive elements
- Role attributes for custom components
- Live regions for dynamic content

### Keyboard Navigation
- Tab order follows logical flow
- Enter/Space for activation
- Arrow keys for list navigation
- Escape to close modals/menus

### Visual Accessibility
- High contrast color combinations
- Focus indicators on all interactive elements
- Text size respects user preferences
- Color is not the only indicator of state

### Screen Reader Support
- Descriptive alt text for images
- Form labels properly associated
- Status announcements for actions
- Logical reading order
