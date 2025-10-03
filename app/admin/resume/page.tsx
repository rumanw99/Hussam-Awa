'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Plus, Briefcase, GraduationCap, Code } from 'lucide-react';

interface Experience {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  name: string;
  level: string;
}

export default function ResumePage() {
  const [resume, setResume] = useState({
    experience: [] as Experience[],
    aboutMe: '',
    skills: [] as Skill[]
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('experience');

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await fetch('/api/resume');
      if (response.ok) {
        const data = await response.json();
        setResume(data);
      }
    } catch (error) {
      console.error('Failed to fetch resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExperience = async (experience: Experience) => {
    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'experience', item: experience }),
      });
      if (response.ok) {
        fetchResume();
      }
    } catch (error) {
      console.error('Failed to add experience:', error);
    }
  };

  const handleUpdateAboutMe = async (aboutMe: string) => {
    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'aboutMe', content: aboutMe }),
      });
      if (response.ok) {
        fetchResume();
      }
    } catch (error) {
      console.error('Failed to update about me:', error);
    }
  };

  const handleAddSkill = async (skill: Skill) => {
    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'skills', item: skill }),
      });
      if (response.ok) {
        fetchResume();
      }
    } catch (error) {
      console.error('Failed to add skill:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-montserrat font-bold text-[#333333]">Resume</h1>
        <p className="text-[#333333] font-inter">Manage your resume sections</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="experience" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Experience
          </TabsTrigger>
          <TabsTrigger value="aboutMe" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            About Me
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Skills
          </TabsTrigger>
        </TabsList>

        <TabsContent value="experience" className="space-y-6">
          <ExperienceSection experiences={resume.experience} onAdd={handleAddExperience} />
        </TabsContent>

        <TabsContent value="aboutMe" className="space-y-6">
          <AboutMeSection aboutMe={resume.aboutMe} onUpdate={handleUpdateAboutMe} />
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <SkillsSection skills={resume.skills} onAdd={handleAddSkill} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ExperienceSection({ experiences, onAdd }: { experiences: Experience[], onAdd: (exp: Experience) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ position: '', company: '', startDate: '', endDate: '', description: '' });
    setShowForm(false);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Experience</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {showForm && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Add Experience</CardTitle>
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
                <Button type="submit" className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">Add</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-4">
              <h3 className="font-semibold">{exp.position}</h3>
              <p className="text-[#1A4DA1]">{exp.company}</p>
              <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate || 'Present'}</p>
              <p className="mt-2">{exp.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

function AboutMeSection({ aboutMe, onUpdate }: { aboutMe: string, onUpdate: (content: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(aboutMe);

  useEffect(() => {
    setContent(aboutMe);
  }, [aboutMe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(content);
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">About Me</h2>
        <Button onClick={() => setIsEditing(!isEditing)} className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      {isEditing ? (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Edit About Me</CardTitle>
            <CardDescription>Write about yourself, your experience, and expertise</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  rows={12}
                  placeholder="I am an Executive Producer (filmmaker), HR, Sales Manager, and Marketing Manager with 12 years of experience..."
                  required 
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">Save</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white">
          <CardContent className="p-6">
            {aboutMe ? (
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{aboutMe}</p>
              </div>
            ) : (
              <p className="text-gray-400 italic">No content yet. Click Edit to add your about me section.</p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}

function SkillsSection({ skills, onAdd }: { skills: Skill[], onAdd: (skill: Skill) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    level: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', level: '' });
    setShowForm(false);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Skills</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {showForm && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Add Skill</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Skill Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="level">Level</Label>
                <Input id="level" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} placeholder="e.g., Expert, Intermediate" required />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-[#1A4DA1] hover:bg-[#0d3a8a]">Add</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-4">
              <h3 className="font-semibold">{skill.name}</h3>
              <p className="text-sm text-[#1A4DA1]">{skill.level}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
