'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Book {
    _id?: string;
    bookName: string,
    bookReleaseDate: string,
    bookPages: number,
    bookAuthorName: string,
    publisherName: string,
    bookPrice: number,
    bookSynopsis: string,
    bookCover: string | File,
}

const defaultBook: Book = {
    bookName: '',
    bookReleaseDate: '',
    bookPages: 0,
    bookAuthorName: '',
    publisherName: '',
    bookPrice: 0,
    bookSynopsis: '',
    bookCover: ''
};

export default function UploadBook() {
    const [books, setBooks] = useState<Book[]>([]);
    const [form, setForm] = useState<Book>(defaultBook);

    const requiredStrings = [
        form.bookName,
        form.bookReleaseDate,
        form.bookAuthorName,
        form.publisherName,
    ];

    const fetchBooks = async () => {
        const res = await axios.get('http://localhost:5000/books');
        setBooks(res.data);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            requiredStrings.some((field) => !field.trim()) ||
            form.bookPages <= 0 ||
            form.bookPrice <= 0
        ) {
            alert('All fields are required');
            return;
        }
        const formData = new FormData();
        formData.append('bookName', form.bookName);
        formData.append('bookReleaseDate', form.bookReleaseDate);
        formData.append('bookPages', form.bookPages.toString());
        formData.append('bookAuthorName', form.bookAuthorName);
        formData.append('publisherName', form.publisherName);
        formData.append('bookPrice', form.bookPrice.toString());
        formData.append('bookSynopsis', form.bookSynopsis);
        if (form.bookCover instanceof File) {
            formData.append('bookCover', form.bookCover);
        }
        if (form._id) {
            await axios.put(`http://localhost:5000/books/${form._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } else {
            await axios.post('http://localhost:5000/books', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        setForm(defaultBook);
        fetchBooks();
    };

    const handleEdit = (book: Book) => {
        setForm(book);
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        try {
            await axios.delete(`http://localhost:5000/books/${id}`);
            fetchBooks();
        } catch (error) {
            console.error('Failed to delete user:', error);
            // Optionally, show an error message to the user here
        }
    };


    return (
        <div style={{ padding: 20 }}>
            <h1>Users</h1>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Book name"
                    value={form.bookName}
                    onChange={(e) => setForm({ ...form, bookName: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="Release Date"
                    value={form.bookReleaseDate}
                    onChange={(e) => setForm({ ...form, bookReleaseDate: e.target.value })}
                />
                <input
                    placeholder='Book Pages'
                    type='number'
                    value={form.bookPages}
                    onChange={(e) => setForm({ ...form, bookPages: parseInt(e.target.value) })}

                />
                <input
                    placeholder='Book Author Name'
                    value={form.bookAuthorName}
                    onChange={(e) => { setForm({ ...form, bookAuthorName: e.target.value }) }}
                />
                <input
                    placeholder='Publisher Name'
                    value={form.publisherName}
                    onChange={(e) => { setForm({ ...form, publisherName: e.target.value }) }}
                />

                <input
                    placeholder='Book Price'
                    type='number'
                    value={form.bookPrice}
                    onChange={(e) => { setForm({ ...form, bookPrice: parseInt(e.target.value) }) }}
                />

                <input
                    placeholder='Book Synopsis'
                    value={form.bookSynopsis}
                    onChange={(e) => { setForm({ ...form, bookSynopsis: e.target.value }) }}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                            setForm({ ...form, bookCover: e.target.files[0] });
                        }
                    }}
                />
                <button type="submit">{form._id ? 'Update' : 'Create'}</button>
            </form>
            <ul>
                {books.map((book) => (
                    <li key={book._id}>
                        {Object.entries(book)
                            .filter(([key]) => key !== '_id') // skip _id if you want
                            .map(([key, value]) => (
                                <span key={key} style={{ marginRight: 8 }}>
                                    <strong>{key}:</strong> {String(value)}
                                </span>
                            ))}
                        <button onClick={() => handleEdit(book)}>Edit</button>
                        <button onClick={() => handleDelete(book._id)}>Delete</button>
                    </li>
                ))}
            </ul>

        </div>
    );
}
