"use client";
import React, { useState } from 'react';
import Link from 'next/link';

// This is the Signup page. It collects email and password from the user.
// Later, you can connect this to Firebase for real authentication.
export default function SignupPage() {
  // State to hold form values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just check if fields are filled
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setSuccess(true); // Show success message
    // TODO: Add Firebase signup here later
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up for Pesa Mkononi</h1>
        {success ? (
          <div className="text-green-600 text-center">
            Signup successful!{' '}
            <Link href="/login" className="underline text-green-700">Go to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-400"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-400"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
            >
              Sign Up
            </button>
          </form>
        )}
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
} 