import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    const data = readData();
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
    const data = readData();
    data.hero = heroData;
    writeData(data);
    return NextResponse.json(heroData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update hero data' }, { status: 500 });
  }
}
