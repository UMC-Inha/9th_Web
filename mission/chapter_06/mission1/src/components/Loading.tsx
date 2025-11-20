// src/components/Loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse p-4">
      <div className="h-6 w-40 bg-gray-300 rounded mb-3" />
      <div className="h-40 bg-gray-200 rounded" />
    </div>
  );
}
