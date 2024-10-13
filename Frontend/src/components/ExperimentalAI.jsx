import React, { useState } from 'react';
import axios from 'axios';
import pdfToText from 'react-pdftotext'; // Ensure this package is installed
import { marked } from 'marked'; // Import the marked library

const ExperimentalAI = () => {
  const [pdfFile, setPdfFile] = useState(null); 
  const [pdfText, setPdfText] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState(''); 
  const [response, setResponse] = useState(''); 
  const [chatHistory, setChatHistory] = useState([]); // State for chat history
  const [isRecording, setIsRecording] = useState(true); // State for toggle recording

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      const extractedText = await pdfToText(file);
      setPdfText(extractedText);
      setQuestion(''); 
      setResponse(''); 
      setError(null); 
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleSummarize = async () => {
    if (!question.trim()) {
      setError('Please enter the PDF file query.');
      return; 
    }

    setLoading(true);
    setError(null); 

    try {
      const combinedText = `
        The following text is extracted from a PDF document.
        
        PDF Content: 
        ${pdfText}(if empty then ignore and forget pdf content, focus on only query)
        
        User Query: 
        ${question}
        
        Please respond using Markdown format, where:
        - Use *asterisks* for *italic text*.
        - Use **double asterisks** for **bold text**.
        - Use # for headings, ## for subheadings, ### for smaller headings.
        - Use - for bullet points and 1. for numbered lists.
        - Use > for blockquotes.
        - Use \`backticks\` for inline code and \`\`\` for code blocks.
        - Use [link text](url) for hyperlinks.
        - Use <span style="color: red;">colored text</span> for custom text colors.
      `;

      const apiResponse = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAabo2OwYVP3dxccxgb8V44k32UfU6VAs0',
        {
          contents: [
            {
              parts: [{ text: combinedText }]
            }
          ]
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      // Get the response and convert it from markdown to HTML
      const markdownResponse = apiResponse.data.candidates[0].content.parts[0].text;
      const formattedResponse = marked(markdownResponse); // Convert markdown to HTML
      setResponse(formattedResponse); 

      // Update chat history if recording is enabled
      if (isRecording) {
        setChatHistory([...chatHistory, { question, response: formattedResponse }]);
      }
      setQuestion(''); // Clear question input
    } catch (error) {
      setError('Error processing the request. Please try again.');
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setChatHistory([]); // Clear chat history
  };

  return (
    <div className="max-w-screen-2xl mt-14 mx-auto md:px-20 px-4 mt-16 pt-5 min-h-screen">
      <div className="w-full p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col">
        <h2 className="text-3xl font-bold text-center mb-6">AI PDF Query</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Upload PDF:</h3>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="cursor-pointer bg-gray-800 text-gray-300 file:bg-blue-600 file:text-white file:rounded file:px-4 file:py-2 hover:file:bg-blue-700 w-full"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Ask a Question:</h3>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Type your question here..."
          />
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${isRecording ? 'bg-blue-600' : 'bg-gray-400'}`}
            >
              <span className={`absolute left-1 w-4 h-4 rounded-full transition transform duration-200 ${isRecording ? 'translate-x-5 bg-white' : 'bg-white'}`} />
            </button>
            <span className="ml-2 text-gray-300">{isRecording ? 'Recording On' : 'Recording Off'}</span>
          </div>
          <button
            onClick={handleSummarize}
            disabled={loading}
            className={`px-6 py-3 text-lg rounded-md ${loading ? 'bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} transition duration-200`}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </div>

        {response && (
          <div className="mt-6 bg-gray-700 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Response:</h3>
            <div 
              className="text-gray-300" 
              dangerouslySetInnerHTML={{ __html: response }} 
            />
          </div>
        )}

        {error && <div className="text-red-500 mt-4">{error}</div>}

        {/* Chat History */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Chat History:</h3>
          <ul className="bg-gray-700 p-4 rounded-md">
            {chatHistory.length === 0 ? (
              <li className="text-gray-300">No chat history available.</li>
            ) : (
              chatHistory.slice(-50).map((chat, index) => (
                <li key={index} className="mb-2">
                  <strong>Q:</strong> {chat.question} <br />
                  <strong>A:</strong>
                  <div 
                    className="text-gray-300" 
                    dangerouslySetInnerHTML={{ __html: chat.response }} 
                  />
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleClearHistory}
            className="px-6 py-3 text-lg rounded-md bg-red-600 hover:bg-red-700 transition duration-200"
          >
            Clear History
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperimentalAI;
