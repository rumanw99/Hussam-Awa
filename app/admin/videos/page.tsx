'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
import { Plus, Video as VideoIcon, Upload, X, Image as ImageIcon, Edit, Trash2 } from 'lucide-react';

interface Video {
  title: string;
  description: string;
  category: string;
  url: string;
  thumbnail: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    video: null as File | null,
    thumbnail: null as File | null
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let videoUrl = '';
      let thumbnailUrl = '';
      
      if (formData.video) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.video);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          videoUrl = uploadData.url;
        }
      }

      if (formData.thumbnail) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.thumbnail);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          thumbnailUrl = uploadData.url;
        }
      }

      const videoData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        url: videoUrl,
        thumbnail: thumbnailUrl
      };

      if (editingIndex !== null) {
        // Update existing video
        const response = await fetch('/api/videos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ index: editingIndex, ...videoData })
        });
        
        if (response.ok) {
          const updatedVideos = [...videos];
          updatedVideos[editingIndex] = videoData;
          setVideos(updatedVideos);
        }
      } else {
        // Add new video
        const response = await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(videoData)
        });
        
        if (response.ok) {
          const newVideo = await response.json();
          setVideos([...videos, newVideo]);
        }
      }

      setFormData({ title: '', description: '', category: '', video: null, thumbnail: null });
      setShowForm(false);
      setEditingIndex(null);
    } catch (error) {
      console.error('Failed to save video:', error);
    }
  };

  const handleEdit = (index: number) => {
    const video = videos[index];
    setFormData({
      title: video.title,
      description: video.description,
      category: video.category,
      video: null,
      thumbnail: null
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index: number) => {
    try {
      const response = await fetch('/api/videos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
      });
      
      if (response.ok) {
        const updatedVideos = videos.filter((_, i) => i !== index);
        setVideos(updatedVideos);
      }
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', description: '', category: '', video: null, thumbnail: null });
    setShowForm(false);
    setEditingIndex(null);
  };

  const categories = ['Wedding', 'Corporate', 'Event'];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-[#333333]">Videos</h1>
          <p className="text-[#333333] font-inter">Manage your portfolio videos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">
          <Plus className="w-4 h-4 mr-2" />
          Add Video
        </Button>
      </div>

      {showForm && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="font-montserrat text-[#333333]">
              {editingIndex !== null ? 'Edit Video' : 'Add New Video'}
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
                <Label htmlFor="video">Video File</Label>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFormData({ ...formData, video: e.target.files?.[0] || null })}
                  required={editingIndex === null}
                />
              </div>
              
              <div>
                <Label htmlFor="thumbnail">Thumbnail Image</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">
                  {editingIndex !== null ? 'Update Video' : 'Add Video'}
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
        {videos.length === 0 ? (
          <Card className="col-span-full bg-white">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <VideoIcon className="w-12 h-12 text-[#1A4DA1] mb-4" />
              <h3 className="text-lg font-semibold text-[#333333] mb-2">No videos yet</h3>
              <p className="text-[#333333] text-center mb-4">Add your first video to get started</p>
              <Button onClick={() => setShowForm(true)} className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </CardContent>
          </Card>
        ) : (
          videos.map((video, index) => (
            <Card key={index} className="bg-white overflow-hidden group">
              <div className="aspect-video relative">
                <video
                  src={video.url}
                  poster={video.thumbnail}
                  controls
                  className="w-full h-full object-cover"
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
                <h3 className="font-semibold text-[#333333] mb-1">{video.title}</h3>
                <p className="text-sm text-[#333333] mb-2">{video.description}</p>
                <span className="inline-block bg-[#F4B400] text-[#1A4DA1] px-2 py-1 rounded text-xs font-semibold">
                  {video.category}
                </span>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}



