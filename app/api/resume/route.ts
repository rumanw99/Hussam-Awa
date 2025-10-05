import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

// Helper function to convert text levels to numbers
function convertLevelToNumber(level: string | number): number {
  if (typeof level === 'number') return level;
  
  const levelMap: { [key: string]: number } = {
    'Expert': 95,
    'Advanced': 85,
    'Intermediate': 70,
    'Beginner': 50,
    'Novice': 30
  };
  
  return levelMap[level] || 50; // Default to 50 if unknown
}

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
          position: "Sales Manager",
          company: "iPro Group General Trading",
          startDate: "2021",
          endDate: "Present",
          description: "Achieving growth and hitting sales targets by successfully managing the sales team. Designing and implementing strategic sales plans that expand company's customer base and ensure strong presence. Managing recruiting, objectives setting, coaching and performance monitoring of sales representatives."
        },
        {
          position: "PR & Sales Manager",
          company: "SAMIT Event Management",
          startDate: "Aug 2022",
          endDate: "Present",
          description: "Orchestrated site selection for photography, securing permits through effective collaboration. Led cross-functional production team members to optimize workflow and meet project goals. Spearheaded identification and scheduling of actors and singers, ensuring cohesive production process."
        },
        {
          position: "Events Manager",
          company: "iPro General Trading FZLLC",
          startDate: "Jan 2019",
          endDate: "Aug 2023",
          description: "Developed and executed comprehensive sales and marketing plans for high-profile events. Established effective communication channels with various media outlets, enhancing event visibility. Successfully coordinated charity concerts, managing contracts and logistical details."
        },
        {
          position: "Executive Producer",
          company: "ProX Production FZLLC / Media Zone Authority",
          startDate: "Apr 2013",
          endDate: "Dec 2019",
          description: "Led job analysis project to evaluate and redesign current positions. Designed and implemented new performance management system to build performance culture and boost productivity. Supervised production of films, determined work schedules and correct workflow. Coordinated with television stations."
        },
        {
          position: "HR and Admin Manager",
          company: "Prox Production FZ LLC",
          startDate: "2017",
          endDate: "2021",
          description: "Led job analysis project to evaluate and redesign current positions. Designed and implemented new performance management system. Designed training and development system program, including employee training and new employee orientation program."
        }
      ],
      aboutMe: "I am an Executive Producer (filmmaker), HR, Sales Manager, and Marketing Manager with 12 years of experience in the media industry. I have extensive experience in developing and executing marketing and sales strategies, positioning, research, and branding for various production companies and Media Zone Authority 'towfour54'.",
      skills: [
        { name: "Strategic Planning and Execution", level: 95 },
        { name: "Team Leadership and Communication", level: 90 },
        { name: "Talent Management and Scheduling", level: 88 },
        { name: "Logistics and Operations Management", level: 92 },
        { name: "Budgeting and Negotiation", level: 85 },
        { name: "Marketing Strategy and Implementation", level: 90 },
        { name: "Media Relations and Communication", level: 88 },
        { name: "Celebrity and Influencer Relations", level: 90 },
        { name: "Multimedia Content Production", level: 95 },
        { name: "Event Management and Coordination", level: 92 },
        { name: "HR Management and Performance Systems", level: 85 },
        { name: "Business Development and Sales", level: 88 }
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
    
    // Convert text levels to numbers for skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      resumeData.skills = resumeData.skills.map((skill: any) => ({
        ...skill,
        level: convertLevelToNumber(skill.level)
      }));
    }
    
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
