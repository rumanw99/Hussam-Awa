import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '../../../lib/data';

export async function GET(request: NextRequest) {
  try {
    const data = readData();
    return NextResponse.json(data.settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedSettings = await request.json();
    const data = readData();
    data.settings = { ...data.settings, ...updatedSettings };
    writeData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
