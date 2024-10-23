'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProjects } from '@/lib/projectService'
import { Project } from '@/lib/projectTypes'

const ProjectsPageContent = () => {
  const [projects, setProjects] = useState<Project[]>([]) // Initialize projects as an empty array
  const [tagFrequency, setTagFrequency] = useState<{ [tag: string]: number }>(
    {}
  ) // State for tag frequency
  const searchParams = useSearchParams() // Hook to get the query params
  const searchTerm = searchParams?.get('search') || '' // Get search term from URL
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects()
        setProjects(data)

        // Calculate tag frequency
        const frequency: { [tag: string]: number } = {}
        data.forEach((project) => {
          project.tags.forEach((tag) => {
            frequency[tag] = (frequency[tag] || 0) + 1
          })
        })
        setTagFrequency(frequency)
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }

    fetchProjects()
    const intervalId = setInterval(fetchProjects, 30000) // Refetch every xx seconds
    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [])

  // Filter projects based on the search term from URL query params
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      project.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.author &&
        project.author.toLowerCase().includes(searchTerm.toLowerCase())) || // Check for null or undefined
      (project.description &&
        project.description.toLowerCase().includes(searchTerm.toLowerCase())) // Check for null or undefined
  )

  // Navigate to the projects page with a specific tag or type as a search parameter
  const handleTagClick = (event: React.MouseEvent, tag: string) => {
    event.preventDefault()
    event.stopPropagation()
    router.push(`/projects?search=${tag}`)
  }

  const handleTypeClick = (event: React.MouseEvent, type: string) => {
    event.preventDefault()
    event.stopPropagation()
    router.push(`/projects?search=${type}`)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='py-8'>
        <h1 className='mb-12 text-center text-4xl font-extrabold text-gray-800'>
          Project Showcase
        </h1>

        {/* Display the number of filtered projects */}
        <div className='mb-4 text-center'>
          {filteredProjects.length > 0 ? (
            <p className='text-lg text-gray-600'>
              {filteredProjects.length}{' '}
              {filteredProjects.length === 1 ? 'project' : 'projects'} found
              {searchTerm ? ` with "${searchTerm}".` : '.'}
            </p>
          ) : (
            <p className='text-lg text-gray-600'>
              {searchTerm
                ? `No projects found with "${searchTerm}".`
                : `No projects found.`}
            </p>
          )}
        </div>

        {/* Display filtered projects */}
        {filteredProjects.length > 0 ? (
          <div className='grid grid-cols-1 gap-12 px-4 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className='flex transform flex-col overflow-hidden rounded-lg bg-white shadow-md transition duration-300 ease-in-out hover:shadow-xl'
              >
                <Link
                  href={`/projects/${project.id}`}
                  className='block flex-grow'
                >
                  <Image
                    src={project.screenshots[0] || '/default-image.jpg'}
                    alt={project.title}
                    width={500}
                    height={250}
                    onError={(e) => {
                      e.currentTarget.src = '/noscreenshot.png'
                    }}
                    className='h-48 w-full object-contain'
                  />
                  <div className='flex-grow p-6'>
                    <h2 className='mb-2 text-xl font-semibold text-gray-800'>
                      {project.title}
                    </h2>
                    <p className='text-gray-600'>
                      {project.description?.length > 100
                        ? project.description.slice(0, 100) + '...'
                        : project.description || 'No description available.'}
                    </p>

                    {/* Clickable Type */}
                    <p className='mt-2 text-sm text-gray-500'>
                      Type:{' '}
                      <span
                        onClick={(event) =>
                          handleTypeClick(event, project.type)
                        }
                        className='cursor-pointer rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-600'
                      >
                        {project.type}
                      </span>
                    </p>

                    {/* Clickable Tags */}
                    <div className='mb-2 flex flex-wrap gap-1 text-sm text-gray-500'>
                      Tags:{' '}
                      {project.tags
                        .sort(
                          (a, b) =>
                            (tagFrequency[b] || 0) - (tagFrequency[a] || 0)
                        )
                        .slice(0, 5)
                        .map((tag) => (
                          <span
                            key={tag}
                            onClick={(event) => handleTagClick(event, tag)}
                            className='cursor-pointer rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-600'
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </Link>
                <div className='mt-auto p-6'>
                  {' '}
                  {/* mt-auto to push it to the bottom */}
                  <a
                    href={project.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-500 hover:underline'
                  >
                    Visit Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex items-center justify-center py-24'>
            <p className='text-lg text-gray-600'>No projects found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const ProjectsPage = () => {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen items-center justify-center'>
          Loading projects...
        </div>
      }
    >
      <ProjectsPageContent />
    </Suspense>
  )
}

export default ProjectsPage
