import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    const data = await readData();
    console.log('Testimonials API - Full data:', data);
    console.log('Testimonials API - Testimonials data:', data.testimonials);
    return NextResponse.json(data.testimonials || []);
  } catch (error) {
    console.error('Testimonials API - Error:', error);
    return NextResponse.json({ error: 'Failed to read testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const testimonial = await request.json();
    const data = await readData();
    
    if (!data.testimonials) {
      data.testimonials = [];
    }
    
    data.testimonials.push(testimonial);
    await writeData(data);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add testimonial' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const index = searchParams.get('index');
    
    if (index === null) {
      return NextResponse.json({ error: 'Index is required' }, { status: 400 });
    }
    
    const updatedTestimonial = await request.json();
    const data = await readData();
    data.testimonials[parseInt(index)] = updatedTestimonial;
    await writeData(data);
    
    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const index = searchParams.get('index');
    
    if (index === null) {
      return NextResponse.json({ error: 'Index is required' }, { status: 400 });
    }
    
    const data = await readData();
    data.testimonials.splice(parseInt(index), 1);
    await writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
