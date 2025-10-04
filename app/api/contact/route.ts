import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    console.log('Contact API - Starting request...');
    const data = await readData();
    console.log('Contact API - Full data loaded:', !!data);
    console.log('Contact API - Contact data exists:', !!data.contact);
    
    // Default contact data with Hussam Awa's real information
    const defaultContact = {
      email: 'hussam.awa@icloud.com',
      phone: '+971 50 1883240',
      location: 'Dubai Sports City, UAE',
      linkedin: 'https://www.linkedin.com/in/hussam-awa-aaa47998/',
      socialLinks: {
        twitter: '',
        instagram: '',
        facebook: ''
      }
    };
    
    const contactData = data.contact && data.contact.email ? data.contact : defaultContact;
    console.log('Contact API - Returning contact data:', contactData);
    return NextResponse.json(contactData);
  } catch (error) {
    console.error('Contact API - Error:', error);
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
