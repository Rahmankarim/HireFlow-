'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Briefcase, Heart } from 'lucide-react';
import { useState } from 'react';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  job_type?: string;
  experience_level?: string;
  skills_required?: string[];
  description?: string;
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

export function JobCard({
  id,
  title,
  company,
  location,
  salary_min,
  salary_max,
  job_type,
  experience_level,
  skills_required = [],
  description,
  onSave,
  isSaved = false,
}: JobCardProps) {
  const [saved, setSaved] = useState(isSaved);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    setSaved(!saved);
    onSave?.(id);
  };

  const salaryText =
    salary_min && salary_max
      ? `$${(salary_min / 1000).toFixed(0)}k - $${(salary_max / 1000).toFixed(0)}k`
      : 'Salary not specified';

  return (
    <Link href={`/jobs/${id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-600">{company}</p>
            </div>
            <button
              onClick={handleSave}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  saved ? 'fill-red-500 text-red-500' : 'text-gray-400'
                }`}
              />
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Location and Type */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            {job_type && (
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                <span>{job_type}</span>
              </div>
            )}
            {salary_min && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{salaryText}</span>
              </div>
            )}
          </div>

          {/* Experience Level */}
          {experience_level && (
            <div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-900">
                {experience_level}
              </Badge>
            </div>
          )}

          {/* Skills */}
          {skills_required && skills_required.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {skills_required.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {skills_required.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{skills_required.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Description Preview */}
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          )}

          {/* Apply Button */}
          <Button
            className="w-full mt-4"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
