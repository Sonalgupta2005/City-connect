import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pickup, drop, stops = [] } = await req.json();
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');

    if (!GOOGLE_MAPS_API_KEY) {
      console.error('GOOGLE_MAPS_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!pickup || !drop) {
      return new Response(
        JSON.stringify({ error: 'Pickup and drop locations are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Calculating distance:', { pickup, drop, stops });

    // Build waypoints string for stops
    let waypoints = '';
    if (stops && stops.length > 0) {
      waypoints = stops.join('|');
    }

    // Call Google Distance Matrix API
    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.append('origins', pickup);
    url.searchParams.append('destinations', drop);
    if (waypoints) {
      url.searchParams.append('waypoints', waypoints);
    }
    url.searchParams.append('key', GOOGLE_MAPS_API_KEY);
    url.searchParams.append('units', 'metric');

    console.log('Calling Distance Matrix API');
    const response = await fetch(url.toString());
    const data = await response.json();

    console.log('Distance Matrix response:', JSON.stringify(data));

    if (data.status !== 'OK') {
      console.error('Distance Matrix API error:', data.status, data.error_message);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to calculate distance', 
          details: data.error_message || data.status 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const element = data.rows[0]?.elements[0];
    if (!element || element.status !== 'OK') {
      console.error('No valid route found:', element?.status);
      return new Response(
        JSON.stringify({ error: 'No valid route found between these locations' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract distance in kilometers
    const distanceInMeters = element.distance.value;
    const distanceInKm = distanceInMeters / 1000;
    const durationInSeconds = element.duration.value;
    const durationInMinutes = Math.round(durationInSeconds / 60);

    console.log('Calculated distance:', distanceInKm, 'km');

    return new Response(
      JSON.stringify({ 
        distance: distanceInKm,
        duration: durationInMinutes,
        distanceText: element.distance.text,
        durationText: element.duration.text
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in calculate-distance function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
