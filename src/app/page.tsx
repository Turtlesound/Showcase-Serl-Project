'use client';

import { useState, useEffect } from 'react';
import { getProjectsCreated, getProjectsUpdated } from '@/lib/projectService'; // Import the new service functions
import { Project } from '@/lib/projectTypes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Image

export default function HomePage() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [updatedProjects, setUpdatedProjects] = useState<Project[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const createdProjects = await getProjectsCreated(); // Fetch recently created projects
        const updatedProjects = await getProjectsUpdated(); // Fetch recently updated projects
        setRecentProjects(createdProjects.slice(0, 6)); // Limit to top 6 recent projects
        setUpdatedProjects(updatedProjects.slice(0, 6)); // Limit to top 6 updated projects

        // Collect tags from both lists and calculate their frequency
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
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12">Welcome to Project Showcase</h1>

      {/* Recently Added Projects */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Recently Added Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProjects.map((project) => (
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
                  <p className="text-gray-600">{project.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Updated Projects */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Recently Updated Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {updatedProjects.map((project) => (
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
                  <p className="text-gray-600">{project.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Tags Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
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
      </section>
    </div>
  );
}
