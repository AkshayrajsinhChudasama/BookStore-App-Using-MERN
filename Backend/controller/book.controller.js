import Book from "../model/book.model.js";
import User from "../model/user.model.js";
import { deleteFile, getDownloadUrlPath, uploadFile } from "./filefunction.js";
import fs from 'fs';

export const getBook = async(req, res) => {
    try {
        const book = await Book.find();
        res.status(200).json(book);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json(error);
    }
};

export const createBook = async (req, res) => {
    try {
        const { userId } = req.body;
        // console.log(req.body);
        if (!userId) {
            return res.status(403).json({ message: 'No user cookie found' });
        }

        const user = await User.findById(userId);
        if (user && user.level !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { name, language, category } = req.body;

        // Create unique file names with the timestamp
        const imageCloudPath = `books/images/`;
        const bookCloudPath = `books/files/`;

        // console.log('Uploading image...');
        const result = await uploadFile(req.files['imageFile'][0],req.files['bookFile'][0]);
        if(!result.success)return result.status(500).send({message:"Failed to upload"});

        const newBook = new Book({
            name,
            language,
            category,
            image: result.imageDownloadURL,
            title: name,
            path: result.bookDownloadURL
        });

        await newBook.save();
        // console.log('Book saved successfully:', newBook);

        return res.status(201).json(newBook);
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ error: 'An error occurred while creating the book.' });
    }finally{
        await unlinkFile(req.files['imageFile'][0].path);
        await unlinkFile(req.files['bookFile'][0].path);
    }
};

// Define the unlinkFile function as shown above.
const unlinkFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                // console.log(`Error deleting file: ${filePath}`, err);
                reject(err);
            } else {
                // console.log(`File deleted: ${filePath}`);
                resolve();
            }
        });
    });
};

export const deleteBook = async (req, res) => {
    const { userId, bookId } = req.body;  
    try {
      // Fetch the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the user is an admin
      if (!user || !user.level === 'admin') {
        return res.status(403).json({ message: "Unauthorized access" });
      }
  
      // Fetch the book
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      // Store image and file paths to delete them on the client-side
      const imagePath = book.image;
      const filePath = book.path;

      await deleteFile(imagePath)
      await deleteFile(filePath)
      // Delete the book from the database
      await Book.findByIdAndDelete(bookId);
  
      // Send the image and file paths to the client for deletion from Firebase
      const books = await Book.find();
      return res.status(200).json(books);
    } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).json({ message: "Server error" });
    }
  };