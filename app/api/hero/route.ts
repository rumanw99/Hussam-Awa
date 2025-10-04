import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    console.log('Hero API - Starting request...');
    
    // Try to get from database first (persistent cache)
    const { database } = await import('../../../lib/database');
    let heroData = await database.get('hero');
    
    if (heroData) {
      console.log('Hero API - Retrieved from database cache');
    } else {
      console.log('Hero API - Not in cache, loading from storage...');
      const data = await readData();
      heroData = data.hero;
    }
    
    // Fallback to default if no data
    if (!heroData) {
      heroData = {
        name: "Hussam Awa",
        titles: ["Executive Producer", "HR Manager", "Sales Manager", "Marketing Manager"],
        description: "Golden Visa holder with 12+ years of experience in media production, marketing, and team leadership in Dubai's dynamic industry.",
        profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HUSSAM-6Lk8xXir2XB6TY1T0hIt5MJf8FXFPu.jpg"
      };
    }
    
    console.log('Hero API - Returning hero data:', heroData);
    return NextResponse.json(heroData);
  } catch (error) {
    console.error('Hero API - Error:', error);
    return NextResponse.json({ error: 'Failed to read hero data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const heroData = await request.json();
    console.log('Received hero data:', heroData);
    
    // Validate required fields
    if (!heroData.name || !heroData.titles || !heroData.description) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: 'Name, titles, and description are required'
      }, { status: 400 });
    }
    
    // Save to database first (persistent cache)
    const { database } = await import('../../../lib/database');
    await database.set('hero', heroData);
    console.log('Hero data saved to database cache');
    
    // Also save to storage (file system)
    const data = await readData();
    data.hero = heroData;
    await writeData(data);
    console.log('Hero data saved to storage');
    
    return NextResponse.json({ 
      success: true, 
      data: heroData,
      message: 'Hero data updated successfully and persisted',
      environment: process.env.NODE_ENV
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating hero data:', error);
    return NextResponse.json({ 
      error: 'Failed to update hero data',
      details: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
}
