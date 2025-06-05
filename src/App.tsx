import React, { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import Button from "./components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/Card";

function App() {
  const { isLoading, isAuthenticated, user, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MoTask...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">MoTask</h1>
            <p className="text-lg text-gray-600">
              Modern Todo List Application
            </p>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome to MoTask</CardTitle>
                <CardDescription>
                  Your modern task management solution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Built with React, TypeScript, Tailwind CSS, and Supabase.
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    ✅ Project setup complete
                  </p>
                  <p className="text-xs text-gray-500">
                    ✅ UI components ready
                  </p>
                  <p className="text-xs text-gray-500">
                    ✅ Authentication store configured
                  </p>
                  <p className="text-xs text-gray-500">
                    ⏳ Supabase integration pending
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Authentication Status */}
            <Card>
              <CardHeader>
                <CardTitle>Authentication Status</CardTitle>
                <CardDescription>
                  Current user session information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-600">
                      ✅ Authenticated
                    </p>
                    <p className="text-xs text-gray-600">User: {user?.email}</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => useAuthStore.getState().signOut()}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      🔒 Not authenticated
                    </p>
                    <p className="text-xs text-gray-500">
                      Authentication will be implemented in the next phase
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>Development roadmap progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">
                    📋 Phase 1: Foundation (In Progress)
                  </p>
                  <p className="text-xs text-gray-500">• Project setup ✅</p>
                  <p className="text-xs text-gray-500">
                    • Supabase configuration ⏳
                  </p>
                  <p className="text-xs text-gray-500">
                    • Authentication system ⏳
                  </p>
                  <p className="text-xs text-gray-500">
                    • Core UI components ✅
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Component Demo */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>UI Components Demo</CardTitle>
                <CardDescription>
                  Testing our custom UI components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="primary">Primary Button</Button>
                    <Button variant="secondary">Secondary Button</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="danger">Danger Button</Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>

                  <div className="max-w-md">
                    <Button loading className="w-full">
                      Loading Button
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
