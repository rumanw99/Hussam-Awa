import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    console.log('Photos API - Starting request...');
    const data = await readData();
    console.log('Photos API - Full data loaded:', !!data);
    console.log('Photos API - Photos data exists:', !!data.photos);
    console.log('Photos API - Photos count:', data.photos?.length || 0);
    
    // Default photos if none exist
    const defaultPhotos = [
      {
        title: "Wedding Day",
        description: "Beautiful moments from a wedding ceremony.",
        category: "Wedding",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.17%20AM-260S0kGXlmtR6XxQXsdcDl9ZGLn8K0.jpeg"
      },
      {
        title: "Corporate Event",
        description: "Highlights from a corporate gathering.",
        category: "Corporate",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.18%20AM-kV9xEAuLTpUEnxVr0ue1ZzhNsCmaMi.jpeg"
      },
      {
        title: "Portrait Shoot",
        description: "Studio portrait photography.",
        category: "Portrait",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.17%20AM%20%281%29-elgrYlm3la1jNM3pcf56fvtAxVHks1.jpeg"
      },
      {
        title: "Event Photography",
        description: "Professional event coverage.",
        category: "Event",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.16%20AM-Du2MSqMkvpngprQPjx6MyLl6NuUz3v.jpeg"
      }
    ];
    
    // Use default photos if none exist
    const photos = data.photos && data.photos.length > 0 ? data.photos : defaultPhotos;
    console.log('Photos API - Returning photos count:', photos.length);
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Photos API - Error:', error);
    return NextResponse.json({ error: 'Failed to read photos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newPhoto = await request.json();
    const data = await readData();
    data.photos.push(newPhoto);
    await writeData(data);
    return NextResponse.json(newPhoto, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add photo' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const index = searchParams.get('index');
    
    if (index === null) {
      return NextResponse.json({ error: 'Index is required' }, { status: 400 });
    }
    
    const updatedPhoto = await request.json();
    const data = await readData();
    data.photos[parseInt(index)] = updatedPhoto;
    await writeData(data);
    
    return NextResponse.json(updatedPhoto);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 });
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
    data.photos.splice(parseInt(index), 1);
    await writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}