import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateActivity } from '../hooks/useQueries';
import { Category } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function CreateActivityPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const createActivity = useCreateActivity();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '' as Category | '',
  });

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Please log in to create activities</p>
            <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.category) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const dateObj = new Date(formData.date);
      const timestamp = BigInt(dateObj.getTime() * 1_000_000);

      await createActivity.mutateAsync({
        title: formData.title,
        description: formData.description,
        date: timestamp,
        time: formData.time,
        location: formData.location,
        category: formData.category as Category,
      });

      toast.success('Activity created successfully!');
      navigate({ to: '/' });
    } catch (error) {
      toast.error('Failed to create activity');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Activities
      </Button>

      <Card className="max-w-2xl mx-auto shadow-lg border-2 border-orange-100">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-teal-50">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6 text-orange-500" />
            Create New Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Activity Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Basketball Tournament"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border-orange-200 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your activity..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="border-orange-200 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., School Gymnasium"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="border-orange-200 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as Category })}>
                <SelectTrigger id="category" className="border-orange-200 focus:border-orange-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Category.sports}>🏀 Sports</SelectItem>
                  <SelectItem value={Category.academic}>📚 Academic</SelectItem>
                  <SelectItem value={Category.arts}>🎨 Arts</SelectItem>
                  <SelectItem value={Category.social}>🎉 Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/' })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createActivity.isPending}
                className="flex-1 bg-gradient-to-r from-orange-500 to-teal-500 hover:from-orange-600 hover:to-teal-600 text-white"
              >
                {createActivity.isPending ? 'Creating...' : 'Create Activity'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
