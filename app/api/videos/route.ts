import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    console.log('Videos API - Starting request...');
    const data = await readData();
    console.log('Videos API - Full data loaded:', !!data);
    console.log('Videos API - Videos data exists:', !!data.videos);
    console.log('Videos API - Videos count:', data.videos?.length || 0);
    console.log('Videos API - First video from data:', data.videos?.[0]?.url);
    
    // Default videos if none exist
    const defaultVideos = [
      {
        title: "Video 1",
        description: "Professional video showcasing my work",
        url: "/video/WhatsApp Video 2025-09-30 at 12.22.59 AM.mp4",
        thumbnail: "/video-production-thumbnail.png"
      },
      {
        title: "Video 2",
        description: "High-quality corporate video production",
        url: "/video/WhatsApp Video 2025-09-30 at 12.23.01 AM.mp4",
        thumbnail: "/video-production-thumbnail.png"
      },
      {
        title: "Video 3",
        description: "Creative video production showcase",
        url: "/video/WhatsApp Video 2025-09-30 at 12.23.04 AM.mp4",
        thumbnail: "/video-production-thumbnail.png"
      }
    ];
    
    // Use default videos if none exist
    const videos = data.videos && data.videos.length > 0 ? data.videos : defaultVideos;
    console.log('Videos API - Data videos count:', data.videos?.length || 0);
    console.log('Videos API - Default videos count:', defaultVideos.length);
    console.log('Videos API - Returning videos count:', videos.length);
    console.log('Videos API - First video URL:', videos[0]?.url);
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Videos API - Error:', error);
    return NextResponse.json({ error: 'Failed to read videos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newVideo = await request.json();
    const data = await readData();
    data.videos.push(newVideo);
    await writeData(data);
    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add video' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const index = searchParams.get('index');
    
    if (index === null) {
      return NextResponse.json({ error: 'Index is required' }, { status: 400 });
    }
    
    const updatedVideo = await request.json();
    const data = await readData();
    data.videos[parseInt(index)] = updatedVideo;
    await writeData(data);
    
    return NextResponse.json(updatedVideo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
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
    data.videos.splice(parseInt(index), 1);
    await writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}