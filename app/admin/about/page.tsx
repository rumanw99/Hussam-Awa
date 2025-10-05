'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface Stat {
  icon: string;
  value: string;
  label: string;
}

export default function AboutAdminPage() {
  const [aboutData, setAboutData] = useState({
    title: '',
    profileImage: '',
    content: '',
    stats: [] as Stat[]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/about');
      if (response.ok) {
        const data = await response.json();
        setAboutData(data);
        setPreviewUrl(data.profileImage);
      }
    } catch (error) {
      console.error('Failed to fetch about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatChange = (index: number, field: keyof Stat, value: string) => {
    const newStats = [...aboutData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setAboutData({ ...aboutData, stats: newStats });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = aboutData.profileImage;

      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        }
      }

      const response = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...aboutData,
          profileImage: imageUrl,
        }),
      });

      if (response.ok) {
        alert('About section updated successfully!');
        setSelectedFile(null);
        fetchAboutData();
      }
    } catch (error) {
      console.error('Failed to update about data:', error);
      alert('Failed to update about section. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-montserrat font-bold text-[#333333]">About Section</h1>
        <p className="text-[#333333] font-inter">Manage your about section content, image, and statistics</p>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="font-montserrat text-[#333333]">Edit About Section</CardTitle>
          <CardDescription>Update your profile information and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Section Title</Label>
              <Input
                id="title"
                value={aboutData.title}
                onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                placeholder="Media Industry Expert"
                required
              />
            </div>

            <div>
              <Label>Profile Image</Label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1A4DA1] transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-[#1A4DA1]" />
                    <p className="text-sm text-[#333333] font-semibold mb-1">Upload profile image</p>
                    <p className="text-xs text-gray-500">Click to browse</p>
                  </label>
                </div>

                {previewUrl && (
                  <div className="relative">
                    <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Profile Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(aboutData.profileImage);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="content">About Content</Label>
              <Textarea
                id="content"
                value={aboutData.content}
                onChange={(e) => setAboutData({ ...aboutData, content: e.target.value })}
                rows={12}
                placeholder="I am an Executive Producer (filmmaker), HR, Sales Manager, and Marketing Manager with 12 years of experience..."
                required
              />
            </div>

            <div>
              <Label className="text-lg font-semibold mb-4 block">Statistics Cards</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutData.stats.map((stat, index) => (
                  <Card key={index} className="bg-gray-50">
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <Label htmlFor={`icon-${index}`}>Icon Name</Label>
                        <Input
                          id={`icon-${index}`}
                          value={stat.icon}
                          onChange={(e) => handleStatChange(index, 'icon', e.target.value)}
                          placeholder="Briefcase, DollarSign, Users, Award"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Use: Briefcase, DollarSign, Users, Award</p>
                      </div>
                      <div>
                        <Label htmlFor={`value-${index}`}>Value</Label>
                        <Input
                          id={`value-${index}`}
                          value={stat.value}
                          onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                          placeholder="12+"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`label-${index}`}>Label</Label>
                        <Input
                          id={`label-${index}`}
                          value={stat.label}
                          onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                          placeholder="Years Experience"
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="bg-[#1A4DA1] hover:bg-[#0d3a8a]"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
