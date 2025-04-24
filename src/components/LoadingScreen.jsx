import React from 'react';

const LoadingScreen = ({ loadingGif }) => {
return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
        <img
            src={loadingGif}
            alt="Loading..."
            className="w-screen h-screen object-contain"
        />
    </div>
);
};

export default LoadingScreen;