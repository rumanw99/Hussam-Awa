import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.blog || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read blog posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const newPost = await request.json();
    const data = readData();
    
    if (!data.blog) {
      data.blog = [];
    }
    
    // Generate unique ID
    const id = Date.now().toString();
    const post = { id, ...newPost };
    
    data.blog.push(post);
    writeData(data);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add blog post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id === null) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const updatedPost = await request.json();
    const data = readData();
    
    if (!data.blog) {
      data.blog = [];
    }
    
    const index = data.blog.findIndex((post: any) => post.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    data.blog[index] = { id, ...updatedPost };
    writeData(data);
    
    return NextResponse.json(data.blog[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id === null) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const data = readData();
    
    if (!data.blog) {
      data.blog = [];
    }
    
    const index = data.blog.findIndex((post: any) => post.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    data.blog.splice(index, 1);
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
