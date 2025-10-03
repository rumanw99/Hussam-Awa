import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.videos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read videos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newVideo = await request.json();
    const data = readData();
    data.videos.push(newVideo);
    writeData(data);
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
    const data = readData();
    data.videos[parseInt(index)] = updatedVideo;
    writeData(data);
    
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
    
    const data = readData();
    data.videos.splice(parseInt(index), 1);
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}