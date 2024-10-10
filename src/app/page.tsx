'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getProjectsCreated, getProjectsUpdated } from '@/lib/projectService';
import { Project } from '@/lib/projectTypes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const HomePageContent = () => {
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [updatedProjects, setUpdatedProjects] = useState<Project[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'created' | 'updated'>('created');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const createdProjects = await getProjectsCreated();
        const updatedProjects = await getProjectsUpdated();

        setRecentProjects(createdProjects.slice(0, 6));
        setUpdatedProjects(updatedProjects.slice(0, 6));
        setDisplayedProjects(createdProjects.slice(0, 6));

        const allProjects = [...createdProjects, ...updatedProjects];
        const tagFrequency: { [tag: string]: number } = {};
        allProjects.forEach((project) => {
          project.tags.forEach((tag) => {
            tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
          });
        });

        const sortedTags = Object.entries(tagFrequency)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 15)
          .map(([tag]) => tag);

        setPopularTags(sortedTags);
      } catch (err) {
        console.error(err);
        setError('Error loading projects');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabClick = (tab: 'created' | 'updated') => {
    setActiveTab(tab);
    setDisplayedProjects(tab === 'created' ? recentProjects : updatedProjects);
  };

  const handleTagClick = (event: React.MouseEvent, tag: string) => {
    event.preventDefault();
    event.stopPropagation();
    router.push(`/projects?search=${tag}`);
  };

  const handleTypeClick = (event: React.MouseEvent, type: string) => {
    event.preventDefault(); // Prevent the default link behavior
    event.stopPropagation(); // Stop the click event from propagating to the parent link
    router.push(`/projects?search=${type}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <h1 className="text-4xl font-extrabold text-center mb-12">Welcome to Project Showcase</h1>

      {/* Tab buttons for switching between Created and Updated */}
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

      <div className="flex flex-col md:flex-row justify-between px-4">
        {/* Main content - project listings */}
        <div className="flex-1 mr-0 md:mr-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProjects.length > 0 ? (
              displayedProjects.map((project) => (
                <div key={project.id} className="flex flex-col rounded-lg bg-white shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:shadow-xl">
                  <Link href={`/projects/${project.id}`} className="block flex-grow">
                    <Image
                      src={project.screenshots[0] || '/default-image.jpg'}
                      alt={project.title}
                      width={500}
                      height={250}
                      className="object-contain w-full h-48"
                    />
                    <div className="p-6 flex-grow">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h2>
                      <p className="text-gray-600">
                        {project.description?.length > 100
                          ? project.description.slice(0, 100) + '...'
                          : project.description || 'No description available.'}
                      </p>
                      {/* Clickable Type */}
                    <p className="text-sm text-gray-500 mt-2">
                      Type:{' '}
                      <span
                        onClick={(event) => handleTypeClick(event, project.type)}
                        className="bg-slate-200 text-slate-600 rounded-full px-3 py-1 text-sm font-semibold cursor-pointer"
                      >
                        {project.type}
                      </span>
                    </p>
                      <div className="text-sm text-gray-500 flex flex-wrap gap-1 mt-2">
                        Tags:
                        {project.tags
                          .slice(0, 5) // Limit to top 5 tags
                          .map((tag) => (
                            <span
                              key={tag}
                              onClick={(event) => handleTagClick(event, tag)}
                              className="bg-slate-200 text-slate-600 rounded-full px-3 py-1 text-sm font-semibold cursor-pointer"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  </Link>
                  <div className="p-6 mt-auto"> {/* Ensure Visit Project is always at the bottom */}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Visit Project
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-24">
                <p className="text-lg text-gray-600">No projects available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Popular Tags Sidebar */}
        <div className="w-full md:w-36 mt-8 md:mt-0">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.length > 0 ? (
                popularTags.map((tag) => (
                  <span
                    key={tag}
                    onClick={(event) => handleTagClick(event, tag)}
                    className="bg-slate-200 text-slate-600 rounded-full px-3 py-1 text-sm font-semibold cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <p className="text-gray-600">No popular tags available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading projects...</div>}>
      <HomePageContent />
    </Suspense>
  );
};

export default HomePage;
