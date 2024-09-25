'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:3000/projects.json');
      const data = await res.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects(); // Initial fetch
  }, []);

  useEffect(() => {
    // Filter the projects based on the search term
    const filtered = projects.filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-12">
          Project Showcase
        </h1>


        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
            {filteredProjects.map((project) => (
              // Wrap the whole card in Link to make the project clickable
              <Link href={`/projects/${project.id}`} key={project.id} className="rounded-lg bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div>
                  <Image
                    src={project.screenshots[0]}
                    alt={project.title}
                    width={500}
                    height={250}
                    className="object-cover w-full h-48"
                  />
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {project.title}
                    </h2>
                    <p className="text-gray-600">{project.description}</p>
                    <p className="text-sm text-gray-500 mt-2">Type: {project.type}</p>
                    <p className="text-sm text-gray-500 mt-2">Author: {project.author}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-24">
            <p className="text-lg text-gray-600">No projects found matching the filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
