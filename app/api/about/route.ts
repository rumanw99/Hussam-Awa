import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.about || {
      title: "Golden Visa Holder",
      profileImage: "",
      content: "",
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
    const data = readData();
    data.about = aboutData;
    writeData(data);
    return NextResponse.json(aboutData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update about data' }, { status: 500 });
  }
}
