import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    name: String,
    language: String,
    category: String,
    image: String,
    title: String,
    path:String
});

const Book = mongoose.model("Book", bookSchema);

export default Book;