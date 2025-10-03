'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

export default function ContactAdminPage() {
  const [contactData, setContactData] = useState({
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      facebook: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setContactData(data);
      }
    } catch (error) {
      console.error('Failed to fetch contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        alert('Contact information updated successfully!');
        fetchContactData();
      }
    } catch (error) {
      console.error('Failed to update contact data:', error);
      alert('Failed to update contact information. Please try again.');
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
        <h1 className="text-3xl font-montserrat font-bold text-[#333333]">Contact Information</h1>
        <p className="text-[#333333] font-inter">Manage your contact details and social media links</p>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="font-montserrat text-[#333333]">Edit Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  placeholder="hussam@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  placeholder="+971 50 123 4567"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={contactData.location}
                  onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                  placeholder="Dubai, UAE"
                  required
                />
              </div>

              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={contactData.linkedin}
                  onChange={(e) => setContactData({ ...contactData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#333333]">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={contactData.socialLinks.twitter}
                    onChange={(e) => setContactData({
                      ...contactData,
                      socialLinks: { ...contactData.socialLinks, twitter: e.target.value }
                    })}
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    type="url"
                    value={contactData.socialLinks.instagram}
                    onChange={(e) => setContactData({
                      ...contactData,
                      socialLinks: { ...contactData.socialLinks, instagram: e.target.value }
                    })}
                    placeholder="https://instagram.com/username"
                  />
                </div>

                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    type="url"
                    value={contactData.socialLinks.facebook}
                    onChange={(e) => setContactData({
                      ...contactData,
                      socialLinks: { ...contactData.socialLinks, facebook: e.target.value }
                    })}
                    placeholder="https://facebook.com/username"
                  />
                </div>
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
