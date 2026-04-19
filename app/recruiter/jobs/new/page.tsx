'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { ArrowLeft } from 'lucide-react';

export default function NewJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [experienceLevel, setExperienceLevel] = useState('Mid-level');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to post a job');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/recruiter/jobs?recruiterId=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          title,
          description,
          location,
          job_type: jobType,
          experience_level: experienceLevel,
          salary_min: salaryMin ? parseInt(salaryMin) : null,
          salary_max: salaryMax ? parseInt(salaryMax) : null,
          skills_required: skillsRequired
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s),
        }),
      });

      if (response.ok) {
        const job = await response.json();
        router.push('/recruiter/dashboard');
      } else {
        setError('Failed to create job posting');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/recruiter/dashboard">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Post a New Job</CardTitle>
            <CardDescription>Fill in the details about your job opening</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              <FieldGroup>
                <FieldLabel>Job Title*</FieldLabel>
                <Input
                  placeholder="e.g., Senior Frontend Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Job Description*</FieldLabel>
                <textarea
                  placeholder="Describe the position, responsibilities, and qualifications..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </FieldGroup>

              <div className="grid grid-cols-2 gap-6">
                <FieldGroup>
                  <FieldLabel>Location</FieldLabel>
                  <Input
                    placeholder="e.g., New York, NY or Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Job Type</FieldLabel>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </FieldGroup>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FieldGroup>
                  <FieldLabel>Experience Level</FieldLabel>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Entry-level</option>
                    <option>Mid-level</option>
                    <option>Senior</option>
                    <option>Lead</option>
                  </select>
                </FieldGroup>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FieldGroup>
                  <FieldLabel>Minimum Salary</FieldLabel>
                  <Input
                    type="number"
                    placeholder="e.g., 80000"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                  />
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>Maximum Salary</FieldLabel>
                  <Input
                    type="number"
                    placeholder="e.g., 120000"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                  />
                </FieldGroup>
              </div>

              <FieldGroup>
                <FieldLabel>Required Skills (comma-separated)</FieldLabel>
                <Input
                  placeholder="e.g., React, TypeScript, Node.js"
                  value={skillsRequired}
                  onChange={(e) => setSkillsRequired(e.target.value)}
                />
              </FieldGroup>

              <div className="flex gap-4 justify-end">
                <Link href="/recruiter/dashboard">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Post Job'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
