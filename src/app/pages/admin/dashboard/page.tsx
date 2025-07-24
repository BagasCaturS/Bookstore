import UploadBook from "../uploadBook/page";

export default function AdminDashboard() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 text-zinc-800">
                <UploadBook />
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>
                <p className="text-gray-700 text-center">Welcome to the admin dashboard!</p>
            </div>
        </div>
    );
} 