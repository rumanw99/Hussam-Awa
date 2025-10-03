'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Plus, Edit, Trash2, Calendar, User, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage?: string;
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    excerpt: '',
    content: '',
    author: 'Hussam Awa',
    coverImage: ''
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      coverImage: post.coverImage || ''
    });
    setCoverImagePreview(post.coverImage || '');
    setCoverImageFile(null);
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        const response = await fetch(`/api/blog?id=${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchPosts();
        }
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let coverImageUrl = formData.coverImage;
      
      // Upload file if selected
      if (coverImageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', coverImageFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          coverImageUrl = uploadResult.url;
        }
      }
      
      const isEditing = editingId !== null;
      const url = isEditing ? `/api/blog?id=${editingId}` : '/api/blog';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, coverImage: coverImageUrl }),
      });
      
      if (response.ok) {
        setFormData({ title: '', date: '', excerpt: '', content: '', author: 'Hussam Awa', coverImage: '' });
        setCoverImageFile(null);
        setCoverImagePreview('');
        setShowForm(false);
        setEditingId(null);
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', date: '', excerpt: '', content: '', author: 'Hussam Awa', coverImage: '' });
    setCoverImageFile(null);
    setCoverImagePreview('');
    setShowForm(false);
    setEditingId(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-[#333333]">Blog Posts</h1>
          <p className="text-[#333333] font-inter">Manage your blog content</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">
          <Plus className="w-4 h-4 mr-2" />
          Add Post
        </Button>
      </div>

      {showForm && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="font-montserrat text-[#333333]">
              {editingId !== null ? 'Edit Blog Post' : 'Add New Blog Post'}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="coverImage">Cover Image</Label>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="coverImageFile" className="text-sm font-medium text-gray-700">
                      Upload from computer
                    </Label>
                    <Input
                      id="coverImageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1"
                    />
                  </div>
                  <div className="text-center text-gray-500">OR</div>
                  <div>
                    <Label htmlFor="coverImageUrl" className="text-sm font-medium text-gray-700">
                      Use image URL
                    </Label>
                    <Input
                      id="coverImageUrl"
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => {
                        setFormData({ ...formData, coverImage: e.target.value });
                        setCoverImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1"
                    />
                  </div>
                  {coverImagePreview && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium text-gray-700">Preview</Label>
                      <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden border">
                        <Image
                          src={coverImagePreview}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="content">Content (Markdown)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-[#1A4DA1] hover:bg-[#0d3a8a]"
                >
                  {editingId !== null ? 'Update Post' : 'Add Post'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="p-12 text-center text-gray-400">
              <p>No blog posts yet. Click "Add Post" to get started.</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="bg-white group overflow-hidden">
              <div className="flex">
                {post.coverImage && (
                  <div className="w-32 h-32 relative flex-shrink-0">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl mb-2">{post.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        {post.coverImage && (
                          <div className="flex items-center gap-1">
                            <ImageIcon className="w-4 h-4" />
                            Has cover image
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 mb-4">{post.excerpt}</p>
                      <div className="text-sm text-gray-500">
                        {post.content.length} characters
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(post)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
