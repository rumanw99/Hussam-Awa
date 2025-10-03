import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.contact || {
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      socialLinks: {
        twitter: '',
        instagram: '',
        facebook: ''
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read contact info' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contactData = await request.json();
    const data = readData();
    data.contact = contactData;
    writeData(data);
    return NextResponse.json(contactData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact info' }, { status: 500 });
  }
}
