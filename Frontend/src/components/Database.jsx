import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";
import Loader from "./Loader"; // Import the Loader component

export default function Database() {
  const [books, setBooks] = useState([]);
  const url = useAuth()[2];
  const [newBook, setNewBook] = useState({
    name: "",
    language: "",
    category: "",
    image: null,
    file: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authUser] = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentBooks, setCurrentBooks] = useState([]);
  const [booksPerPage] = useState(7);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getBook = async () => {
      setLoading(true);
      try {
        const res = await axios.get(url + "book/getbook");
        setBooks(res.data);
        setCurrentBooks(res.data.slice(0, booksPerPage));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getBook();
  }, [url]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: name === "image" || name === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newBook.name);
    formData.append("language", newBook.language);
    formData.append("category", newBook.category);
    formData.append("imageFile", newBook.image);
    formData.append("bookFile", newBook.file);
    formData.append("userId", authUser._id);

    try {
      setLoading(true);
      const response = await axios.post(url + "book/createbook", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Book created:", response.data);
      setBooks((prevBooks) => [...prevBooks, response.data]);
      setCurrentBooks((prevBooks) => [...prevBooks, response.data]);
      setNewBook({ name: "", language: "", category: "", image: null, file: null });
      setIsModalOpen(false);
      toast.success("Book created successfully!");
    } catch (error) {
      console.error("Error creating book:", error);
      toast.error("Failed to create book");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if(window.confirm("Once book deleted then can not be retrived back are you sure to delete ?")){
      setLoading(true);

      try {
        const res = await axios.post(url + `book/deleteBook`, {
          userId: authUser._id,
          bookId: bookId
        });
      
        // Check if the response was successful (status 200 or 204)
        if (res.status === 200 || res.status === 204) {
          // Remove the deleted book from the state
          const data = await res.data;
          setBooks(data)
          setCurrentBooks(res.data.slice(0, booksPerPage));
          console.log("Delete response:", data);
          toast.success("Book deleted successfully!");
        } else {
          toast.error("Failed to delete book");
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        toast.error("An error occurred while deleting the book");
      } finally {
        setLoading(false);
      }      
    }else{
      toast.error('Request for delete dismissed');
    }
  };

  const loadMoreBooks = () => {
    const nextPage = currentPage + 1;
    const nextBooks = books.slice(0, nextPage * booksPerPage);
    setCurrentBooks(nextBooks);
    setCurrentPage(nextPage);
  };

  return (
    <div className="p-4 bg-background rounded shadow mx-auto md:px-20 px-4 mt-16 pt-5 min-h-screen">
      {loading && <Loader />}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-10" />
          <div className="fixed inset-0 flex items-center justify-center z-20">
            <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 relative transition-all transform ease-out duration-300">
              <h3 className="font-bold text-2xl text-center mb-4 text-white">Add a New Book</h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300">Book Name</label>
                  <input
                    type="text"
                    placeholder="Enter book name"
                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="name"
                    value={newBook.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-3 mt-3">
                  <label className="block text-sm font-medium text-gray-300">Language</label>
                  <input
                    type="text"
                    placeholder="Enter book language"
                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="language"
                    value={newBook.language}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-3 mt-3">
                  <label className="block text-sm font-medium text-gray-300">Category</label>
                  <input
                    type="text"
                    placeholder="Enter book category"
                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="category"
                    value={newBook.category}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-3 mt-3">
                  <label className="block text-sm font-medium text-gray-300">Upload Image</label>
                  <input
                    type="file"
                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-3 mt-3">
                  <label className="block text-sm font-medium text-gray-300">Upload File</label>
                  <input
                    type="file"
                    className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="file"
                    onChange={handleChange}
                    accept=".pdf,.epub,.mobi"
                    disabled={loading}
                  />
                </div>
                <div className="flex justify-between mt-5">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition duration-200"
                    onClick={() => setIsModalOpen(false)}
                    disabled={loading}
                  >
                    Cancel  
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
      <div className="max-w-screen-2xl container mx-auto md:px-20 px-4">
        
        <div className="p-4 bg-background rounded shadow mx-auto md:px-20 px-4 mt-4 min-h-screen">
        <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-pink-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-pink-700 duration-200"
          disabled={loading}
        >
          New Book
        </button>
      </div>
          {loading && <Loader />}
          {currentBooks.length > 0 ? (
            <>
     <table className="min-w-full bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-lg">
  <thead className="bg-gray-700 text-white">
    <tr>
      <th className="p-4 text-left text-lg font-semibold">Book Name</th>
      <th className="p-4 text-left text-lg font-semibold">Language</th>
      <th className="p-4 text-left text-lg font-semibold">Category</th>
      <th className="p-4 text-left text-lg font-semibold">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-600">
    {currentBooks.map((book) => (
      <tr key={book._id} className="hover:bg-gray-800 transition duration-200">
        <td className="p-4 border-b border-gray-600 text-gray-300 font-medium">{book.name}</td>
        <td className="p-4 border-b border-gray-600 text-gray-300 font-medium">{book.language}</td>
        <td className="p-4 border-b border-gray-600 text-gray-300 font-medium">{book.category}</td>
        <td className="p-4 border-b border-gray-600 text-gray-300 font-medium">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200 shadow-md"
            onClick={() => handleDelete(book._id)}
            disabled={loading}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

{books.length > currentBooks.length && (
  <div className="text-center mt-5">
    <button
      onClick={loadMoreBooks}
      className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 shadow-md"
      disabled={loading}
    >
      Load More
    </button>
  </div>
)}


            </>
          ) : (
            <div className="text-center mt-10 text-gray-500">
              No books in the database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
