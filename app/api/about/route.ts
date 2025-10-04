import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data.about || {
      title: "Golden Visa Holder",
      profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.16%20AM-Du2MSqMkvpngprQPjx6MyLl6NuUz3v.jpeg",
      content: "Experienced professional with a proven track record in media production, marketing, and team leadership. Golden Visa holder with extensive experience in Dubai's dynamic business environment. I specialize in creating compelling visual content and leading high-performing teams to deliver exceptional results.",
      stats: [
        { icon: "Briefcase", value: "12+", label: "Years Experience" },
        { icon: "DollarSign", value: "$5M+", label: "Revenue Generated" },
        { icon: "Users", value: "20+", label: "Team Members Led" },
        { icon: "Award", value: "100+", label: "Projects Completed" }
      ]
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read about data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const aboutData = await request.json();
    const data = await readData();
    data.about = aboutData;
    await writeData(data);
    return NextResponse.json(aboutData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update about data' }, { status: 500 });
  }
}
