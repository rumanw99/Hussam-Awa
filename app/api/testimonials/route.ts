import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    console.log('Testimonials API - Starting request...');
    const data = await readData();
    console.log('Testimonials API - Full data loaded:', !!data);
    console.log('Testimonials API - Testimonials data exists:', !!data.testimonials);
    console.log('Testimonials API - Testimonials count:', data.testimonials?.length || 0);
    
    // Default testimonials if none exist
    const defaultTestimonials = [
      {
        name: "Sarah Johnson",
        position: "CEO",
        company: "Tech Innovations Ltd",
        content: "Hussam delivered exceptional results on our corporate video project. His attention to detail and creative vision exceeded our expectations. Highly recommended!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      },
      {
        name: "Ahmed Al-Rashid",
        position: "Marketing Director",
        company: "Dubai Media Group",
        content: "Working with Hussam was a pleasure. His professionalism and expertise in media production helped us achieve outstanding results for our marketing campaigns.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      {
        name: "Emily Chen",
        position: "Event Manager",
        company: "Luxury Events Dubai",
        content: "Hussam's photography skills are outstanding. He captured every important moment of our event with incredible quality. Our clients were very impressed!",
        rating: 5,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      }
    ];
    
    // Use default testimonials if none exist
    const testimonials = data.testimonials && data.testimonials.length > 0 ? data.testimonials : defaultTestimonials;
    console.log('Testimonials API - Returning testimonials count:', testimonials.length);
    return NextResponse.json(testimonials);
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
