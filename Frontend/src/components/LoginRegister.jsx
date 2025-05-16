// LoginRegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function LoginRegister({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `/api/auth/${isLogin ? 'login' : 'register'}`;
      const res = await axios.post(url, { email, password });

      if (isLogin) {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          toast.success('Logged in successfully!');
          onAuthSuccess();
        } else {
          toast.error('Login failed: No token received');
        }
      } else {
        toast.success('Registered successfully! You can now log in.');
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
        {isLogin ? 'Login' : 'Register'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <p
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-center text-blue-600 cursor-pointer hover:underline"
      >
        {isLogin ? 'New user? Register here' : 'Already have an account? Login here'}
      </p>
    </div>
  );
}