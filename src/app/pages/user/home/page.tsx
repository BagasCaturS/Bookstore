'use client'; 
import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "@/app/components/bookcard";

interface Book {
    _id?: string;
    bookName: string;
    bookAuthorName: string;
    bookCover: string;
    bookSynopsis: string;
    bookPrice: number;
    // ...other fields
}

export default function UserHomePage() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        axios.get('http://localhost:5000/books').then(res => setBooks(res.data));
    }, []);

    return (
        <div className="flex flex-wrap gap-6 justify-center p-8 bg-gray-100 min-h-screen">
            {books.map(book => (
                <BookCard
                    key={book._id}
                    bookName={book.bookName}
                    bookAuthorName={book.bookAuthorName}
                    bookCover={book.bookCover}
                    bookSynopsis={book.bookSynopsis}
                    bookPrice={book.bookPrice}
                />
            ))}
        </div>
    );
}