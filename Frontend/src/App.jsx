// App.jsx
import React, { useState } from 'react';
import LoginRegisterPage from './components/LoginRegister.jsx';
import EditorPage from './components/EditorPage.jsx';
import BlogListPage from './components/BlogListPage.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [view, setView] = useState('editor');

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900 font-sans">
      <ToastContainer />
      {isAuthenticated ? (
        <>
          <nav className="bg-white shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <h1 className="text-xl font-bold text-blue-600">MERN Blog App</h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setView('editor')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${view === 'editor' ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 hover:bg-blue-100'}`}
              >
                New Blog
              </button>
              <button
                onClick={() => setView('blogs')}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${view === 'blogs' ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 hover:bg-blue-100'}`}
              >
                All Blogs
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 shadow"
              >
                Logout
              </button>
            </div>
          </nav>
          <main className="p-8 max-w-5xl mx-auto">
            {view === 'editor' ? <EditorPage /> : <BlogListPage />}
          </main>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-white">
          <LoginRegisterPage onAuthSuccess={handleAuthSuccess} />
        </div>
      )}
    </div>
  );
}

export default App;