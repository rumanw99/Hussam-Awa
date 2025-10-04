'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

export default function HomeAdminPage() {
  const [heroData, setHeroData] = useState({
    name: '',
    titles: [''],
    description: '',
    profileImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/hero');
      if (response.ok) {
        const data = await response.json();
        setHeroData(data);
        setPreviewUrl(data.profileImage);
      }
    } catch (error) {
      console.error('Failed to fetch hero data:', error);
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

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(heroData.profileImage);
  };

  const handleTitleChange = (index: number, value: string) => {
    const newTitles = [...heroData.titles];
    newTitles[index] = value;
    setHeroData({ ...heroData, titles: newTitles });
  };

  const handleAddTitle = () => {
    setHeroData({ ...heroData, titles: [...heroData.titles, ''] });
  };

  const handleRemoveTitle = (index: number) => {
    const newTitles = heroData.titles.filter((_, i) => i !== index);
    setHeroData({ ...heroData, titles: newTitles });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    console.log('Form submitted with data:', heroData);

    try {
      let imageUrl = heroData.profileImage;

      if (selectedFile) {
        console.log('Uploading file:', selectedFile.name);
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
          console.log('File uploaded successfully:', imageUrl);
        } else {
          console.error('Upload failed:', uploadResponse.status);
        }
      }

      const payload = {
        ...heroData,
        profileImage: imageUrl,
      };
      console.log('Sending payload to API:', payload);

      const response = await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('API response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('API response data:', result);
        alert('✅ Hero section updated successfully!');
        setSelectedFile(null);
        fetchHeroData();
      } else {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        alert(`❌ Failed to update hero section: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to update hero data:', error);
      alert('Failed to update hero section. Please try again.');
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
        <h1 className="text-3xl font-montserrat font-bold text-[#333333]">Home / Hero Section</h1>
        <p className="text-[#333333] font-inter">Manage your homepage hero section</p>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="font-montserrat text-[#333333]">Edit Hero Section</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={heroData.name}
                onChange={(e) => setHeroData({ ...heroData, name: e.target.value })}
                placeholder="Hussam Awa"
                required
              />
            </div>

            <div>
              <Label>Titles (Animated Text)</Label>
              <div className="space-y-2">
                {heroData.titles.map((title, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={title}
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                      placeholder="Executive Producer"
                      required
                    />
                    {heroData.titles.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveTitle(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTitle}
                  className="w-full"
                >
                  Add Title
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={heroData.description}
                onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                rows={4}
                placeholder="Golden Visa holder with 12+ years of experience..."
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
                    <p className="text-sm text-[#333333] font-semibold mb-1">Upload new image</p>
                    <p className="text-xs text-gray-500">Click to browse</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WEBP up to 5MB</p>
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
                        onClick={handleRemoveFile}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
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
