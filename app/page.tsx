import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Users, TrendingUp, Zap, BarChart3, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TalentFlow ATS</span>
            </div>
            <div className="flex gap-4">
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Modern Recruitment
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Made Simple
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Streamline your hiring process with our powerful Applicant Tracking System. Connect with top talent and manage your recruitment pipeline effortlessly.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/register">
              <Button size="lg" className="px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="px-8">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <Card className="border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="pt-6">
              <Zap className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Manage your entire recruitment process from job posting to hiring in one intuitive platform.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Talent Collaboration
              </h3>
              <p className="text-gray-600">
                Connect with job seekers and recruiters in a thriving community dedicated to finding the perfect match.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="pt-6">
              <Lock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Enterprise-grade security with role-based access control to protect your sensitive hiring data.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* For Job Seekers Section */}
      <section className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                For Job Seekers
              </h2>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Browse thousands of job opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Track your applications in real-time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Get updates on your application status</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold mt-1">✓</span>
                  <span>Connect directly with recruiters</span>
                </li>
              </ul>
              <Link href="/jobs">
                <Button size="lg" className="mt-8">
                  Start Job Search
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-8 text-center">
              <TrendingUp className="w-24 h-24 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">
                Find your next opportunity with our advanced search and filtering tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Recruiters Section */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg p-8 text-center">
              <BarChart3 className="w-24 h-24 text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">
                Visualize and manage your entire recruitment pipeline with our powerful kanban board.
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                For Recruiters
              </h2>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold mt-1">✓</span>
                  <span>Post jobs in seconds</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold mt-1">✓</span>
                  <span>Drag-and-drop candidate management</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold mt-1">✓</span>
                  <span>Customizable pipeline stages</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold mt-1">✓</span>
                  <span>Built-in collaboration tools</span>
                </li>
              </ul>
              <Link href="/auth/register?role=recruiter">
                <Button size="lg" className="mt-8">
                  Start Recruiting
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to transform your hiring?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of companies already using TalentFlow ATS to build their dream teams.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white/20">
                Explore Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <span className="text-white font-bold">TalentFlow ATS</span>
              </div>
              <p className="text-sm">Modern recruitment made simple.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/jobs" className="hover:text-white">Jobs</Link></li>
                <li><Link href="/applications" className="hover:text-white">Applications</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 TalentFlow ATS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
