import axios, { Axios } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function LoginPage() {

    const router = useRouter();

    interface User {
        _id?: string;
        userName: string;
        userEmail: string;
        userPassword: string;
    }

    const defaultUser: User = {
        userName: '',
        userEmail: '',
        userPassword: ''
    };
    const [error, setError] = useState('');
    const [form, setForm] = useState<User>(defaultUser);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            // const isAdmin = form.userEmail.endsWith('@admin.com');
            const res = await axios.post('http://localhost:5000/login', form);
            alert(res.data.message);
            if (res.data.role === 'admin') {
                router.push('/pages/admin/dashboard')
            } else {
                router.push('/pages/user/home');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    }


    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter your email"
                            value={form.userEmail}
                            onChange={e => setForm({ ...form, userEmail: e.target.value })}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter your password"
                            value={form.userPassword}
                            onChange={e => setForm({ ...form, userPassword: e.target.value })}
                        />
                    </div>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}


