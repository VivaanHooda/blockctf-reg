import { NextRequest, NextResponse } from 'next/server';
import { registrationSchema } from '@/lib/validation';
import { sendRegistrationEmails } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the data
    const validatedData = registrationSchema.parse(body);

    // Lazy load supabase to avoid build time issues
    const { supabase } = await import('@/lib/supabase');

    const teamMembers = validatedData.members.map((member) => ({
      name: member.name,
      email: member.email,
      phone: member.phone,
      year: member.year,
      branch: member.branch,
      usn: member.usn,
    }));

    // Insert into Supabase with team info and members
    const { data, error } = await supabase
      .from('registrations')
      .insert([
        {
          team_name: validatedData.teamName,
          team_size: parseInt(validatedData.teamSize),
          members: teamMembers,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { message: error.message || 'Failed to save registration' },
        { status: 400 }
      );
    }

    // Send registration emails to all team members
    try {
      await sendRegistrationEmails({
        teamName: validatedData.teamName,
        members: teamMembers,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Note: We still return success since the registration was saved
      // The admin can manually send emails if needed
      return NextResponse.json(
        {
          message: 'Registration successful, but email notification could not be sent. Please check your email settings.',
          data: data,
          emailError: true,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        message: 'Registration successful! Confirmation emails have been sent to all team members. 🔗',
        data: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
