'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { GoogleIcon, FacebookIcon, QrCodeIcon } from '@/components/ui/Icons';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/lib/api/authService';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authService.login(formData);
      login(response.token);
      router.push('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Branding Section */}
      <div className="hidden md:flex flex-1 flex-col items-start justify-center p-12 bg-stone-100 from-primary to-accent text-white relative">
        <div className="absolute top-12 left-12 flex items-center space-x-2">
          <QrCodeIcon className="h-8 w-8 text-gray-600" />
          <span className="text-2xl font-bold text-gray-600">GoCashless</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl text-gray-600 font-bold leading-tight drop-shadow-md">
            Seamless Payments.
            <br />
            Anytime. Anywhere.
          </h1>
          <p className="text-lg text-gray-600 drop-shadow-md">
            Log in to manage your business transactions securely.
          </p>
        </div>
        <div className="absolute bottom-12 text-gray-400 text-sm drop-shadow-md">
          © 2025 GoCashless. All rights reserved.
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-stone-100 p-6 md:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-dark-text">Welcome Back 👋</h2>
            <p className="text-black">Please log in to your account.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-dark-text">Email or Phone</label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-dark-text">Password</label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input type="checkbox" id="remember" name="remember" className="h-4 w-4 text-accent rounded border-gray-300 focus:ring-accent" />
                <label htmlFor="remember" className="ml-2 text-black">Remember Me</label>
              </div>
              <a href="#" className="font-medium text-accent hover:underline">Forgot Password?</a>
            </div>

            <Button type="submit" fullWidth>Log In</Button>
          </form>

          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-black text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Placeholder for Social Buttons */}
            <button className="w-full flex items-center justify-center py-2.5 border border-gray-300 rounded-md hover:bg-gray-50">
                <GoogleIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium text-dark-text">Log in with Google</span>
            </button>
             <button className="w-full flex items-center justify-center py-2.5 border border-gray-300 rounded-md hover:bg-gray-50">
                <FacebookIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium text-dark-text">Log in with Facebook</span>
            </button>
          </div>

          <p className="text-center text-sm text-dark-text">
            Don't have an account?{' '}
            <a href="/register" className="font-bold text-accent hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
