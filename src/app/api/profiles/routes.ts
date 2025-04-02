import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
  
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  
  let supabaseQuery = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (query) {
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,address.ilike.%${query}%`);
  }
  
  const { data, error } = await supabaseQuery;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
  
  const body = await request.json();
  
  if (!body.name || !body.description || !body.address || 
      body.latitude === undefined || body.longitude === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  const { data, error } = await supabase.from('profiles').insert({
    name: body.name,
    description: body.description,
    image_url: body.image_url || null,
    address: body.address,
    latitude: body.latitude,
    longitude: body.longitude,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }).select();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data[0], { status: 201 });
}