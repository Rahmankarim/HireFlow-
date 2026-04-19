'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { JobCard } from '@/components/job-card';
import { SearchBar } from '@/components/search-bar';
import { SalaryRangeSlider } from '@/components/salary-range-slider';
import { Input } from '@/components/ui/input';

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
    full_name: string;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function JobsPage() {
  const { user, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [search, setSearch] = useState('');
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 300000]);

  const fetchJobs = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
      });

      if (search) params.append('search', search);
      if (location) params.append('location', location);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = await response.json();

      if (data.jobs) {
        setJobs(data.jobs);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [search, location]);

  useEffect(() => {
    if (!authLoading && !user) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void fetchJobs(1);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [authLoading, user, fetchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(1);
  };

  if (authLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
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
        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Search */}
          <div className="md:col-span-2">
            <SearchBar
              placeholder="Search jobs by title or keyword..."
              onSearch={setSearch}
              debounceDelay={500}
            />
          </div>

          {/* Location Filter */}
          <div>
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button
              onClick={() => fetchJobs(1)}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {/* Salary Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Filter by Salary</CardTitle>
          </CardHeader>
          <CardContent>
            <SalaryRangeSlider
              min={0}
              max={300000}
              step={5000}
              onChange={setSalaryRange}
              formatLabel={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
          </CardContent>
        </Card>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.users.full_name}
                  location={job.location}
                  salary_min={job.salary_min}
                  salary_max={job.salary_max}
                  job_type={job.job_type}
                  experience_level={job.experience_level}
                  skills_required={job.skills_required}
                  description={job.description}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8 flex-wrap">
                <Button
                  onClick={() => {
                    fetchJobs(pagination.page - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={pagination.page === 1 || loading}
                  variant="outline"
                >
                  Previous
                </Button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, pagination.page - 2),
                    Math.min(pagination.pages, pagination.page + 1)
                  )
                  .map((pageNum) => (
                    <Button
                      key={pageNum}
                      onClick={() => {
                        fetchJobs(pageNum);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      variant={pageNum === pagination.page ? 'default' : 'outline'}
                      disabled={loading}
                    >
                      {pageNum}
                    </Button>
                  ))}

                <Button
                  onClick={() => {
                    fetchJobs(pagination.page + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={pagination.page === pagination.pages || loading}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No jobs found. Try adjusting your search.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
