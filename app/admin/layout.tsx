'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import { motion } from 'framer-motion';
import { Menu, Home, User, Briefcase, Image, MessageSquare, Mail, Video, Code, Settings, LogOut, BookOpen } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/admin/home', icon: Home },
  { name: 'About', href: '/admin/about', icon: User },
  { name: 'Experience', href: '/admin/experience', icon: Briefcase },
  { name: 'Skills', href: '/admin/skills', icon: Code },
  { name: 'Photos', href: '/admin/photos', icon: Image },
  { name: 'Videos', href: '/admin/videos', icon: Video },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Blog', href: '/admin/blog', icon: BookOpen },
  { name: 'Contact', href: '/admin/contact', icon: Mail },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    Cookies.remove('admin-token');
    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1A4DA1] text-white">
      <div className="p-4">
        <h2 className="text-xl font-montserrat font-bold">Admin Dashboard</h2>
      </div>
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <button
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors w-full text-left ${
                    isActive
                      ? 'bg-[#F4B400] text-[#1A4DA1]'
                      : 'hover:bg-[#F4B400] hover:text-[#1A4DA1]'
                  }`}
                  onClick={() => {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-white hover:bg-[#F4B400] hover:text-[#1A4DA1]"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-3 left-3 z-10">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4 ml-auto">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>HA</AvatarFallback>
            </Avatar>
            <span className="font-inter text-[#333333]">Hussam Awa</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
