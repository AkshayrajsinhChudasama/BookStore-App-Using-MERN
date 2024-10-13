// PdfViewer.js
import React, { useEffect, useState } from 'react';
import Loader from './Loader'; // Import your Loader component

const PdfViewer = ({ pdfUrl, onClose }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setLoading(false); // PDF is loaded, set loading to false
    };

    // Attach load event to the iframe
    const iframe = document.getElementById('pdf-iframe');
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
    }

    // Clean up event listener on unmount
    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleLoad);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative w-full h-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader /> {/* Show your loader here */}
          </div>
        )}
        <iframe
          id="pdf-iframe"
          src={pdfUrl}
          title="PDF Preview"
          className={`rounded-lg border-0 w-full h-full ${loading ? 'hidden' : 'block'}`} // Hide iframe while loading
        ></iframe>
        <button
          onClick={onClose}
          className="absolute top-14 right-4 text-white bg-gray-800 hover:bg-black rounded-md px-4 py-2 text-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;
