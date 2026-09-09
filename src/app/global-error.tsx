'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#030014] text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-7xl font-black text-red-500 mb-4">Error</div>
          <h1 className="text-2xl font-bold mb-3">Critical Error</h1>
          <p className="text-gray-400 mb-8">
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </body>
    </html>
  );
}
