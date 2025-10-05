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
      content: "I am an Executive Producer (filmmaker), HR, Sales Manager, and Marketing Manager with 12 years of experience in the media industry. I have extensive experience in developing and executing marketing and sales strategies, positioning, research, and branding for various production companies and Media Zone Authority 'towfour54'.\n\nMy expertise includes:\n• Producing multimedia content for TV, web, and social media platforms, including documentaries, commercials, and corporate videos\n• Managing sales and business development activities, generating over $5 million in revenue and securing long-term partnerships with key clients\n• Leading and mentoring teams of up to 20 creative professionals, enhancing employee relations and performance\n• Developing comprehensive sales and marketing plans for high-profile events\n• Establishing effective communication channels with various media outlets\n• Coordinating charity concerts and managing contracts and logistical details\n• Leading job analysis projects to evaluate and redesign positions\n• Designing and implementing performance management systems\n• Creating training and development programs for employees\n\nI hold a golden visa as a multimedia producer and am eager to contribute to the success of organizations while growing professionally. I am fluent in Arabic and English, with exceptional communication skills and celebrity contacts.",
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
