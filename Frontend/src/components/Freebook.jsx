import React, { useEffect, useState } from "react";
import axios from "axios";
import PdfViewer from "./pdfViewer";

const svgFallback = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200">
  <rect width="100%" height="100%" fill="lightgray" />
  <text x="50%" y="50%" text-anchor="middle" fill="darkred" font-size="18" font-family="Arial" dy=".35em">Unable to Load Image</text>
  <text x="50%" y="60%" text-anchor="middle" fill="gray" font-size="14" font-family="Arial" dy=".35em">or Unsupported Format</text>
</svg>`;

function Freebook() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBooks, setCurrentBooks] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const booksPerPage = 3;

  useEffect(() => {
    const getBooks = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4001/book/getbook");
        setBooks(res.data);
        setCurrentBooks(res.data.slice(0, booksPerPage));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getBooks();
  }, []);

  const loadMoreBooks = () => {
    const nextBooks = books.slice(currentBooks.length, currentBooks.length + booksPerPage);
    setCurrentBooks([...currentBooks, ...nextBooks]);
  };

  const handleCardClick = (filePath) => {
    setPdfUrl(filePath);
  };

  const closePreview = () => {
    setPdfUrl(null);
  };

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
      <div className="p-4 bg-background rounded shadow mx-auto md:px-20 px-4 mt-16 pt-5">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse bg-gray-700 rounded-md h-64"></div>
            ))}
          </div>
        ) : currentBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentBooks.map((book) => (
              <div
                key={book._id}
                className="bg-gray-800 transition-transform duration-3000 transform hover:scale-105 rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCardClick(book.path)}
              >
                <img
                  src={book.image}
                  alt={book.name}
                  loading="lazy"
                  className="w-full h-48 object-contain transition-transform"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgFallback);
                  }}
                />
                <div className="p-4">
                  <h2 className="font-bold text-lg text-white">{book.name}</h2>
                  <p className="text-gray-300">Language: {book.language}</p>
                  <p className="text-gray-400">Category: {book.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold text-gray-700 mb-2">No Books Uploaded</h2>
            <p className="text-gray-500">It seems that the admin hasn't uploaded any books yet.</p>
          </div>
        )}
        {currentBooks.length < books.length && (
          <button
            onClick={loadMoreBooks}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700 duration-200"
            disabled={loading}
          >
            Load More
          </button>
        )}
      </div>

      {pdfUrl && <PdfViewer pdfUrl={pdfUrl} onClose={closePreview} />}
    </div>
  );
}

export default Freebook;
