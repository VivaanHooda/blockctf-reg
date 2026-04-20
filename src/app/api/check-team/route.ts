import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json({ message: 'Team name is required' }, { status: 400 });
    }

    const { supabase } = await import('@/lib/supabase');

    const { data, error } = await supabase
      .from('registrations')
      .select('team_name')
      .ilike('team_name', name)
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ message: 'Database error while checking team name' }, { status: 500 });
    }

    const isAvailable = !data || data.length === 0;

    return NextResponse.json({ available: isAvailable });
  } catch (error) {
    console.error('Team check error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
