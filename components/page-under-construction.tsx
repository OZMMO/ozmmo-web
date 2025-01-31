

interface PageUnderConstructionProps {  
  title: string;
  description: string;
}
export default function PageUnderConstruction({ title, description }: PageUnderConstructionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-2xl w-full">
        <div className="relative">
          {/* Animated background gradient */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-20 animate-pulse" />
          
          {/* Main content */}
          <div className="relative bg-white rounded-xl shadow-xl p-8 md:p-12">
            {/* Construction icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-24 h-24 animate-float">
                <svg className="w-full h-full text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
              </div>
            </div>

            {/* Title with gradient */}
            <h1 className="text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {title}
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg text-center mb-8">
              {description}
            </p>

            {/* Progress indicator */}
            <div className="flex justify-center space-x-2">
              <div className="w-16 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse delay-0" />
              <div className="w-16 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse delay-150" />
              <div className="w-16 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse delay-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
