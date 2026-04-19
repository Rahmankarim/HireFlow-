'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { MapPin, DollarSign, Briefcase, ArrowLeft } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary_min: number;
  salary_max: number;
  job_type: string;
  experience_level: string;
  skills_required: string[];
  created_at: string;
  users: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    location: string;
    avatar_url: string;
  };
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setJob(data);
        }
      } catch (error) {
        console.error('Failed to fetch job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.id]);

  const handleApply = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setApplying(true);
    try {
      const response = await fetch(`/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user.id,
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          jobId: params.id,
          coverLetter,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setCoverLetter('');
        setTimeout(() => {
          router.push('/applications');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to apply:', error);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/jobs">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
              </Button>
            </Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Job not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/jobs">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
                <CardDescription className="text-lg">{job.users.full_name}</CardDescription>
              </div>
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full h-fit">
                {job.job_type}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{job.location || 'Remote'}</span>
              </div>

              {job.salary_min && job.salary_max && (
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-5 h-5" />
                  <span>
                    ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-5 h-5" />
                <span>{job.experience_level}</span>
              </div>
            </div>

            <div className="prose prose-sm max-w-none mb-6">
              <h3 className="font-semibold text-gray-900">Job Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
            </div>

            {job.skills_required && job.skills_required.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recruiter Contact Info */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Contact Recruiter</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Name:</strong> {job.users.full_name}
                </p>
                {job.users.email && (
                  <p>
                    <strong>Email:</strong> {job.users.email}
                  </p>
                )}
                {job.users.phone && (
                  <p>
                    <strong>Phone:</strong> {job.users.phone}
                  </p>
                )}
                {job.users.location && (
                  <p>
                    <strong>Location:</strong> {job.users.location}
                  </p>
                )}
              </div>
            </div>

            {/* Application Form */}
            {user && user.role === 'job_seeker' && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Apply for this position</CardTitle>
                </CardHeader>
                <CardContent>
                  {success ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700">
                      Application submitted successfully! Redirecting...
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleApply();
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cover Letter (Optional)
                        </label>
                        <textarea
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          placeholder="Tell the recruiter why you&apos;re a great fit for this role..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={applying}
                        className="w-full"
                      >
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            )}

            {!user && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <p className="text-gray-600 mb-4">
                    Please sign in to apply for this position.
                  </p>
                  <Link href="/auth/login">
                    <Button className="w-full">Sign In to Apply</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
