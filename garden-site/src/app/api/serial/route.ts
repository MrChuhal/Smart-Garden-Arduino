import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get('http://localhost:5000/serial');
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching serial data:', error);
    return NextResponse.json({ error: 'Failed to fetch serial data' }, { status: 500 });
  }
}