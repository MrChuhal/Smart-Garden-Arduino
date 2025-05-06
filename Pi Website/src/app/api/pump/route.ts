import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: { json: () => PromiseLike<{ state: any; }> | { state: any; }; }) {
  try {
    const { state } = await request.json();
    interface PumpResponse {
      message: string;
    }

    const response = await axios.post<PumpResponse>('http://localhost:5000/pump', { state });
    return NextResponse.json({ message: response.data.message });
  } catch (error) {
    console.error('Error updating pump state:', error);
    return NextResponse.json({ error: 'Failed to update pump state' }, { status: 500 });
  }
}