import ProtectedRoute from '@/app/components/ProtectedRoute';
import LogoutButton from '@/app/components/LogoutButton';
import FarmerNavigation from '@/app/components/FarmerNavigation';

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="farmer">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
            <LogoutButton />
          </div>
        </header>
        
        {/* Navigation */}
        <FarmerNavigation />
        
        {/* Main Content */}
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}