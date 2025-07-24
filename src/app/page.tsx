'use client';
import LoginPage from './pages/user/login/page';
import RegisterPage from './pages/user/register/page';



export default function Home() {


  return (
    <div style={{ padding: 20 }}>
     
      <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
        <LoginPage />
        <RegisterPage />
        
      </div>
    </div>
  );
}
