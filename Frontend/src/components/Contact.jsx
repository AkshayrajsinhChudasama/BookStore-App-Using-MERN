import React, { useState } from "react";
import Loader from "./Loader";
import toast from "react-hot-toast";
import axios from "axios"; // Import Axios
import { useAuth } from "../context/AuthProvider";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [authUser,d,url] = useAuth(); // Get authenticated user

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        email: authUser.email, // Use authenticated user's email
        message,
      };

      // Make a POST request to the /contact endpoint
      await axios.post(url + 'user/contact', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success("Message sent successfully!");
      setName("");
      setMessage("");
    } catch (err) {
      console.error(err); // Log the error for debugging
      toast.error("Failed to send message. Please try again."); // Show toast on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-10">
      {loading && <Loader />}
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={authUser.email} // Use authenticated user's email
              disabled // Disable the email field
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1" htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="4"
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded-md text-white ${loading ? 'bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'} transition duration-200`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
