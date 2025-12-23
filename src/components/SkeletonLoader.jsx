const SkeletonLoader = () => {
  // Create an array of 12 items to simulate a full page of movies
  const placeholders = Array(12).fill(0);

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-4 md:p-8">
      {/* Navbar Skeleton */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div className="h-8 w-32 bg-gray-800 rounded animate-pulse"></div>
        <div className="h-8 w-64 bg-gray-800 rounded-full animate-pulse hidden md:block"></div>
      </div>

      {/* Hero/Featured Skeleton */}
      <div className="w-full h-64 md:h-96 bg-gray-800 rounded-xl animate-pulse mb-10"></div>

      {/* Movie Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {placeholders.map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            {/* Poster */}
            <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
            {/* Title Bar */}
            <div className="h-4 w-3/4 bg-gray-800 rounded animate-pulse"></div>
            {/* Subtitle Bar */}
            <div className="h-3 w-1/2 bg-gray-900 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;