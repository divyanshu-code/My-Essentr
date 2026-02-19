import { NextResponse } from 'next/server';
import axios from 'axios';

// for map :- three packages 
// npm i react-leaflet 
// npm i leaflet
// npm i --save leaflet-geosearch  

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const q = searchParams.get('q');

  let url = 'https://nominatim.openstreetmap.org';
  if (q) {
    url += `/search?q=${encodeURIComponent(q)}&format=json&limit=1`;
  } else if (lat && lon) {
    url += `/reverse?lat=${lat}&lon=${lon}&format=json`;
  } else {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const response = await axios.get(url,
      {
        headers: {                                                                  
          'User-Agent': 'divyanshubisht5734@gmail.com'                          //  Nominatim requires a User-Agent (use your app name or email)
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}