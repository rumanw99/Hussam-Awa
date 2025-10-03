import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Image, Video, FileText, Settings } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { name: 'Photos', value: '0', icon: Image, href: '/admin/photos' },
    { name: 'Videos', value: '0', icon: Video, href: '/admin/videos' },
    { name: 'Resume Sections', value: '3', icon: FileText, href: '/admin/resume' },
    { name: 'Settings', value: 'Updated', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-montserrat font-bold text-[#333333]">Dashboard</h1>
        <p className="text-[#333333] font-inter">Welcome to your admin dashboard. Manage your portfolio content here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-white hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-inter text-[#333333]">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-[#1A4DA1]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1A4DA1]">{stat.value}</div>
              <p className="text-xs text-[#333333] font-inter">
                <a href={stat.href} className="text-[#F4B400] hover:underline">Manage</a>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="font-montserrat text-[#333333]">Quick Actions</CardTitle>
          <CardDescription className="font-inter">Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/admin/photos"
              className="p-4 border rounded-lg hover:bg-[#F5F5F5] transition-colors"
            >
              <Image className="w-8 h-8 text-[#1A4DA1] mb-2" />
              <h3 className="font-inter font-semibold text-[#333333]">Add New Photo</h3>
              <p className="text-sm text-[#333333] font-inter">Upload and manage portfolio photos</p>
            </a>
            <a
              href="/admin/videos"
              className="p-4 border rounded-lg hover:bg-[#F5F5F5] transition-colors"
            >
              <Video className="w-8 h-8 text-[#1A4DA1] mb-2" />
              <h3 className="font-inter font-semibold text-[#333333]">Add New Video</h3>
              <p className="text-sm text-[#333333] font-inter">Add Vimeo or YouTube video links</p>
            </a>
            <a
              href="/admin/resume"
              className="p-4 border rounded-lg hover:bg-[#F5F5F5] transition-colors"
            >
              <FileText className="w-8 h-8 text-[#1A4DA1] mb-2" />
              <h3 className="font-inter font-semibold text-[#333333]">Update Resume</h3>
              <p className="text-sm text-[#333333] font-inter">Edit your CV details</p>
            </a>
            <a
              href="/admin/settings"
              className="p-4 border rounded-lg hover:bg-[#F5F5F5] transition-colors"
            >
              <Settings className="w-8 h-8 text-[#1A4DA1] mb-2" />
              <h3 className="font-inter font-semibold text-[#333333]">Update Profile</h3>
              <p className="text-sm text-[#333333] font-inter">Change your personal information</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
