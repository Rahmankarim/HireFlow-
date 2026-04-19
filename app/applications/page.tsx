'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface Application {
  id: string;
  status: 'applied' | 'reviewing' | 'interview' | 'offered' | 'rejected' | 'withdrawn';
  applied_at: string;
  updated_at: string;
  cover_letter: string;
  jobs: {
    id: string;
    title: string;
    location: string;
    company: {
      full_name: string;
    };
  };
}

const statusConfig = {
  applied: { label: 'Applied', icon: Clock, color: 'text-blue-600 bg-blue-50' },
  reviewing: { label: 'Under Review', icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50' },
  interview: { label: 'Interview', icon: AlertCircle, color: 'text-purple-600 bg-purple-50' },
  offered: { label: 'Offered', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-600 bg-red-50' },
  withdrawn: { label: 'Withdrawn', icon: XCircle, color: 'text-gray-600 bg-gray-50' },
};

export default function ApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        userId: user.id,
      });

      if (selectedStatus) {
        params.append('status', selectedStatus);
      }

      const response = await fetch(`/api/applications?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedStatus]);

  useEffect(() => {
    if (!authLoading && user) {
      const timeoutId = window.setTimeout(() => {
        void fetchApplications();
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }
  }, [authLoading, user, fetchApplications]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
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
        {/* Status Filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <Button
            variant={selectedStatus === null ? 'default' : 'outline'}
            onClick={() => setSelectedStatus(null)}
          >
            All ({applications.length})
          </Button>

          {Object.entries(statusConfig).map(([status, config]) => {
            const count = applications.filter((app) => app.status === status).length;
            return (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                onClick={() => setSelectedStatus(status)}
              >
                {config.label} ({count})
              </Button>
            );
          })}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.length > 0 ? (
            applications.map((app) => {
              const config = statusConfig[app.status];
              const Icon = config.icon;

              return (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-1">{app.jobs.title}</CardTitle>
                        <CardDescription>{app.jobs.company.full_name}</CardDescription>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${config.color}`}>
                        <Icon className="w-4 h-4" />
                        {config.label}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Location:</span> {app.jobs.location || 'Remote'}
                        </div>
                        <div>
                          <span className="font-medium">Applied:</span>{' '}
                          {new Date(app.applied_at).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Updated:</span>{' '}
                          {new Date(app.updated_at).toLocaleDateString()}
                        </div>
                      </div>

                      {app.cover_letter && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Your Cover Letter:</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{app.cover_letter}</p>
                        </div>
                      )}

                      <Link href={`/jobs/${app.jobs.id}`}>
                        <Button variant="outline" size="sm">
                          View Job
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">
                  {selectedStatus
                    ? `No applications with status "${selectedStatus}"`
                    : 'You haven&apos;t applied to any jobs yet'}
                </p>
                <Link href="/jobs">
                  <Button>Browse Jobs</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
