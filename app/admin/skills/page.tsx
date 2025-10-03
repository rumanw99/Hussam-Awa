'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Skill {
  name: string;
  level: string;
}

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    level: ''
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/resume');
      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills || []);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    const skill = skills[index];
    setFormData({
      name: skill.name,
      level: skill.level
    });
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      const newSkills = skills.filter((_, i) => i !== index);
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'skills', data: newSkills }),
      });
      if (response.ok) {
        fetchSkills();
      }
    } catch (error) {
      console.error('Failed to delete skill:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let newSkills;
      
      if (editingIndex !== null) {
        newSkills = [...skills];
        newSkills[editingIndex] = formData;
      } else {
        newSkills = [...skills, formData];
      }

      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'skills', data: newSkills }),
      });
      
      if (response.ok) {
        setFormData({ name: '', level: '' });
        setShowForm(false);
        setEditingIndex(null);
        fetchSkills();
      }
    } catch (error) {
      console.error('Failed to save skill:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', level: '' });
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
          <h1 className="text-3xl font-montserrat font-bold text-[#333333]">Skills</h1>
          <p className="text-[#333333] font-inter">Manage your professional skills and competencies</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {showForm && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>{editingIndex !== null ? 'Edit Skill' : 'Add Skill'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Skill Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Strategic Planning"
                  required
                />
              </div>
              <div>
                <Label htmlFor="level">Level</Label>
                <Input
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  placeholder="e.g., Expert, Advanced, Intermediate"
                  required
                />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{skill.name}</h3>
                  <p className="text-sm text-[#1A4DA1]">{skill.level}</p>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(index)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {skills.length === 0 && (
        <Card className="bg-white">
          <CardContent className="p-12 text-center text-gray-400">
            <p>No skills yet. Click "Add Skill" to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
