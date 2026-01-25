export default function PostSkeleton() {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300" />
        <div className="flex-1">
          <div className="h-3 w-32 bg-gray-300 rounded mb-2" />
          <div className="h-2 w-20 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-[90%] bg-gray-200 rounded" />
        <div className="h-3 w-[70%] bg-gray-200 rounded" />
      </div>

      {/* Image placeholder */}
      <div className="mt-4 h-52 bg-gray-300 rounded-lg" />

      {/* Actions */}
      <div className="mt-4 flex justify-between">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
