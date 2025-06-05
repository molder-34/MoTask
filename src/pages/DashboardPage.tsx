import React from 'react';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';

const DashboardPage: React.FC = () => {
  const { user, profile, signOut } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">MoTask</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Welcome, {profile?.full_name || user?.email}
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-600">Welcome to your task management dashboard</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <CardTitle>🎉 Welcome to MoTask!</CardTitle>
                <CardDescription>
                  Your account is set up and ready to go
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    ✅ Authentication working
                  </p>
                  <p className="text-sm text-gray-600">
                    ✅ Database connected
                  </p>
                  <p className="text-sm text-gray-600">
                    ✅ User profile created
                  </p>
                  <p className="text-sm text-gray-500">
                    ⏳ Task management coming next
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your profile details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  {profile?.full_name && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Name:</span>
                      <p className="text-sm text-gray-600">{profile.full_name}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-700">Member since:</span>
                    <p className="text-sm text-gray-600">
                      {new Date(user?.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps Card */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>
                  What's coming next in development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    📋 Phase 2: Core Features
                  </p>
                  <p className="text-xs text-gray-500">
                    • List management
                  </p>
                  <p className="text-xs text-gray-500">
                    • Task CRUD operations
                  </p>
                  <p className="text-xs text-gray-500">
                    • Real-time updates
                  </p>
                  <p className="text-xs text-gray-500">
                    • Search and filtering
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Development Status */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Development Progress</CardTitle>
                <CardDescription>
                  Current implementation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">✅ Completed</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Project setup and configuration</li>
                      <li>• UI component library</li>
                      <li>• Supabase database schema</li>
                      <li>• Authentication system</li>
                      <li>• Row Level Security policies</li>
                      <li>• Protected routing</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">⏳ Coming Next</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• List management interface</li>
                      <li>• Task creation and editing</li>
                      <li>• Drag and drop functionality</li>
                      <li>• Real-time synchronization</li>
                      <li>• Search and filtering</li>
                      <li>• Mobile optimizations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
