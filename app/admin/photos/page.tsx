'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
import { Plus, Image as ImageIcon, Upload, X, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface Photo {
  title: string;
  description: string;
  category: string;
  url: string;
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null as File | null
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos');
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = '';
      
      if (formData.image) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.image);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        }
      }

      const photoData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        url: imageUrl
      };

      if (editingIndex !== null) {
        // Update existing photo
        const response = await fetch('/api/photos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ index: editingIndex, ...photoData })
        });
        
        if (response.ok) {
          const updatedPhotos = [...photos];
          updatedPhotos[editingIndex] = photoData;
          setPhotos(updatedPhotos);
        }
      } else {
        // Add new photo
        const response = await fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(photoData)
        });
        
        if (response.ok) {
          const newPhoto = await response.json();
          setPhotos([...photos, newPhoto]);
        }
      }

      setFormData({ title: '', description: '', category: '', image: null });
      setShowForm(false);
      setEditingIndex(null);
    } catch (error) {
      console.error('Failed to save photo:', error);
    }
  };

  const handleEdit = (index: number) => {
    const photo = photos[index];
    setFormData({
      title: photo.title,
      description: photo.description,
      category: photo.category,
      image: null
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index: number) => {
    try {
      const response = await fetch('/api/photos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
      });
      
      if (response.ok) {
        const updatedPhotos = photos.filter((_, i) => i !== index);
        setPhotos(updatedPhotos);
      }
    } catch (error) {
      console.error('Failed to delete photo:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '', category: '', image: null });
    setShowForm(false);
    setEditingIndex(null);
  };

  const categories = ['Wedding', 'Corporate', 'Portrait', 'Event'];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-[#333333]">Photos</h1>
          <p className="text-[#333333] font-inter">Manage your portfolio photos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">
          <Plus className="w-4 h-4 mr-2" />
          Add Photo
        </Button>
      </div>

      {showForm && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="font-montserrat text-[#333333]">
              {editingIndex !== null ? 'Edit Photo' : 'Add New Photo'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  required={editingIndex === null}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">
                  {editingIndex !== null ? 'Update Photo' : 'Add Photo'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.length === 0 ? (
          <Card className="col-span-full bg-white">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="w-12 h-12 text-[#1A4DA1] mb-4" />
              <h3 className="text-lg font-semibold text-[#333333] mb-2">No photos yet</h3>
              <p className="text-[#333333] text-center mb-4">Add your first photo to get started</p>
              <Button onClick={() => setShowForm(true)} className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">
                <Plus className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
            </CardContent>
          </Card>
        ) : (
          photos.map((photo, index) => (
            <Card key={index} className="bg-white overflow-hidden group">
              <div className="aspect-square relative">
                <Image
                  src={photo.url}
                  alt={photo.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleEdit(index)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(index)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-[#333333] mb-1">{photo.title}</h3>
                <p className="text-sm text-[#333333] mb-2">{photo.description}</p>
                <span className="inline-block bg-[#F4B400] text-[#1A4DA1] px-2 py-1 rounded text-xs font-semibold">
                  {photo.category}
                </span>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

