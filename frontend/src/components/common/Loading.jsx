import React from 'react';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Loading...</p>
    </div>
  );
};

export default Loading;