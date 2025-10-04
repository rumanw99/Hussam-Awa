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

    console.log('Resume API - Returning full resume data:', data.resume);
    return NextResponse.json(data.resume);
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
