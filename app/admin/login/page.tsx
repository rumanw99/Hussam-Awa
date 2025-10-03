'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Form submitted!", { email, password: '***' });
    setError('');
    
    try {
      console.log("📤 Sending login request...");
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      const data = await response.json();
      console.log("📥 Response:", response.status, data);
  
      if (data.success) {
        console.log("✅ Login successful, redirecting...");
        window.location.replace('/admin/dashboard');
      } else {
        console.log("❌ Login failed:", data.message);
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center font-montserrat font-bold text-[#1A4DA1]">Admin Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button 
                type="submit" 
                className="w-full h-9 px-4 py-2 bg-[#1A4DA1] hover:bg-[#F4B400] text-white transition-colors rounded-lg cursor-pointer font-medium"
              >
                Login
              </button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
