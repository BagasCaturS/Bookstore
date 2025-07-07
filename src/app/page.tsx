'use client';
import LoginPage from './pages/user/login/page';
import RegisterPage from './pages/user/register/page';
import UploadBook from './pages/admin/uploadBook/page';
import BookCard from './components/bookcard';


export default function Home() {


  return (
    <div style={{ padding: 20 }}>
      <UploadBook />
      <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
        <LoginPage />
        <RegisterPage />
        
      </div>
    </div>
  );
}
