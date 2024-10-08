'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { getProjectsCreated, getProjectsUpdated } from '@/lib/projectService';
import { Project } from '@/lib/projectTypes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [updatedProjects, setUpdatedProjects] = useState<Project[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'created' | 'updated'>('created'); // Controls active tab
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch projects and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const createdProjects = await getProjectsCreated();
        const updatedProjects = await getProjectsUpdated();

        setRecentProjects(createdProjects.slice(0, 6));
        setUpdatedProjects(updatedProjects.slice(0, 6));
        setDisplayedProjects(createdProjects.slice(0, 6)); // Display created by default

        // Calculate popular tags
        const allProjects = [...createdProjects, ...updatedProjects];
        const tagFrequency: { [tag: string]: number } = {};
        allProjects.forEach((project) => {
          project.tags.forEach((tag) => {
            tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
          });
        });

        // Sort tags by frequency and pick the top 5
        const sortedTags = Object.entries(tagFrequency)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([tag]) => tag);

        setPopularTags(sortedTags);
      } catch (err) {
        setError('Error loading projects');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle button click to switch between Created and Updated projects
  const handleTabClick = (tab: 'created' | 'updated') => {
    setActiveTab(tab);
    setDisplayedProjects(tab === 'created' ? recentProjects : updatedProjects);
  };

  // Navigate to the projects page with a specific tag
  const handleTagClick = (tag: string) => {
    router.push(`/projects?search=${tag}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="min-h-screen p-8 flex bg-gray-50">
      {/* Main content */}
      <div className="flex-1">
        <h1 className="text-4xl font-extrabold text-center mb-12">Welcome to Project Showcase</h1>

        {/* Toggle buttons for switching between Created and Updated */}
        <div className="mb-8 text-center">
          <button
            onClick={() => handleTabClick('created')}
            className={`px-4 py-2 mr-4 font-semibold rounded-md ${activeTab === 'created' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Recently Created
          </button>
          <button
            onClick={() => handleTabClick('updated')}
            className={`px-4 py-2 font-semibold rounded-md ${activeTab === 'updated' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Recently Updated
          </button>
        </div>

        {/* Display the projects based on activeTab */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Link href={`/projects/${project.id}`}>
                <Image
                  src={project.screenshots[0]}
                  alt={project.title}
                  width={500}
                  height={250}
                  className="object-cover w-full h-48"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="text-gray-600">
                    {project.description.length > 100 ? project.description.slice(0, 100) + '...' : project.description}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar for popular tags */}
      <aside className="w-1/4 pl-8 hidden lg:block ">
        <h2 className="text-2xl font-semibold mb-4">Popular Tags</h2>
        <div className="flex flex-col gap-2 ">
          {popularTags.map((tag) => (
            <span
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="text-blue-500 hover:underline cursor-pointer text-lg"
            >
              {tag}
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
}
