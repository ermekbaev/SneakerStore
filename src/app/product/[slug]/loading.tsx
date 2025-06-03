// src/app/product/[slug]/loading.tsx
export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs skeleton */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Main product section skeleton */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Images skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Product info skeleton */}
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              </div>

              {/* Brand */}
              <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>

              {/* Title */}
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
              </div>

              {/* Color selection */}
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div className="flex gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded-lg w-28 animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Size selection */}
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-44 animate-pulse"></div>
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <div className="h-12 bg-gray-200 rounded-lg flex-1 animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-12 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-200 px-6">
            <div className="flex space-x-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded w-24 animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-xl mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}