'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { KanbanBoard } from '@/components/recruiter/kanban-board';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PipelineStage {
  id: string;
  name: string;
  order_index: number;
}

interface Application {
  id: string;
  status: string;
  applicant_id: string;
  pipeline_stage_id: string;
  users: {
    full_name: string;
    email: string;
    avatar_url: string;
  };
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary_min: number;
  salary_max: number;
  job_type: string;
  experience_level: string;
  status: string;
  created_at: string;
  applications: Application[];
  pipeline_stages: PipelineStage[];
}

export default function RecruiterDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('kanban');

  const fetchJobs = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/recruiter/jobs?recruiterId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data);
        if (data.length > 0 && !selectedJobId) {
          setSelectedJobId(data[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedJobId]);

  useEffect(() => {
    if (!authLoading && user && user.role === 'recruiter') {
      const timeoutId = window.setTimeout(() => {
        void fetchJobs();
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [authLoading, user, fetchJobs]);

  const handleDragEnd = async (applicationId: string, newStageId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          pipeline_stage_id: newStageId,
        }),
      });

      if (response.ok) {
        // Update local state
        setJobs((prevJobs) =>
          prevJobs.map((job) => ({
            ...job,
            applications: job.applications.map((app) =>
              app.id === applicationId
                ? { ...app, pipeline_stage_id: newStageId }
                : app
            ),
          }))
        );
      }
    } catch (error) {
      console.error('Failed to update application:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-gray-600">Welcome, {user.full_name}</span>
                <Button
                  onClick={() => {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_id');
                    window.location.href = '/auth/login';
                  }}
                  variant="outline"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Jobs List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Jobs</CardTitle>
                <CardDescription>{jobs.length} job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {jobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => setSelectedJobId(job.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedJobId === job.id
                          ? 'bg-blue-100 border-l-4 border-blue-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {job.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {job.applications.length} applications
                      </p>
                    </button>
                  ))}
                </div>

                <Link href="/recruiter/jobs/new">
                  <Button className="w-full mt-4">Post New Job</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Job Details and Kanban */}
          <div className="lg:col-span-3">
            {selectedJob ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{selectedJob.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {selectedJob.applications.length} applications
                      </CardDescription>
                    </div>
                    <Link href={`/recruiter/jobs/${selectedJob.id}/edit`}>
                      <Button variant="outline">Edit Job</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                      <TabsTrigger value="kanban">Pipeline</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="kanban" className="mt-6">
                      {selectedJob.applications.length > 0 ? (
                        <KanbanBoard
                          applications={selectedJob.applications}
                          stages={selectedJob.pipeline_stages.sort(
                            (a, b) => a.order_index - b.order_index
                          )}
                          onDragEnd={handleDragEnd}
                        />
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <p>No applications yet</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="details" className="mt-6 space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Job Description</h4>
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {selectedJob.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Location</p>
                          <p className="text-gray-600">{selectedJob.location || 'Remote'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Job Type</p>
                          <p className="text-gray-600">{selectedJob.job_type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Experience Level
                          </p>
                          <p className="text-gray-600">{selectedJob.experience_level}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Salary Range</p>
                          <p className="text-gray-600">
                            ${selectedJob.salary_min?.toLocaleString()} -{' '}
                            ${selectedJob.salary_max?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 mb-4">No job selected or no jobs available</p>
                  <Link href="/recruiter/jobs/new">
                    <Button>Create Your First Job</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
