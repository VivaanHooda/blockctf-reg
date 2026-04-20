import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { supabase } = await import('@/lib/supabase');

    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'registrations_open');

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ registrationsOpen: true });
    }

    // Handle if table doesn't exist or row doesn't exist
    if (!data || data.length === 0) {
      return NextResponse.json({ registrationsOpen: true });
    }

    const value = data[0].value;
    // The value is stored as JSONB, so it could be true/false or 'true'/'false'
    const registrationsOpen = value === true || value === 'true';

    return NextResponse.json({ registrationsOpen });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings', registrationsOpen: true },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { registrationsOpen } = await request.json();

    if (typeof registrationsOpen !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const { supabase } = await import('@/lib/supabase');

    // First try to update
    const { data: updateData, error: updateError } = await supabase
      .from('settings')
      .update({ value: registrationsOpen, updated_at: new Date().toISOString() })
      .eq('key', 'registrations_open')
      .select();

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update settings', details: updateError.message },
        { status: 500 }
      );
    }

    // If no rows were updated, try to insert
    if (!updateData || updateData.length === 0) {
      const { data: insertData, error: insertError } = await supabase
        .from('settings')
        .insert({ key: 'registrations_open', value: registrationsOpen })
        .select();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        return NextResponse.json(
          { error: 'Failed to create settings', details: insertError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        registrationsOpen: insertData[0].value,
        message: registrationsOpen ? 'Registrations opened' : 'Registrations closed',
      });
    }

    return NextResponse.json({
      success: true,
      registrationsOpen: updateData[0].value,
      message: registrationsOpen ? 'Registrations opened' : 'Registrations closed',
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
