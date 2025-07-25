import { Suspense } from 'react';
import { ArtistManagementWrapper } from '@/components/admin/artist-management-wrapper';

function ArtistManagementLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading artist management...</p>
      </div>
    </div>
  );
}

export default function ArtistManagementPage() {
  return (
    <Suspense fallback={<ArtistManagementLoading />}>
      <ArtistManagementWrapper />
    </Suspense>
  );
} 