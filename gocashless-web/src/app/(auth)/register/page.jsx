'use client'; // Add this directive for using hooks

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { QrCodeIcon } from '@/components/ui/Icons';
import { authService } from '@/lib/api/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const userData = {
      username: formData.companyName,
      firstName: formData.companyName,
      lastName: 'Company', // Placeholder as discussed
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
    };

    try {
      const response = await authService.register(userData);
      setSuccess('Registration successful! Please log in.');
      console.log('Registration successful:', response);
      // Optionally redirect to login page after a delay
      // setTimeout(() => { window.location.href = '/login'; }, 2000);
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Branding Section */}
      <div className="hidden md:flex flex-1 flex-col items-start justify-center p-12 bg-stone-100 relative">
        <div className="absolute top-12 left-12 flex items-center space-x-2">
          <QrCodeIcon className="h-8 w-8 text-gray-600" />
          <span className="text-2xl font-bold text-gray-600">GoCashless</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-bold leading-tight text-gray-600 drop-shadow-md">
            Join the Future
            <br />
            of Transit.
          </h1>
          <p className="text-lg text-gray-600 drop-shadow-md">
            Create your account to start managing your fleet with ease.
          </p>
        </div>
        <div className="absolute bottom-12 text-gray-400 text-sm drop-shadow-md">
          © 2025 GoCashless. All rights reserved.
        </div>
      </div>

      {/* Right Registration Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-stone-100 p-6 md:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-dark-text">Create Your Company Account</h2>
            <p className="text-black">Let's get you set up.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium mb-1 text-dark-text">Company Name</label>
              <Input id="companyName" name="companyName" type="text" placeholder="Your Company Inc." required value={formData.companyName} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-dark-text">Email</label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required value={formData.email} onChange={handleChange} />
            </div>
             <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1 text-dark-text">Phone Number</label>
              <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+260 9..." required value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-dark-text">Password</label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
            </div>
             <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-dark-text">Confirm Password</label>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required value={formData.confirmPassword} onChange={handleChange} />
            </div>

            <div className="flex items-start">
                <input type="checkbox" id="terms" name="terms" className="h-4 w-4 mt-1 text-accent rounded border-gray-300 focus:ring-accent" required />
                <label htmlFor="terms" className="ml-2 text-sm text-black">I agree to the <a href="#" className="font-medium text-accent hover:underline">Terms and Service</a></label>
            </div>

            <Button type="submit" fullWidth>Create Account</Button>
          </form>

          <p className="text-center text-sm text-dark-text">
            Already have an account?{' '}
            <a href="/login" className="font-bold text-accent hover:underline">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;