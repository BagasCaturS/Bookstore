import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import bcrypt from 'bcryptjs';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const port = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect(MONGODB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as any).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// akhir membuat user
//////////////////////////////////////////////////////////
// membuat book
// pertama buat schema terlebih dahulu
const userSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    userPassword: String,
})

const bookSchema = new mongoose.Schema({
    bookName: String,
    bookReleaseDate: String,
    bookPages: Number,
    bookAuthorName: String,
    publisherName: String,
    bookPrice: Number,
    bookSynopsis: String,
    bookCover: String,
})
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); //foler tempat upload file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); //nama file yang diupload
    }
})

const upload = multer({ storage: storage });
// lalu membuat model dari schema itu
// model ini akan digunakan untuk berinteraksi dengan database
const User = mongoose.model("User", userSchema);
const Book = mongoose.model("Book", bookSchema);
// untuk membuat book baru bisa seperti ini:
// kita akan membuat endpoint POST /books
// app.post('/books', async (req, res) => {
//     console.log('POST /books called with body:', req.body);
//     const book = new Book(req.body);
//     await book.save();
//     console.log('Book saved:', book);
//     res.send(book);
// });
// akhir membuat book
//////////////////////////////////////////////////////////

app.post('/register', async (req, res) => {
    console.log('POST /register called with body:', req.body);
    const { userName, userEmail, userPassword } = req.body;

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
        console.log('Email has existed:', userEmail);
        res.status(400).send({ message: 'Email has existed' });
        return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userPassword, saltRounds);


    const newUser = new User({
        userName,
        userEmail,
        userPassword: hashedPassword, // Use hashed password
    });

    await newUser.save();
    console.log('User created successfully:', newUser);
    res.status(201).send({ message: 'User created successfully' });
})

app.post('/login', async (req, res) => {
    console.log('POST /login called with body:', req.body);
    const { userEmail, userPassword } = req.body;

    const findUser = await User.findOne({ userEmail });

    if (!findUser) {
        console.log("Email tidak terdaftar:", userEmail);
        res.status(404).send({ message: 'Email tidak terdaftar' });
        return;
    }

    const isPasswordValid = await bcrypt.compare(userPassword, findUser.userPassword ?? '');


    if (!isPasswordValid) {
        console.log('Password tidak sesuai for email:', userEmail);
        res.status(401).send({ message: 'Password tidak sesuai' });
        return;
    }

    // Check if admin
    const isAdmin = userEmail.endsWith('@admin.com');
    console.log('Login successful for email:', userEmail, 'isAdmin:', isAdmin);

    // Only send one response!
    res.send({
        message: 'Login successful',
        role: isAdmin ? 'admin' : 'user'
    });
})

// untuk mendapatkan semua user
app.get('/books', async (_req: express.Request, res: express.Response) => {
    console.log('GET /books called');
    const users = await Book.find();
    console.log('Books found:', users.length);
    res.send(users);
})

// untuk update user berdasarkan id
app.put('/books/:id', async (req, res) => {
    console.log('PUT /books/:id called with id:', req.params.id, 'and body:', req.body);
    const user = await Book.findByIdAndUpdate(req.params.id, req.body,
        { new: true });
    console.log('Book updated:', user);
    res.send(user);
});

// untuk menghapus user berdasarkan id
app.delete('/books/:id', async (req, res) => {
    console.log('DELETE /books/:id called with id:', req.params.id);
    await Book.findByIdAndDelete(req.params.id);
    console.log('Book deleted:', req.params.id);
    res.send({ message: 'User deleted successfully' });
})

app.post('/books', upload.single('bookCover'), async (req, res) => {
    console.log('POST /books called with body:', req.body);
    const bookData = req.body;
    if (req.file) {
        bookData.bookCover = req.file.path; // local path to the image
    }
    const book = new Book(bookData);
    await book.save();
    console.log('Book saved:', book);
    res.send(book);
});

app.listen(port, () => {
    console.log('Server is running on port 5000');
    console.log('Connect to MongoDB at mongodb://localhost:27017/mern-crud');
})

