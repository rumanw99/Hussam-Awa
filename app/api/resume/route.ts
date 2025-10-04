import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET(request: NextRequest) {
  try {
    console.log('Resume API - Starting request...');
    const data = await readData();
    console.log('Resume API - Full data loaded:', !!data);
    console.log('Resume API - Resume data exists:', !!data.resume);
    console.log('Resume API - Experience count:', data.resume?.experience?.length || 0);
    console.log('Resume API - Skills count:', data.resume?.skills?.length || 0);
    
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (section) {
      if (!['experience', 'aboutMe', 'skills'].includes(section)) {
        return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
      }
      console.log(`Resume API - Returning section ${section}:`, data.resume[section]);
      return NextResponse.json(data.resume[section]);
    }

    // If no resume data, return default data
    const defaultResume = {
      experience: [
        {
          position: "Executive Producer",
          company: "Media Production Company",
          startDate: "2020",
          endDate: "Present",
          description: "Leading production teams and managing high-profile media projects. Overseeing creative direction and ensuring quality deliverables."
        },
        {
          position: "HR Manager",
          company: "Corporate Solutions Ltd",
          startDate: "2018",
          endDate: "2020",
          description: "Managed human resources operations, talent acquisition, and employee development programs. Implemented performance management systems."
        },
        {
          position: "Sales Manager",
          company: "Business Development Corp",
          startDate: "2015",
          endDate: "2018",
          description: "Led sales teams to exceed revenue targets. Developed strategic partnerships and managed key client relationships."
        }
      ],
      aboutMe: "Experienced professional with a proven track record in media production, marketing, and team leadership. Golden Visa holder with extensive experience in Dubai's dynamic business environment.",
      skills: [
        { name: "Project Management", level: 95 },
        { name: "Team Leadership", level: 90 },
        { name: "Media Production", level: 95 },
        { name: "Marketing Strategy", level: 85 },
        { name: "Sales Management", level: 88 },
        { name: "HR Operations", level: 82 }
      ]
    };

    // Check if resume data exists and has content
    const hasExperience = data.resume?.experience && data.resume.experience.length > 0;
    const hasSkills = data.resume?.skills && data.resume.skills.length > 0;
    const hasAboutMe = data.resume?.aboutMe && data.resume.aboutMe.trim() !== '';
    
    console.log('Resume API - Has experience:', hasExperience);
    console.log('Resume API - Has skills:', hasSkills);
    console.log('Resume API - Has aboutMe:', hasAboutMe);
    
    // Use default data if resume is empty or missing key sections
    const resumeData = (hasExperience || hasSkills || hasAboutMe) ? data.resume : defaultResume;
    console.log('Resume API - Returning resume data:', resumeData);
    console.log('Resume API - Experience count:', resumeData.experience?.length || 0);
    return NextResponse.json(resumeData);
  } catch (error) {
    console.error('Resume API - Error:', error);
    return NextResponse.json({ error: 'Failed to read resume' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, item, content, data: newData } = body;

    if (!section || !['experience', 'aboutMe', 'skills'].includes(section)) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }

    const data = await readData();
    
    // Handle aboutMe separately as it's a string, not an array
    if (section === 'aboutMe') {
      data.resume.aboutMe = content;
    } else if (newData) {
      // Replace entire section data (for edit/delete operations)
      data.resume[section] = newData;
    } else if (item) {
      // Add new item to section
      data.resume[section].push(item);
    }
    
    await writeData(data);
    return NextResponse.json(section === 'aboutMe' ? { content } : (newData || item), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add resume item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, items } = body;

    if (!section || !['experience', 'aboutMe', 'skills'].includes(section)) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }

    const data = await readData();
    data.resume[section] = items;
    await writeData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update resume section' }, { status: 500 });
  }
}
