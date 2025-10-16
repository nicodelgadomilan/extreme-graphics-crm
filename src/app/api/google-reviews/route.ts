import { NextRequest, NextResponse } from 'next/server';

const PLACE_ID = 'ChIJY2eY4TW5oo4RpEvlJv93SQs'; // Extreme Graphics USA

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      );
    }

    // Using Google Places API (New) - Place Details with reviews
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'reviews,rating,userRatingCount'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google Places API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch reviews from Google Places API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform reviews to match our format
    const reviews = data.reviews?.map((review: any) => ({
      name: review.authorAttribution?.displayName || 'Google User',
      text: review.text?.text || review.originalText?.text || '',
      rating: review.rating || 5,
      time: review.publishTime,
      profilePhoto: review.authorAttribution?.photoUri,
    })) || [];

    return NextResponse.json({
      reviews,
      averageRating: data.rating,
      totalReviews: data.userRatingCount
    });

  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}