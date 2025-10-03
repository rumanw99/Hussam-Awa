import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.photos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read photos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newPhoto = await request.json();
    const data = readData();
    data.photos.push(newPhoto);
    writeData(data);
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
    const data = readData();
    data.photos[parseInt(index)] = updatedPhoto;
    writeData(data);
    
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
    
    const data = readData();
    data.photos.splice(parseInt(index), 1);
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}