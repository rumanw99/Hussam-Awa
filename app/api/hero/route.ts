import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data.hero || {
      name: "Hussam Awa",
      titles: ["Executive Producer", "HR Manager", "Sales Manager", "Marketing Manager"],
      description: "Golden Visa holder with 12+ years of experience in media production, marketing, and team leadership in Dubai's dynamic industry.",
      profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HUSSAM-6Lk8xXir2XB6TY1T0hIt5MJf8FXFPu.jpg"
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read hero data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const heroData = await request.json();
    console.log('Received hero data:', heroData);
    
    const data = await readData();
    console.log('Current data before update:', data.hero);
    
    data.hero = heroData;
    console.log('Updated data:', data.hero);
    
    await writeData(data);
    console.log('Data written successfully');
    
    // Verify the data was written correctly
    const verifyData = await readData();
    console.log('Verification - data after write:', verifyData.hero);
    
    return NextResponse.json({ 
      success: true, 
      data: heroData,
      message: 'Hero data updated successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating hero data:', error);
    return NextResponse.json({ 
      error: 'Failed to update hero data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
