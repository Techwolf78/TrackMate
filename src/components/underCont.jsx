import React from 'react';

function UnderCont() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center max-w-lg mx-auto p-6 space-y-6">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-800">
          Under Construction
        </h1>
        
        {/* Image */}
        <div className="flex justify-center">
          <img
            src="under-construction.jpg"
            alt="Under Construction"
            className="w-full h-auto max-w-lg rounded-lg shadow-lg"
          />
        </div>
        
        {/* Optional additional text */}
        <p className="text-gray-600 text-lg">
          We're working hard to bring you the best experience. Stay tuned!
        </p>
      </div>
    </div>
  );
}

export default UnderCont;
