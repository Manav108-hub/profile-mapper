import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .single();
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.code === 'PGRST116' ? 404 : 500 }
    );
  }
  
  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      name: body.name,
      description: body.description,
      image_url: body.image_url || null,
      address: body.address,
      latitude: body.latitude,
      longitude: body.longitude,
      updated_at: new Date().toISOString()
    })
    .eq('id', params.id)
    .select();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  if (data.length === 0) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }
  
  return NextResponse.json(data[0]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
  
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', params.id);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true }, { status: 200 });
}