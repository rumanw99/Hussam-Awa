import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    console.log('About API - Starting request...');
    const data = await readData();
    console.log('About API - Data loaded:', data);
    
    const aboutData = data.about || {
      title: "Media Industry Expert",
      profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.16%20AM-Du2MSqMkvpngprQPjx6MyLl6NuUz3v.jpeg",
      content: "I am an Executive Producer (filmmaker), HR, Sales Manager, and Marketing Manager with 12 years of experience in the media industry. Seeking a senior position that leverages my skills in developing and executing marketing strategies, producing multimedia content, and leading creative teams to deliver exceptional results.\n\nMy expertise includes developing and executing marketing strategies, positioning, research, and branding for various production companies and Media Zone Authority \"twofour54\". I specialize in producing multimedia content for TV, web, and social media platforms, including documentaries, commercials, and corporate videos.\n\nWith a proven track record in managing sales and business development activities, I've generated over $5 million in revenue and secured long-term partnerships with key clients. I take pride in leading and mentoring teams of up to 20 creative professionals, enhancing employee relations and performance.",
      stats: [
        { icon: "Briefcase", value: "12+", label: "Years Experience" },
        { icon: "DollarSign", value: "$5M+", label: "Revenue Generated" },
        { icon: "Users", value: "20+", label: "Team Members Led" },
        { icon: "Award", value: "100+", label: "Projects Completed" }
      ]
    };
    
    console.log('About API - Returning data:', aboutData);
    return NextResponse.json(aboutData);
  } catch (error) {
    console.error('About API - Error:', error);
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
