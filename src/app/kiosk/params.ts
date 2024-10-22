import { NextRequest, NextResponse } from 'next/server';
import { getProjects, searchProjects } from '@/lib/projectService'; 

// Handle the dynamic route to show all projects or filtered projects
export async function GET(req: NextRequest, { params }: { params: { search?: string } }) {
  try {
    const searchQuery = params.search || null; // Extract search query if exists
    let projects;

    if (searchQuery) {
      // If search query exists, filter projects by it
      projects = await searchProjects(searchQuery);
    } else {
      // Otherwise, return all projects
      projects = await getProjects();
    }

    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching projects' }, { status: 500 });
  }
}
