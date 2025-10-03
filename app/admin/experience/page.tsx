'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Experience {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/resume');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data.experience || []);
      }
    } catch (error) {
      console.error('Failed to fetch experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    const exp = experiences[index];
    setFormData({
      position: exp.position,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) {
      return;
    }

    try {
      const newExperiences = experiences.filter((_, i) => i !== index);
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'experience', data: newExperiences }),
      });
      if (response.ok) {
        fetchExperiences();
      }
    } catch (error) {
      console.error('Failed to delete experience:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let newExperiences;
      
      if (editingIndex !== null) {
        // Update existing experience
        newExperiences = [...experiences];
        newExperiences[editingIndex] = formData;
      } else {
        // Add new experience
        newExperiences = [...experiences, formData];
      }

      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'experience', data: newExperiences }),
      });
      
      if (response.ok) {
        setFormData({ position: '', company: '', startDate: '', endDate: '', description: '' });
        setShowForm(false);
        setEditingIndex(null);
        fetchExperiences();
      }
    } catch (error) {
      console.error('Failed to save experience:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ position: '', company: '', startDate: '', endDate: '', description: '' });
    setShowForm(false);
    setEditingIndex(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-[#333333]">Experience</h1>
          <p className="text-[#333333] font-inter">Manage your professional experience</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {showForm && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>{editingIndex !== null ? 'Edit Experience' : 'Add Experience'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Input id="position" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">
                  {editingIndex !== null ? 'Update' : 'Add'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{exp.position}</h3>
                  <p className="text-[#1A4DA1] font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate || 'Present'}</p>
                  <p className="mt-2 text-gray-700">{exp.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(index)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && (
        <Card className="bg-white">
          <CardContent className="p-12 text-center text-gray-400">
            <p>No experiences yet. Click "Add Experience" to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
