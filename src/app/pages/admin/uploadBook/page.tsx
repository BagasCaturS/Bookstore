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
    const [preview, setPreview] = useState<string | null>(null);

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

    useEffect(() => {
        if (form.bookCover && form.bookCover instanceof File) {
            const url = URL.createObjectURL(form.bookCover);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        } else if (typeof form.bookCover === 'string' && form.bookCover) {
            setPreview(`http://localhost:5000/${form.bookCover.replace(/\\/g, '/')}`);
        } else {
            setPreview(null);
        }
    }, [form.bookCover]);

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
        setPreview(null);
        fetchBooks();
    };

    const handleEdit = (book: Book) => {
        setForm(book);
        if (typeof book.bookCover === 'string') {
            setPreview(`http://localhost:5000/${book.bookCover.replace(/\\/g, '/')}`);
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        try {
            await axios.delete(`http://localhost:5000/books/${id}`);
            fetchBooks();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-center">Book Management</h1>
            <form onSubmit={handleSubmit} className="bg-base-100 rounded-lg shadow p-8 mb-10 flex flex-col gap-4">
                <div className="form-control">
                    <label className="label font-semibold">Book Name</label>
                    <input
                        className="input input-bordered"
                        placeholder="Book name"
                        value={form.bookName}
                        onChange={(e) => setForm({ ...form, bookName: e.target.value })}
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="label font-semibold">Release Date</label>
                    <input
                        className="input input-bordered"
                        type="date"
                        value={form.bookReleaseDate}
                        onChange={(e) => setForm({ ...form, bookReleaseDate: e.target.value })}
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="label font-semibold">Book Pages</label>
                    <input
                        className="input input-bordered"
                        placeholder="Book Pages"
                        type="number"
                        min={1}
                        value={form.bookPages}
                        onChange={(e) => setForm({ ...form, bookPages: parseInt(e.target.value) || 0 })}
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="label font-semibold">Book Author Name</label>
                    <input
                        className="input input-bordered"
                        placeholder="Book Author Name"
                        value={form.bookAuthorName}
                        onChange={(e) => setForm({ ...form, bookAuthorName: e.target.value })}
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="label font-semibold">Publisher Name</label>
                    <input
                        className="input input-bordered"
                        placeholder="Publisher Name"
                        value={form.publisherName}
                        onChange={(e) => setForm({ ...form, publisherName: e.target.value })}
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="label font-semibold">Book Price</label>
                    <input
                        className="input input-bordered"
                        placeholder="Book Price"
                        type="number"
                        min={1}
                        value={form.bookPrice}
                        onChange={(e) => setForm({ ...form, bookPrice: parseInt(e.target.value) || 0 })}
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="label font-semibold">Book Synopsis</label>
                    <textarea
                        className="textarea textarea-bordered"
                        placeholder="Book Synopsis"
                        value={form.bookSynopsis}
                        onChange={(e) => setForm({ ...form, bookSynopsis: e.target.value })}
                        rows={3}
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="label font-semibold">Book Cover</label>
                    <input
                        className="file-input file-input-bordered"
                        type="file"
                        accept="image/*"
                        onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                                setForm({ ...form, bookCover: e.target.files[0] });
                                setPreview(URL.createObjectURL(e.target.files[0]));
                            }
                        }}
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="Book Cover Preview"
                            className="mt-2 rounded border max-w-[120px] max-h-[120px]"
                        />
                    )}
                </div>
                <button
                    type="submit"
                    className="btn btn-primary mt-4"
                >
                    {form._id ? 'Update' : 'Create'}
                </button>
            </form>
            <h2 className="text-2xl font-bold mb-4">Book List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {books.map((book) => (
                    <div key={book._id} className="card bg-base-100 shadow-md">
                        <figure>
                            {typeof book.bookCover === 'string' && (
                                <img
                                    src={`http://localhost:5000/${book.bookCover.replace(/\\/g, '/')}`}
                                    alt={book.bookName}
                                    className="w-32 h-32 object-cover rounded m-4"
                                />
                            )}
                        </figure>
                        <div className="card-body">
                            <h3 className="card-title">{book.bookName}</h3>
                            <p className="text-sm text-gray-600 mb-1">Author: {book.bookAuthorName}</p>
                            <p className="text-sm text-gray-600 mb-1">Publisher: {book.publisherName}</p>
                            <p className="text-sm text-gray-600 mb-1">Pages: {book.bookPages}</p>
                            <p className="text-sm text-gray-600 mb-1">Price: ${book.bookPrice}</p>
                            <p className="text-xs text-gray-500 mb-2">{book.bookSynopsis}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(book)}
                                    className="btn btn-warning btn-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(book._id)}
                                    className="btn btn-error btn-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
