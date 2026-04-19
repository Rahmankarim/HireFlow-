'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { NotificationBell } from '@/components/notification-bell';
import { Briefcase, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function MainHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    router.push('/auth/login');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TalentFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {user.role === 'job_seeker' && (
                  <>
                    <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
                      Browse Jobs
                    </Link>
                    <Link href="/applications" className="text-gray-600 hover:text-gray-900">
                      My Applications
                    </Link>
                  </>
                )}

                {user.role === 'recruiter' && (
                  <>
                    <Link href="/recruiter/dashboard" className="text-gray-600 hover:text-gray-900">
                      Dashboard
                    </Link>
                    <Link href="/recruiter/jobs/new" className="text-gray-600 hover:text-gray-900">
                      Post Job
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                    Admin Panel
                  </Link>
                )}

                <div className="flex items-center gap-4 ml-6 pl-6 border-l">
                  <NotificationBell />
                  <span className="text-sm text-gray-600">{user.full_name}</span>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
                  Jobs
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                {user.role === 'job_seeker' && (
                  <>
                    <Link href="/jobs" className="block py-2 text-gray-600 hover:text-gray-900">
                      Browse Jobs
                    </Link>
                    <Link href="/applications" className="block py-2 text-gray-600 hover:text-gray-900">
                      My Applications
                    </Link>
                  </>
                )}

                {user.role === 'recruiter' && (
                  <>
                    <Link href="/recruiter/dashboard" className="block py-2 text-gray-600 hover:text-gray-900">
                      Dashboard
                    </Link>
                    <Link href="/recruiter/jobs/new" className="block py-2 text-gray-600 hover:text-gray-900">
                      Post Job
                    </Link>
                  </>
                )}

                {user.role === 'admin' && (
                  <Link href="/admin/dashboard" className="block py-2 text-gray-600 hover:text-gray-900">
                    Admin Panel
                  </Link>
                )}

                <Button onClick={handleLogout} variant="outline" className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/jobs" className="block py-2 text-gray-600 hover:text-gray-900">
                  Jobs
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
